namespace NorthWind.Sales.Frontend.BusinessObjects.Interfaces;

public interface IInvoiceGateway
{
    Task<PagedResultDto<InvoiceSummaryDto>> SearchAsync(SearchInvoicesDto criteria);
    Task<InvoiceDto?> GetAsync(int id);
    Task<byte[]> GetPdfAsync(int id);
}
