namespace NorthWind.Sales.Frontend.WebApiGateways;

internal class SearchProductsGateway(HttpClient client) : ISearchProductsGateway
{
    public async Task<PagedResultDto<ProductLookupDto>> SearchAsync(SearchProductsDto criteria)
    {
        var Url = $"{Endpoints.SearchProducts}?name={Uri.EscapeDataString(criteria.Name ?? string.Empty)}&code={Uri.EscapeDataString(criteria.Code ?? string.Empty)}&page={criteria.Page}&pageSize={criteria.PageSize}";
        return (await client.GetFromJsonAsync<PagedResultDto<ProductLookupDto>>(Url))!;
    }
}
