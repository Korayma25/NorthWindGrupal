namespace NorthWind.Sales.Frontend.BusinessObjects.Interfaces;

public interface ISearchProductsGateway
{
    Task<PagedResultDto<ProductLookupDto>> SearchAsync(SearchProductsDto criteria);
}
