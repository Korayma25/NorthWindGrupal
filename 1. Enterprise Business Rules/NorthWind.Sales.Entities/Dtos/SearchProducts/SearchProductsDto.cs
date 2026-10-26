namespace NorthWind.Sales.Entities.Dtos.SearchProducts;

public class SearchProductsDto(
    string? name,
    string? code,
    int page,
    int pageSize)
{
    public string? Name => name;
    public string? Code => code;
    public int Page => page;
    public int PageSize => pageSize;
}
