namespace NorthWind.Sales.Backend.BusinessObjects.Interfaces.SearchCustomers;

public interface ISearchCustomersOutputPort
{
    PagedResultDto<CustomerLookupDto> Result { get; }
    Task Handle(PagedResultDto<CustomerLookupDto> result);
}
