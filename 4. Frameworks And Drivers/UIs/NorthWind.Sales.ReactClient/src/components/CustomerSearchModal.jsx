import { useState, useEffect, useRef, useCallback } from 'react';
import customerService from '../services/customerService';
import SearchModal from './SearchModal';
import { keepLetters } from '../domain/validators/textRules';
import useFilteredInput from '../domain/validators/useFilteredInput';
import es from '../i18n/es';

function CustomerSearchModal({ isOpen, onClose, onSelectCustomer }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState([]);
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

  const fetchCustomers = useCallback(async (query, page) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const response = await customerService.searchCustomers({
        name: query,
        identityCard: '',
        page,
        pageSize: 5,
      });

      if (controller.signal.aborted) {
        return;
      }

      const items = response.items || response.data || [];
      setCustomers(items);
      setPagination({
        page: response.page || 1,
        totalPages: response.totalPages || 1,
        total: response.totalCount ?? response.total ?? items.length,
      });
    } catch (err) {
      if (!controller.signal.aborted) {
        setError(err.response?.data?.message || err.message || 'Error al buscar clientes.');
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
        fetchCustomers(searchTerm, pagination.page);
      }, 400);

      return () => {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
      };
    } else {
      cancelPending();
    }
  }, [searchTerm, pagination.page, isOpen, fetchCustomers, cancelPending]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  const { inputRef, handleChange } = useFilteredInput({
    value: searchTerm,
    setValue: setSearchTerm,
    filterFn: keepLetters,
    maxLength: 40,
    onValidChange: () => {
      setPagination((prev) => ({ ...prev, page: 1 }));
    },
  });

  const columns = [
    { label: es.search.customerIdentityCardHeader },
    { label: es.search.customerNameHeader },
    { label: es.search.customerEmailHeader },
    { label: es.search.customerAddressHeader },
  ];

  const renderRowCells = (c) => (
    <>
      <td className="fw-semibold">{c.identityCard}</td>
      <td className="fw-semibold">{c.name}</td>
      <td>{c.email || '-'}</td>
      <td>{c.address || '-'}</td>
    </>
  );

  const filters = (
    <div className="mb-3">
      <label htmlFor="customerSearchInput" className="form-label font-weight-bold">
        {es.search.filterCustomerNameLabel}:
      </label>
      <input
        id="customerSearchInput"
        ref={inputRef}
        type="text"
        className="form-control"
        placeholder={es.search.customerSearchPlaceholder}
        value={searchTerm}
        onChange={handleChange}
        maxLength="40"
        autoFocus
      />
    </div>
  );

  return (
    <SearchModal
      isOpen={isOpen}
      onClose={onClose}
      title={es.search.searchCustomersTitle}
      headerBg="bg-primary"
      filters={filters}
      error={error}
      loading={loading}
      columns={columns}
      items={customers}
      keyExtractor={(c) => c.id}
      renderRowCells={renderRowCells}
      onSelectItem={onSelectCustomer}
      cancelPending={cancelPending}
      pagination={pagination}
      onPageChange={handlePageChange}
      emptyMessage={es.search.noCustomersFound}
    />
  );
}

export default CustomerSearchModal;
