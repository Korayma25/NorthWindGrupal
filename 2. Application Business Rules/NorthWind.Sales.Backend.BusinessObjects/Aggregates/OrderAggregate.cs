namespace NorthWind.Sales.Backend.BusinessObjects.Aggregates;

public class OrderAggregate : Order
{
    private readonly List<OrderDetail> OrderDetailsField = [];

    public IReadOnlyCollection<OrderDetail> OrderDetails => OrderDetailsField;

    public void AddDetail(int productId, decimal unitPrice, short quantity, decimal taxRate = 0m)
    {
        var existingOrderDetail = OrderDetailsField
            .FirstOrDefault(orderDetail => orderDetail.ProductId == productId);

        if (existingOrderDetail is not null)
        {
            quantity += existingOrderDetail.Quantity;
            OrderDetailsField.Remove(existingOrderDetail);
        }

        OrderDetailsField.Add(new OrderDetail(productId, unitPrice, quantity, taxRate));
    }

    public void ApplyPricing(IEnumerable<ProductPricing> pricing)
    {
        var pricingDict = pricing.ToDictionary(p => p.ProductId);
        var updatedDetails = new List<OrderDetail>();
        foreach (var detail in OrderDetailsField)
        {
            if (pricingDict.TryGetValue(detail.ProductId, out var priceInfo))
            {
                updatedDetails.Add(new OrderDetail(detail.ProductId, priceInfo.UnitPrice, detail.Quantity, priceInfo.TaxRate));
            }
            else
            {
                updatedDetails.Add(detail);
            }
        }
        OrderDetailsField.Clear();
        OrderDetailsField.AddRange(updatedDetails);
    }

    public void CalculateTotals()
    {
        Subtotal = Math.Round(OrderDetailsField.Sum(d => d.UnitPrice * d.Quantity), 2, MidpointRounding.AwayFromZero);

        if (DiscountType == DiscountType.Percentage)
        {
            DiscountAmount = Math.Round(Subtotal * (decimal)Discount / 100m, 2, MidpointRounding.AwayFromZero);
        }
        else
        {
            DiscountAmount = Math.Round((decimal)Discount, 2, MidpointRounding.AwayFromZero);
        }

        if (Subtotal == 0m)
        {
            TaxAmount = 0m;
        }
        else
        {
            var calculatedTax = OrderDetailsField.Sum(d =>
            {
                var lineSubtotal = d.UnitPrice * d.Quantity;
                var discountFactor = 1m - (DiscountAmount / Subtotal);
                return lineSubtotal * discountFactor * d.TaxRate;
            });
            TaxAmount = Math.Round(calculatedTax, 2, MidpointRounding.AwayFromZero);
        }

        Total = Math.Round(Subtotal - DiscountAmount + TaxAmount, 2, MidpointRounding.AwayFromZero);
    }

    public static OrderAggregate From(CreateOrderDto orderDto)
    {
        var order = new OrderAggregate
        {
            CustomerId = orderDto.CustomerId,
            ShipAddress = orderDto.ShipAddress,
            ShipCity = orderDto.ShipCity,
            ShipCountry = orderDto.ShipCountry,
            ShipPostalCode = orderDto.ShipPostalCode
        };

        foreach (var item in orderDto.OrderDetails)
        {
            order.AddDetail(item.ProductId, item.UnitPrice, item.Quantity, 0m);
        }

        return order;
    }
}
