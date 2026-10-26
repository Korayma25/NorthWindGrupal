namespace NorthWind.Sales.Entities.Dtos.SearchProducts;

public class ProductLookupDto(
    int id,
    string code,
    string name,
    decimal unitPrice,
    short unitsInStock,
    decimal taxRate)
{
    public int Id => id;
    public string Code => code;
    public string Name => name;
    public decimal UnitPrice => unitPrice;
    public short UnitsInStock => unitsInStock;
    public decimal TaxRate => taxRate;
}
