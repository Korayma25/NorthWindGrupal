namespace NorthWind.Sales.Entities.Dtos.SearchInvoices;

public class InvoiceSummaryDto(
    int id,
    string invoiceNumber,
    DateTime orderDate,
    string customerName,
    string customerIdentityCard,
    decimal total)
{
    public int Id => id;
    public string InvoiceNumber => invoiceNumber;
    public DateTime OrderDate => orderDate;
    public string CustomerName => customerName;
    public string CustomerIdentityCard => customerIdentityCard;
    public decimal Total => total;
}
