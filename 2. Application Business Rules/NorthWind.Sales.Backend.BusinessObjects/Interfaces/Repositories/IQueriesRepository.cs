namespace NorthWind.Sales.Backend.BusinessObjects.Interfaces.Repositories;

public interface IQueriesRepository
{
    Task<decimal?> GetCustomerCurrentBalance(string customerId);
    Task<IEnumerable<ProductUnitsInStock>> GetProductsUnitsInStock(IEnumerable<int> productIds);
    Task<PagedResultDto<CustomerLookupDto>> SearchCustomers(SearchCustomersDto searchDto);
    Task<PagedResultDto<ProductLookupDto>> SearchProductsInStock(SearchProductsDto searchDto);
    Task<PagedResultDto<InvoiceSummaryDto>> SearchInvoices(SearchInvoicesDto searchDto);
    Task<InvoiceDto?> GetInvoice(int id);
    Task<IEnumerable<ProductPricing>> GetProductsPricing(IEnumerable<int> productIds);
}
