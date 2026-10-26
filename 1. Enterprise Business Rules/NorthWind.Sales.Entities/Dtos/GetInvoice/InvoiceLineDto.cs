namespace NorthWind.Sales.Entities.Dtos.GetInvoice;

public class InvoiceLineDto(
    int productId,
    string productCode,
    string productName,
    decimal unitPrice,
    short quantity,
    decimal taxRate,
    decimal lineSubtotal)
{
    public int ProductId => productId;
    public string ProductCode => productCode;
    public string ProductName => productName;
    public decimal UnitPrice => unitPrice;
    public short Quantity => quantity;
    public decimal TaxRate => taxRate;
    public decimal LineSubtotal => lineSubtotal;
}
