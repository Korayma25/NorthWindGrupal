namespace NorthWind.Sales.Backend.BusinessObjects.Interfaces.SearchProducts;

public interface ISearchProductsOutputPort
{
    PagedResultDto<ProductLookupDto> Result { get; }
    Task Handle(PagedResultDto<ProductLookupDto> result);
}
