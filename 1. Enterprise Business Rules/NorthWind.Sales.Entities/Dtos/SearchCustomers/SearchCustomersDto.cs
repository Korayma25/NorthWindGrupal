namespace NorthWind.Sales.Entities.Dtos.SearchCustomers;

public class SearchCustomersDto(
    string? name,
    string? identityCard,
    int page,
    int pageSize)
{
    public string? Name => name;
    public string? IdentityCard => identityCard;
    public int Page => page;
    public int PageSize => pageSize;
}
