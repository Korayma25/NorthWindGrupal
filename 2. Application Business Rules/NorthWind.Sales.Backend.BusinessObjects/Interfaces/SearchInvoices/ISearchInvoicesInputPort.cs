namespace NorthWind.Sales.Backend.BusinessObjects.Interfaces.SearchInvoices;

public interface ISearchInvoicesInputPort
{
    Task Handle(SearchInvoicesDto searchDto);
}
