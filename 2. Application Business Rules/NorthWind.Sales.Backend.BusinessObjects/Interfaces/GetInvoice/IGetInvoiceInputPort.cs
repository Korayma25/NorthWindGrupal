namespace NorthWind.Sales.Backend.BusinessObjects.Interfaces.GetInvoice;

public interface IGetInvoiceInputPort
{
    Task Handle(int id);
}
