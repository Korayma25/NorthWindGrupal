namespace Microsoft.AspNetCore.Builder;

public static class SearchCustomersController
{
    public static WebApplication UseSearchCustomersController(this WebApplication app)
    {
        app.MapGet(Endpoints.SearchCustomers, SearchCustomers).RequireAuthorization();
        return app;
    }

    public static async Task<PagedResultDto<CustomerLookupDto>> SearchCustomers(
        string? name,
        string? identityCard,
        ISearchCustomersInputPort inputPort,
        ISearchCustomersOutputPort presenter,
        int page = 1,
        int pageSize = 10)
    {
        var request = new SearchCustomersDto(name, identityCard, page, pageSize);
        await inputPort.Handle(request);
        return presenter.Result;
    }
}
