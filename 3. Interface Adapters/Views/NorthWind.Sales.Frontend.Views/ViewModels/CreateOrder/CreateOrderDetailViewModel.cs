namespace NorthWind.Sales.Frontend.Views.ViewModels.CreateOrder;

public class CreateOrderDetailViewModel
{
    public int ProductId { get; set; }
    public decimal UnitPrice { get; set; }
    public short Quantity { get; set; }
    public string ProductCode { get; set; } = string.Empty;
    public string ProductName { get; set; } = string.Empty;
    public short UnitsInStock { get; set; }
    public decimal TaxRate { get; set; }
    public decimal LineSubtotal => UnitPrice * Quantity;
}
