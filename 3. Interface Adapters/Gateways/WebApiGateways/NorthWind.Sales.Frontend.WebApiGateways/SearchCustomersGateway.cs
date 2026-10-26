namespace NorthWind.Sales.Frontend.WebApiGateways;

internal class SearchCustomersGateway(HttpClient client) : ISearchCustomersGateway
{
    public async Task<PagedResultDto<CustomerLookupDto>> SearchAsync(SearchCustomersDto criteria)
    {
        var Url = $"{Endpoints.SearchCustomers}?name={Uri.EscapeDataString(criteria.Name ?? string.Empty)}&identityCard={Uri.EscapeDataString(criteria.IdentityCard ?? string.Empty)}&page={criteria.Page}&pageSize={criteria.PageSize}";
        return (await client.GetFromJsonAsync<PagedResultDto<CustomerLookupDto>>(Url))!;
    }
}
