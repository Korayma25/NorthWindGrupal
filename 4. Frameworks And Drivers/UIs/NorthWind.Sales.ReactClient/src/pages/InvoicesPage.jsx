import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import saleService from '../services/saleService';

function InvoicesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sales, setSales] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const fetchSales = useCallback(async (query, page) => {
    setLoading(true);
    setError(null);
    try {
      const trimmed = (query || '').trim();
      const isDigitsOrHyphens = /^[\d-]+$/.test(trimmed);
      const invoiceNumber = isDigitsOrHyphens ? trimmed : '';
      const customerName = !isDigitsOrHyphens ? trimmed : '';

      const response = await saleService.searchSales({
        invoiceNumber,
        customerName,
        page,
        pageSize: 10,
      });
      const items = response.items || response.data || [];
      setSales(items);
      setPagination({
        page: response.page || 1,
        totalPages: response.totalPages || 1,
        total: response.totalCount ?? response.total ?? items.length,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Error al obtener la lista de facturas.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchSales(searchTerm, pagination.page);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, pagination.page, fetchSales]);

  const handleSearchChange = (e) => {
    const sanitizedSearch = e.target.value
      .replace(/[^\p{L}\p{N}\s-]/gu, '')
      .slice(0, 40);
    setSearchTerm(sanitizedSearch);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  return (
    <div className="container pb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Facturas Emitidas</h2>
        <button className="btn btn-primary" onClick={() => navigate('/pos')}>
         Nueva Venta
        </button>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-8">
              <label htmlFor="invoiceSearchInput" className="form-label fw-semibold">
                Buscar por N° Factura o Nombre de Cliente:
              </label>
              <input
                id="invoiceSearchInput"
                type="text"
                className="form-control"
                placeholder="Ej. 001-001, Juan Pérez..."
                value={searchTerm}
                onChange={handleSearchChange}
                maxLength="40"
              />
            </div>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger mb-4">{error}</div>}

      <div className="card shadow-sm">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando facturas...</span>
              </div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>N° Factura</th>
                    <th>Fecha</th>
                    <th>Cliente</th>
                    <th>Cédula</th>
                    <th className="text-end">Total</th>
             
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-4 text-muted">
                        No se encontraron facturas registradas.
                      </td>
                    </tr>
                  ) : (
                    sales.map((sale) => (
                      <tr key={sale.id}>
                        <td>
                          <span className="text-end fw-bold">
                            {sale.invoiceNumber || `#${String(sale.id).padStart(6, '0')}`}
                          </span>
                        </td>
                        <td>{new Date(sale.orderDate || sale.createdAt).toLocaleString('es-EC')}</td>
                        <td className="fw-semibold">{sale.customerName}</td>
                        <td>
                          <span className="fw-semibold">{sale.customerIdentityCard || sale.customerDocument}</span>
                        </td>
                        <td className="fw-semibold text-end">
                          ${Number(sale.total).toFixed(2)}
                        </td>
                 
                        <td className="text-center">
                          <div className="btn-group btn-group-sm">
                            <button
                              className="btn btn-outline-primary"
                              onClick={() => navigate(`/invoices/${sale.id}`)}
                            >
                              Ver Detalle
                            </button>
                            <button
                              className="btn btn-outline-secondary"
                              onClick={() => saleService.downloadPdf(sale.id)}
                            >
                              Guardar PDF
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {pagination.totalPages > 1 && (
          <div className="card-footer d-flex justify-content-between align-items-center">
            <span className="small text-muted">
              Página {pagination.page} de {pagination.totalPages} ({pagination.total} facturas)
            </span>
            <div className="btn-group">
              <button
                className="btn btn-outline-secondary btn-sm"
                disabled={pagination.page <= 1}
                onClick={() => handlePageChange(pagination.page - 1)}
              >
                &laquo; Anterior
              </button>
              <button
                className="btn btn-outline-secondary btn-sm"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => handlePageChange(pagination.page + 1)}
              >
                Siguiente &raquo;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default InvoicesPage;
