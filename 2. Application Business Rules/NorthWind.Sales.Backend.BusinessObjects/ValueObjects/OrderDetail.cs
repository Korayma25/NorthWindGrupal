namespace NorthWind.Sales.Backend.BusinessObjects.ValueObjects;

public class OrderDetail(int productId, decimal unitPrice, short quantity, decimal taxRate)
{
    public int ProductId => productId;
    public decimal UnitPrice => unitPrice;
    public short Quantity => quantity;
    public decimal TaxRate => taxRate;
}
