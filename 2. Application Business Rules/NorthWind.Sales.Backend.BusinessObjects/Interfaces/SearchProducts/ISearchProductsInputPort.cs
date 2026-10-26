namespace NorthWind.Sales.Backend.BusinessObjects.Interfaces.SearchProducts;

public interface ISearchProductsInputPort
{
    Task Handle(SearchProductsDto searchDto);
}
