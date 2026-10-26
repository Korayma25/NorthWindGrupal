namespace NorthWind.Sales.Backend.BusinessObjects.Interfaces.GetInvoice;

public interface IGetInvoiceOutputPort
{
    InvoiceDto Result { get; }
    Task Handle(InvoiceDto result);
}
