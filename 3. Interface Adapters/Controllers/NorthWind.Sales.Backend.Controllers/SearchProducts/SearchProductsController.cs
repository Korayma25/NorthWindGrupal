namespace Microsoft.AspNetCore.Builder;

public static class SearchProductsController
{
    public static WebApplication UseSearchProductsController(this WebApplication app)
    {
        app.MapGet(Endpoints.SearchProducts, SearchProducts).RequireAuthorization();
        return app;
    }

    public static async Task<PagedResultDto<ProductLookupDto>> SearchProducts(
        string? name,
        string? code,
        ISearchProductsInputPort inputPort,
        ISearchProductsOutputPort presenter,
        int page = 1,
        int pageSize = 10)
    {
        var request = new SearchProductsDto(name, code, page, pageSize);
        await inputPort.Handle(request);
        return presenter.Result;
    }
}
