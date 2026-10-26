namespace NorthWind.Sales.Backend.BusinessObjects.ValueObjects;

public class ProductPricing(int productId, decimal unitPrice, decimal taxRate)
{
    public int ProductId => productId;
    public decimal UnitPrice => unitPrice;
    public decimal TaxRate => taxRate;
}
