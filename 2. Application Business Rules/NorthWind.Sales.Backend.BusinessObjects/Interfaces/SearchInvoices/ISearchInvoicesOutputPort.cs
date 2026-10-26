namespace NorthWind.Sales.Backend.BusinessObjects.Interfaces.SearchInvoices;

public interface ISearchInvoicesOutputPort
{
    PagedResultDto<InvoiceSummaryDto> Result { get; }
    Task Handle(PagedResultDto<InvoiceSummaryDto> result);
}
