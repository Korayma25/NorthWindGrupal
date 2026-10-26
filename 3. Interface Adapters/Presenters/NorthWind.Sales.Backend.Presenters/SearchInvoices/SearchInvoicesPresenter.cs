namespace NorthWind.Sales.Backend.Presenters.SearchInvoices;

internal class SearchInvoicesPresenter : ISearchInvoicesOutputPort
{
    public PagedResultDto<InvoiceSummaryDto> Result { get; private set; } = null!;

    public Task Handle(PagedResultDto<InvoiceSummaryDto> result)
    {
        Result = result;
        return Task.CompletedTask;
    }
}
