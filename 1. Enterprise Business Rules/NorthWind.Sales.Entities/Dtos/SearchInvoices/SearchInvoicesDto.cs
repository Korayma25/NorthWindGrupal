namespace NorthWind.Sales.Entities.Dtos.SearchInvoices;

public class SearchInvoicesDto(
    string? invoiceNumber,
    string? customerName,
    int page,
    int pageSize)
{
    public string? InvoiceNumber => invoiceNumber;
    public string? CustomerName => customerName;
    public int Page => page;
    public int PageSize => pageSize;
}
