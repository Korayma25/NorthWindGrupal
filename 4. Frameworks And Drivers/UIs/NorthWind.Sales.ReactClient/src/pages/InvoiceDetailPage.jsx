import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import saleService from '../services/saleService';
import es from '../i18n/es';

function InvoiceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      setLoading(true);
      try {
        const response = await saleService.getSaleById(id);
        const invoiceData = response.data || response;
        setSale(invoiceData);
      } catch (err) {
        setError(err.response?.data?.message || 'No se pudo cargar la factura.');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando detalle de la factura...</span>
        </div>
      </div>
    );
  }

  if (error || !sale) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error || 'Factura no encontrada.'}</div>
        <button className="btn btn-secondary" onClick={() => navigate('/invoices')}>
          &laquo; Volver a Facturas
        </button>
      </div>
    );
  }

  return (
    <div className="container pb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <button className="btn btn-outline-secondary btn-sm mb-2" onClick={() => navigate('/invoices')}>
            &laquo; Volver a Facturas
          </button>
          <h2>Factura N° {sale.invoiceNumber || `#${String(sale.id).padStart(6, '0')}`}</h2>
        </div>
        <button className="btn btn-success shadow-sm" onClick={() => saleService.downloadPdf(sale.id)}>
          Descargar PDF
        </button>
      </div>

      {/* Invoice Header Details */}
      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-light fw-bold">{es.invoices.billingInfoHeader || 'Información de Facturación'}</div>
            <div className="card-body">
              <div className="d-flex align-items-center mb-2" style={{ fontVariantNumeric: 'tabular-nums' }}>
                <span className="text-start text-muted" style={{ width: '150px', flexShrink: 0 }}>
                  {es.invoices.invoiceNumberLabel}:
                </span>
                <span className="text-start">
                  {sale.invoiceNumber || `#${String(sale.id).padStart(6, '0')}`}
                </span>
              </div>
              <div className="d-flex align-items-center mb-2" style={{ fontVariantNumeric: 'tabular-nums' }}>
                <span className="text-start text-muted" style={{ width: '150px', flexShrink: 0 }}>
                  {es.invoices.issuerLabel}:
                </span>
                <span className="text-start">
                  {es.invoices.issuerValue}
                </span>
              </div>
              <div className="d-flex align-items-center mb-2" style={{ fontVariantNumeric: 'tabular-nums' }}>
                <span className="text-start text-muted" style={{ width: '150px', flexShrink: 0 }}>
                  {es.invoices.orderDateLabel}:
                </span>
                <span className="text-start">
                  {new Date(sale.orderDate || sale.createdAt).toLocaleString('es-EC')}
                </span>
              </div>
              <div className="d-flex align-items-center mb-0" style={{ fontVariantNumeric: 'tabular-nums' }}>
                <span className="text-start text-muted" style={{ width: '150px', flexShrink: 0 }}>
                  {es.invoices.statusLabel}:
                </span>
                <span className="text-start badge bg-success">
                  {es.invoices.statusCompleted}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-light fw-bold">{es.invoices.customerDataHeader || 'Datos del Cliente'}</div>
            <div className="card-body">
              <div className="d-flex align-items-center mb-2" style={{ fontVariantNumeric: 'tabular-nums' }}>
                <span className="text-start text-muted" style={{ width: '130px', flexShrink: 0 }}>
                  {es.invoices.customerLabel}:
                </span>
                <span className="text-start">
                  {sale.customerName || sale.customer?.name}
                </span>
              </div>
              <div className="d-flex align-items-center mb-2" style={{ fontVariantNumeric: 'tabular-nums' }}>
                <span className="text-start text-muted" style={{ width: '130px', flexShrink: 0 }}>
                  {es.invoices.customerCardLabel}:
                </span>
                <span className="text-start">
                  {sale.customerIdentityCard || sale.customer?.document}
                </span>
              </div>
              <div className="d-flex align-items-center mb-2" style={{ fontVariantNumeric: 'tabular-nums' }}>
                <span className="text-start text-muted" style={{ width: '130px', flexShrink: 0 }}>
                  {es.invoices.customerEmailLabel}:
                </span>
                <span className="text-start">
                  {sale.customerEmail || sale.customer?.email || 'N/A'}
                </span>
              </div>
              <div className="d-flex align-items-center mb-0" style={{ fontVariantNumeric: 'tabular-nums' }}>
                <span className="text-start text-muted" style={{ width: '130px', flexShrink: 0 }}>
                  {es.invoices.customerAddressLabel}:
                </span>
                <span className="text-start">
                  {sale.customerAddress || sale.customer?.address || 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-light fw-bold"> {es.invoices.itemsHeader || 'Productos Facturados'}</div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>{es.invoices.productCodeHeader || 'Código'}</th>
                  <th>{es.invoices.productNameHeader || 'Descripción del Producto'}</th>
                  <th className="text-center">{es.invoices.quantityHeader || 'Cantidad'}</th>
                  <th className="text-end">{es.invoices.unitPriceHeader || 'Precio Unitario'}</th>
                  <th className="text-end">{es.invoices.lineSubtotalHeader || 'Subtotal'}</th>
                </tr>
              </thead>
              <tbody>
                {(sale.lines || sale.items || []).map((item, index) => (
                  <tr key={item.productId || item.id || index}>
                    <td>
                      <span className="badge bg-dark">{item.productCode}</span>
                    </td>
                    <td className="fw-semibold">{item.productName}</td>
                    <td className="text-center fw-bold">{item.quantity}</td>
                    <td className="text-end">${Number(item.unitPrice).toFixed(2)}</td>
                    <td className="text-end fw-bold text-success">
                      ${Number(item.lineSubtotal ?? (item.unitPrice * item.quantity)).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Totals Breakdown */}
      <div className="row justify-content-end">
        <div className="col-md-5">
          <div className="card shadow-sm border-primary">
            <div className="card-body">
              <div className="d-flex align-items-center mb-2" style={{ fontVariantNumeric: 'tabular-nums' }}>
                <span className="text-start text-muted" style={{ width: '130px', flexShrink: 0 }}>
                  {es.invoices.subtotalLabel}:
                </span>
                <span className="text-start">
                  ${Number(sale.subtotal).toFixed(2)}
                </span>
              </div>
              {Number(sale.discountAmount) > 0 && (
                <div className="d-flex align-items-center mb-2" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  <span className="text-start text-muted" style={{ width: '130px', flexShrink: 0 }}>
                    {es.invoices.discountLabel}:
                  </span>
                  <span className="text-start">
                    -${Number(sale.discountAmount).toFixed(2)}
                  </span>
                </div>
              )}
              <div className="d-flex align-items-center mb-2" style={{ fontVariantNumeric: 'tabular-nums' }}>
                <span className="text-start text-muted" style={{ width: '130px', flexShrink: 0 }}>
                  {es.invoices.taxLabel}:
                </span>
                <span className="text-start">
                  ${Number(sale.taxAmount ?? sale.tax ?? 0).toFixed(2)}
                </span>
              </div>
              <hr />
              <div className="d-flex align-items-center mb-0" style={{ fontVariantNumeric: 'tabular-nums' }}>
                <span className="text-start" style={{ width: '130px', flexShrink: 0, color: 'var(--nw-blue-700, #1d4ed8)' }}>
                  {es.invoices.totalLabel}:
                </span>
                <span className="text-start" style={{ color: 'var(--nw-blue-700, #1d4ed8)' }}>
                  ${Number(sale.total).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvoiceDetailPage;
