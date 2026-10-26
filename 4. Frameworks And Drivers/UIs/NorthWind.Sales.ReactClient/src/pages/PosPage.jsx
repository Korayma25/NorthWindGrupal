import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerSearchModal from '../components/CustomerSearchModal';
import ProductSearchModal from '../components/ProductSearchModal';
import saleService from '../services/saleService';
import es from '../i18n/es';

// Ecuadorian Cédula Modulo 10 Validation helper
export const validateEcuadorianId = (id) => {
  if (!id || typeof id !== 'string' || id.length !== 10 || !/^\d+$/.test(id)) {
    return false;
  }
  const province = parseInt(id.substring(0, 2), 10);
  if ((province < 1 || province > 24) && province !== 30) {
    return false;
  }
  const thirdDigit = parseInt(id.charAt(2), 10);
  if (thirdDigit >= 6) {
    return false;
  }

  const coefficients = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    let val = parseInt(id.charAt(i), 10) * coefficients[i];
    if (val >= 10) val -= 9;
    sum += val;
  }

  const checkDigit = parseInt(id.charAt(9), 10);
  const calculatedCheck = (10 - (sum % 10)) % 10;
  return checkDigit === calculatedCheck;
};

function PosPage() {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [items, setItems] = useState([]);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedLineForReplace, setSelectedLineForReplace] = useState(null);
  const [itemToRemove, setItemToRemove] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [createdSaleId, setCreatedSaleId] = useState(null);

  const navigate = useNavigate();

  // Real-time calculations
  const subtotal = items.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
  const tax = subtotal * 0.15; // 15% Ecuador IVA
  const total = subtotal + tax;
  const currentDate = new Date().toLocaleDateString('es-EC', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  });

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setError(null);
  };

  const handleSelectProduct = (product) => {
    // If replacing an existing line, use the line reference (not index)
    if (selectedLineForReplace) {
      // Check if chosen product is already in another line (excluding the line being replaced)
      const isDuplicate = items.some(
        (it) => it !== selectedLineForReplace && it.productId === product.id
      );
      if (isDuplicate) {
        setError(es.createOrder.duplicateProductError || `El producto "${product.name}" ya se encuentra agregado en esta orden.`);
        setSelectedLineForReplace(null);
        return;
      }
      setError(null);

      const unitPrice = Number(product.unitPrice ?? product.price ?? 0);
      const stock = Number(product.unitsInStock ?? product.stock ?? 0);
      const taxRate = Number(product.taxRate ?? 0.15);

      // Preserve position and quantity (limited to stock of new product, minimum 1)
      const newQty = Math.max(1, Math.min(selectedLineForReplace.quantity, stock));

      setItems((prevItems) =>
        prevItems.map((it) => {
          if (it === selectedLineForReplace) {
            return {
              ...it,
              productId: product.id,
              code: product.code,
              name: product.name,
              unitPrice,
              stock,
              taxRate,
              quantity: newQty,
              subtotal: unitPrice * newQty,
            };
          }
          return it;
        })
      );
      setSelectedLineForReplace(null);
      return;
    }

    // Adding new product line
    const isDuplicate = items.some((it) => it.productId === product.id);
    if (isDuplicate) {
      setError(es.createOrder.duplicateProductError || `El producto "${product.name}" ya se encuentra agregado en esta orden.`);
      return;
    }
    setError(null);

    const unitPrice = Number(product.unitPrice ?? product.price ?? 0);
    const stock = Number(product.unitsInStock ?? product.stock ?? 0);
    const taxRate = Number(product.taxRate ?? 0.15);

    setItems((prevItems) => [
      ...prevItems,
      {
        productId: product.id,
        code: product.code,
        name: product.name,
        unitPrice,
        stock,
        taxRate,
        quantity: 1,
        subtotal: unitPrice,
      },
    ]);
  };

  const handleQuantityChange = (index, newQtyStr) => {
    const newQty = parseInt(newQtyStr, 10);
    const updated = [...items];
    const item = updated[index];

    if (isNaN(newQty) || newQty <= 0) {
      item.quantity = 0;
      item.subtotal = 0;
    } else if (newQty > item.stock) {
      setError(`La cantidad solicitada para "${item.name}" excede el stock disponible (${item.stock}).`);
      item.quantity = item.stock;
      item.subtotal = item.unitPrice * item.stock;
    } else {
      setError(null);
      item.quantity = newQty;
      item.subtotal = item.unitPrice * newQty;
    }
    setItems(updated);
  };

  const handleRemoveItem = (index) => {
    const updated = items.filter((_, idx) => idx !== index);
    setItems(updated);
    setError(null);
    setItemToRemove(null);
  };

  const handleOpenReplaceModal = (lineItem) => {
    setSelectedLineForReplace(lineItem);
    setIsProductModalOpen(true);
  };

  const handleOpenAddModal = () => {
    setSelectedLineForReplace(null);
    setIsProductModalOpen(true);
  };

  const handleSaveSale = async () => {
    setError(null);
    setSuccessMessage(null);

    if (!selectedCustomer) {
      setError('Por favor seleccione un cliente antes de procesar la venta.');
      return;
    }

    if (items.length === 0) {
      setError('Debe agregar al menos un producto al detalle de la venta.');
      return;
    }

    const invalidQtyItem = items.find((i) => !i.quantity || i.quantity <= 0);
    if (invalidQtyItem) {
      setError(`La cantidad del producto "${invalidQtyItem.name}" debe ser mayor a 0.`);
      return;
    }

    setLoading(true);

    try {
      const payload = {
        customerId: selectedCustomer.id,
        shipAddress: selectedCustomer.address || 'N/A',
        shipCity: selectedCustomer.city || 'N/A',
        shipCountry: selectedCustomer.country || 'N/A',
        shipPostalCode: selectedCustomer.postalCode || '',
        orderDetails: items.map((i) => ({
          productId: Number(i.productId),
          unitPrice: Number(i.unitPrice),
          quantity: Number(i.quantity)
        }))
      };

      const response = await saleService.createSale(payload);
      const orderId = typeof response === 'object' && response !== null && response.id
        ? response.id
        : (response?.data?.id ?? response?.data ?? response);

      setCreatedSaleId(orderId);
      setSuccessMessage(`¡Venta N° ${orderId} completada exitosamente!`);
      
      // Reset form state
      setSelectedCustomer(null);
      setItems([]);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error al guardar la venta. La transacción fue revertida.');
    } finally {
      setLoading(false);
    }
  };

  const isCustomerDocumentValid = selectedCustomer ? validateEcuadorianId(selectedCustomer.identityCard || selectedCustomer.document) : true;

  return (
    <div className="container pb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Sistema de facturación</h2>
        <span className="small text-muted fw-semibold">Fecha: {currentDate}</span>
      </div>

      {error && <div className="alert alert-danger shadow-sm mb-4 fw-semibold">{error}</div>}

      {successMessage && (
        <div className="alert alert-success shadow-sm mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <strong>Transacción Exitosa:</strong> {successMessage}
            </div>
            <div className="btn-group">
              <button
                className="btn btn-sm btn-outline-success"
                onClick={() => navigate(`/invoices/${createdSaleId}`)}
              >
                Ver Detalle Factura
              </button>
              <button
                className="btn btn-sm btn-success"
                onClick={() => saleService.downloadPdf(createdSaleId)}
              >
                Descargar PDF
              </button>
            </div>
          </div>
        </div>
      )}
              
      {/* Customer Header Section */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-light d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold text-secondary">Datos del Cliente</h5>
          <div className="d-flex flex-column align-items-end gap-1">
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setIsCustomerModalOpen(true)}
            >
               Buscar Cliente
            </button>
          </div>
        </div>
        <div className="card-body">
          {selectedCustomer ? (
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label text-muted small mb-1">Cédula / Documento</label>
                <div className="fw-bold">
                  {selectedCustomer.identityCard || selectedCustomer.document}{' '}
                  {isCustomerDocumentValid ? (
                    <span className="badge bg-success ms-1">Cédula Válida (EC)</span>) : 
                    (<span className="badge bg-warning text-dark ms-1">Documento / RUC</span>
                  )}
                </div>
              </div>
              <div className="col-md-4">
                <label className="form-label text-muted small mb-1">Nombre / Razón Social</label>
                <div className="fw-bold">{selectedCustomer.name}</div>
              </div>
              <div className="col-md-3">
                <label className="form-label text-muted small mb-1">Email</label>
                <div>{selectedCustomer.email || 'No registrado'}</div>
              </div>
              <div className="col-md-2 text-end">
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => setSelectedCustomer(null)}
                >
                  Cambiar Cliente
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-3 text-muted">
              <em>Ningún cliente seleccionado. Haga clic en "Buscar Cliente".</em>
            </div>
          )}
        </div>
      </div>

      {/* Detail Products Table */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-light d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold text-secondary">Detalle de la Venta</h5>
          <button
            className="btn btn-success btn-sm"
            onClick={handleOpenAddModal}
          >
            Agregar Producto
          </button>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{ width: '120px' }}>Código</th>
                  <th>Producto</th>
                  <th style={{ width: '130px' }} className="text-end">Precio Unit.</th>
                  <th style={{ width: '130px' }} className="text-center">Cantidad</th>
                  <th style={{ width: '140px' }} className="text-end">Subtotal</th>
                  <th style={{ width: '180px' }} className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">
                      Haga clic en "Agregar Producto" para añadir productos a la venta.
                    </td>
                  </tr>
                ) : (
                  items.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <span className="badge bg-dark">{item.code}</span>
                      </td>
                      <td className="fw-semibold">{item.name}</td>
                      <td className="text-end text-muted">
                        <input
                          type="text"
                          className="form-control form-control-sm text-end"
                          value={`$${item.unitPrice.toFixed(2)}`}
                          disabled
                          readOnly
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control form-control-sm text-center fw-bold"
                          min="1"
                          max={item.stock}
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(index, e.target.value)}
                        />
                        <small className="d-block text-center text-muted" style={{ fontSize: '0.75rem' }}>
                          Max: {item.stock}
                        </small>
                      </td>
                      <td className="text-end fw-bold text-success">
                        ${item.subtotal.toFixed(2)}
                      </td>
                      <td className="text-center">
                        <div className="btn-group btn-group-sm">
                          <button
                            type="button"
                            className="btn btn-outline-primary"
                            title={es.createOrder.changeProductButtonText}
                            onClick={() => handleOpenReplaceModal(item)}
                          >
                            {es.createOrder.changeProductButtonText}
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger"
                            title="Quitar línea"
                            onClick={() => setItemToRemove({ index, name: item.name })}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Totals & Submit Section */}
      <div className="row justify-content-end">
        <div className="col-md-5">
          <div className="card shadow-sm border-primary">
            <div className="card-body">
              <h5 className="card-title fw-bold text-primary mb-3">Resumen de Venta</h5>
              
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Subtotal:</span>
                <span className="fw-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">IVA (15%):</span>
                <span className="fw-semibold">${tax.toFixed(2)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3">
                <span className="fs-5 fw-bold">TOTAL:</span>
                <span className="fs-4 fw-bold text-success">${total.toFixed(2)}</span>
              </div>

              <button
                className="btn btn-success btn-lg w-100 fw-bold shadow-sm"
                onClick={handleSaveSale}
                disabled={loading || items.length === 0 || !selectedCustomer}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Procesando Transacción...
                  </>
                ) : (
                  'Confirmar y Guardar Venta'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CustomerSearchModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        onSelectCustomer={handleSelectCustomer}
      />

      <ProductSearchModal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setSelectedLineForReplace(null);
        }}
        onSelectProduct={handleSelectProduct}
        replaceLine={selectedLineForReplace}
      />

      {itemToRemove && (
        <div className="modal show d-block" tabIndex="-1" role="dialog" aria-modal="true">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content shadow">
              <div className="modal-header bg-light">
                <h5 className="modal-title">Confirmar eliminación</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Cerrar"
                  onClick={() => setItemToRemove(null)}
                ></button>
              </div>
              <div className="modal-body">
                ¿Está seguro de que desea eliminar el producto <strong>{itemToRemove.name}</strong> del detalle de venta?
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setItemToRemove(null)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleRemoveItem(itemToRemove.index)}
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PosPage;
