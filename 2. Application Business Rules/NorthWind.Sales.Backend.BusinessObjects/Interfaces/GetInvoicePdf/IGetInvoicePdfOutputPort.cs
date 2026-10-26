namespace NorthWind.Sales.Backend.BusinessObjects.Interfaces.GetInvoicePdf;

public interface IGetInvoicePdfOutputPort
{
    byte[] Pdf { get; }
    Task Handle(byte[] pdf);
}
