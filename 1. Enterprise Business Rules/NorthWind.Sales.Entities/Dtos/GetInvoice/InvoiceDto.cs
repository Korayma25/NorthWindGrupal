namespace NorthWind.Sales.Entities.Dtos.GetInvoice;

public class InvoiceDto(
    int id,
    string invoiceNumber,
    DateTime orderDate,
    string customerId,
    string customerName,
    string customerIdentityCard,
    string customerEmail,
    string customerAddress,
    string customerCity,
    string customerCountry,
    string customerPostalCode,
    decimal subtotal,
    decimal discountAmount,
    decimal taxAmount,
    decimal total,
    IEnumerable<InvoiceLineDto> lines)
{
    public int Id => id;
    public string InvoiceNumber => invoiceNumber;
    public DateTime OrderDate => orderDate;
    public string CustomerId => customerId;
    public string CustomerName => customerName;
    public string CustomerIdentityCard => customerIdentityCard;
    public string CustomerEmail => customerEmail;
    public string CustomerAddress => customerAddress;
    public string CustomerCity => customerCity;
    public string CustomerCountry => customerCountry;
    public string CustomerPostalCode => customerPostalCode;
    public decimal Subtotal => subtotal;
    public decimal DiscountAmount => discountAmount;
    public decimal TaxAmount => taxAmount;
    public decimal Total => total;
    public IEnumerable<InvoiceLineDto> Lines => lines;
}
