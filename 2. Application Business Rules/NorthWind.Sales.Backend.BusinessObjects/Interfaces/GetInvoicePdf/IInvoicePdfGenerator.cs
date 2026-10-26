namespace NorthWind.Sales.Backend.BusinessObjects.Interfaces.GetInvoicePdf;

public interface IInvoicePdfGenerator
{
    byte[] Generate(InvoiceDto invoice);
}
