namespace NorthWind.Sales.Frontend.WebApiGateways;

internal class InvoiceGateway(HttpClient client) : IInvoiceGateway
{
    public async Task<PagedResultDto<InvoiceSummaryDto>> SearchAsync(SearchInvoicesDto criteria)
    {
        var Url = $"{Endpoints.SearchInvoices}?invoiceNumber={Uri.EscapeDataString(criteria.InvoiceNumber ?? string.Empty)}&customerName={Uri.EscapeDataString(criteria.CustomerName ?? string.Empty)}&page={criteria.Page}&pageSize={criteria.PageSize}";
        return (await client.GetFromJsonAsync<PagedResultDto<InvoiceSummaryDto>>(Url))!;
    }

    public async Task<InvoiceDto?> GetAsync(int id)
    {
        var Url = $"{Endpoints.GetInvoice}?id={id}";
        return await client.GetFromJsonAsync<InvoiceDto>(Url);
    }

    public async Task<byte[]> GetPdfAsync(int id)
    {
        var Url = $"{Endpoints.GetInvoicePdf}?id={id}";
        return await client.GetByteArrayAsync(Url);
    }
}
