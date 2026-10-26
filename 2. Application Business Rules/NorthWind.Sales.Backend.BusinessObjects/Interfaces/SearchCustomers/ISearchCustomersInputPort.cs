namespace NorthWind.Sales.Backend.BusinessObjects.Interfaces.SearchCustomers;

public interface ISearchCustomersInputPort
{
    Task Handle(SearchCustomersDto searchDto);
}
