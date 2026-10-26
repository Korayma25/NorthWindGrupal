namespace NorthWind.Sales.Backend.BusinessObjects.Interfaces.GetInvoicePdf;

public interface IGetInvoicePdfInputPort
{
    Task Handle(int id);
}
