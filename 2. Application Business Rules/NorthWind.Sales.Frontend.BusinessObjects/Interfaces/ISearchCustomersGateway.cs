namespace NorthWind.Sales.Frontend.BusinessObjects.Interfaces;

public interface ISearchCustomersGateway
{
    Task<PagedResultDto<CustomerLookupDto>> SearchAsync(SearchCustomersDto criteria);
}
