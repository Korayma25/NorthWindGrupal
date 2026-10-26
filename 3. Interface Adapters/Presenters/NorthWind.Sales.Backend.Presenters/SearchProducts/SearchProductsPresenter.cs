namespace NorthWind.Sales.Backend.Presenters.SearchProducts;

internal class SearchProductsPresenter : ISearchProductsOutputPort
{
    public PagedResultDto<ProductLookupDto> Result { get; private set; } = null!;

    public Task Handle(PagedResultDto<ProductLookupDto> result)
    {
        Result = result;
        return Task.CompletedTask;
    }
}
