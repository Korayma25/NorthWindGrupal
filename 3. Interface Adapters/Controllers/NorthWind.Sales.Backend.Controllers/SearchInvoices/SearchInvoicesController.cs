namespace Microsoft.AspNetCore.Builder;

public static class SearchInvoicesController
{
    public static WebApplication UseSearchInvoicesController(this WebApplication app)
    {
        app.MapGet(Endpoints.SearchInvoices, SearchInvoices).RequireAuthorization();
        return app;
    }

    public static async Task<PagedResultDto<InvoiceSummaryDto>> SearchInvoices(
        string? invoiceNumber,
        string? customerName,
        ISearchInvoicesInputPort inputPort,
        ISearchInvoicesOutputPort presenter,
        int page = 1,
        int pageSize = 10)
    {
        var request = new SearchInvoicesDto(invoiceNumber, customerName, page, pageSize);
        await inputPort.Handle(request);
        return presenter.Result;
    }
}
