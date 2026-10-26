import React from 'react';
import es from '../i18n/es';

function SearchModal({
  isOpen,
  onClose,
  title,
  headerBg = 'bg-primary',
  filters,
  error,
  loading,
  columns = [],
  items = [],
  keyExtractor,
  renderRowCells,
  onSelectItem,
  cancelPending,
  pagination = { page: 1, totalPages: 1, total: 0 },
  onPageChange,
  emptyMessage = es.search.noResultsMessage,
}) {
  if (!isOpen) return null;

  const handleSelectRow = (item) => {
    if (cancelPending) {
      cancelPending();
    }
    onSelectItem(item);
    onClose();
  };

  const handleKeyDown = (e, item) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelectRow(item);
    }
  };

  const handleClose = () => {
    if (cancelPending) {
      cancelPending();
    }
    onClose();
  };

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      role="dialog"
      aria-modal="true"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content shadow">
          <div className={`modal-header ${headerBg} text-white`}>
            <h5 className="modal-title">{title}</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              aria-label="Cerrar"
              onClick={handleClose}
            ></button>
          </div>
          <div className="modal-body">
            {filters}

            {error && <div className="alert alert-danger p-2 small mt-2">{error}</div>}

            {loading ? (
              <div className="text-center my-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">{es.common.loading}</span>
                </div>
              </div>
            ) : (
              <>
                <div className="table-responsive mt-3">
                  <table className="table table-hover align-middle border">
                    <thead className="table-light">
                      <tr>
                        {columns.map((col, idx) => (
                          <th
                            key={idx}
                            className={col.className || ''}
                            style={col.style}
                          >
                            {col.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {items.length === 0 ? (
                        <tr>
                          <td colSpan={columns.length} className="text-center text-muted py-3">
                            {emptyMessage}
                          </td>
                        </tr>
                      ) : (
                        items.map((item, index) => (
                          <tr
                            key={keyExtractor ? keyExtractor(item, index) : item.id ?? index}
                            className="nw-selectable-row"
                            tabIndex={0}
                            role="button"
                            onClick={() => handleSelectRow(item)}
                            onKeyDown={(e) => handleKeyDown(e, item)}
                          >
                            {renderRowCells(item, index)}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {pagination && pagination.totalPages > 1 && (
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <span className="small text-muted">
                      {es.common.page} {pagination.page} {es.common.of} {pagination.totalPages} ({pagination.total})
                    </span>
                    <div className="btn-group">
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        disabled={pagination.page <= 1}
                        onClick={() => onPageChange(pagination.page - 1)}
                      >
                        {es.search.previousPage}
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        disabled={pagination.page >= pagination.totalPages}
                        onClick={() => onPageChange(pagination.page + 1)}
                      >
                        {es.search.nextPage}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>
              {es.search.closeButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchModal;
