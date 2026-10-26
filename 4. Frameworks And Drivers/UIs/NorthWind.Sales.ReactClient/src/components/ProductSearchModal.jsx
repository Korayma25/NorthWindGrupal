import { useState, useEffect, useRef, useCallback } from 'react';
import productService from '../services/productService';
import SearchModal from './SearchModal';
import { keepLetters } from '../domain/validators/textRules';
import useFilteredInput from '../domain/validators/useFilteredInput';
import es from '../i18n/es';

function ProductSearchModal({ isOpen, onClose, onSelectProduct, replaceLine = null }) {
  const [filterName, setFilterName] = useState('');
  const [filterCode, setFilterCode] = useState('');
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const debounceTimerRef = useRef(null);
  const abortControllerRef = useRef(null);

  const cancelPending = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const fetchProducts = useCallback(async (name, code, page) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const response = await productService.searchProducts({
        name,
        code,
        page,
        pageSize: 5,
      });

      if (controller.signal.aborted) {
        return;
      }

      const items = response.items || response.data || [];
      setProducts(items);
      setPagination({
        page: response.page || 1,
        totalPages: response.totalPages || 1,
        total: response.totalCount ?? response.total ?? items.length,
      });
    } catch (err) {
      if (!controller.signal.aborted) {
        setError(err.response?.data?.message || err.message || 'Error al buscar productos.');
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        fetchProducts(filterName, filterCode, pagination.page);
      }, 400);

      return () => {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
      };
    } else {
      cancelPending();
    }
  }, [filterName, filterCode, pagination.page, isOpen, fetchProducts, cancelPending]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  // Controlled input for product Name with letters only and cursor preservation
  const { inputRef: nameInputRef, handleChange: handleNameChange } = useFilteredInput({
    value: filterName,
    setValue: setFilterName,
    filterFn: keepLetters,
    maxLength: 60,
    onValidChange: () => {
      setPagination((prev) => ({ ...prev, page: 1 }));
    },
  });

  // Code input left as is (max 20 characters)
  const handleCodeChange = (e) => {
    const val = e.target.value.slice(0, 20);
    setFilterCode(val);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const columns = [
    { label: es.search.productCodeHeader },
    { label: es.search.productNameHeader },
    { label: es.search.productPriceHeader, className: 'text-end' },
    { label: es.search.productStockHeader, className: 'text-end' },
  ];

  const renderRowCells = (p) => (
    <>
      <td className="fw-bold text-dark">{p.code}</td>
      <td>
        <div className="fw-semibold">{p.name}</div>
      </td>
      <td className="fw-bold text-dark text-end">
        ${Number(p.unitPrice ?? p.price ?? 0).toFixed(2)}
      </td>
      <td className="fw-bold text-dark text-end">
        <span className={`badge ${Number(p.unitsInStock ?? p.stock ?? 0) <= 3 ? 'bg-warning text-dark' : 'bg-success'}`}>
          {p.unitsInStock ?? p.stock ?? 0}
        </span>
      </td>
    </>
  );

  const filters = (
    <div className="row g-2 mb-3">
      <div className="col-md-7">
        <label htmlFor="productNameInput" className="form-label font-weight-bold">
          {es.search.filterNameLabel}:
        </label>
        <input
          id="productNameInput"
          ref={nameInputRef}
          type="text"
          className="form-control"
          placeholder={es.search.nameOnlyLettersPlaceholder}
          value={filterName}
          onChange={handleNameChange}
          maxLength={60}
          autoFocus
        />
      </div>
      <div className="col-md-5">
        <label htmlFor="productCodeInput" className="form-label font-weight-bold">
          {es.search.filterCodeLabel}:
        </label>
        <input
          id="productCodeInput"
          type="text"
          className="form-control"
          placeholder={es.search.codePlaceholder}
          value={filterCode}
          onChange={handleCodeChange}
          maxLength={20}
        />
      </div>
    </div>
  );

  return (
    <SearchModal
      isOpen={isOpen}
      onClose={onClose}
      title={replaceLine !== null ? es.search.replaceProductTitle : es.search.searchProductsTitle}
      headerBg="bg-dark"
      filters={filters}
      error={error}
      loading={loading}
      columns={columns}
      items={products}
      keyExtractor={(p) => p.id}
      renderRowCells={renderRowCells}
      onSelectItem={(item) => onSelectProduct(item, replaceLine)}
      cancelPending={cancelPending}
      pagination={pagination}
      onPageChange={handlePageChange}
      emptyMessage={es.search.noProductsFound}
    />
  );
}

export default ProductSearchModal;
