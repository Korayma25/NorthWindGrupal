namespace NorthWind.Sales.Backend.Repositories.Repositories;

internal class CommandsRepository(INorthWindSalesCommandsDataContext context)
    : ICommandsRepository
{
    public async Task CreateOrder(OrderAggregate order)
    {
        await context.AddOrderAsync(order);
        await context.AddOrderDetailsAsync(
            order.OrderDetails
                .Select(detail => new Entities.OrderDetail
                {
                    Order = order,
                    ProductId = detail.ProductId,
                    Quantity = detail.Quantity,
                    UnitPrice = detail.UnitPrice,
                    TaxRate = detail.TaxRate
                })
                .ToArray());
    }

    public async Task<IEnumerable<int>> DecreaseUnitsInStock(IEnumerable<ProductUnitsInStock> items)
    {
        var outOfStock = new List<int>();
        foreach (var item in items)
        {
            var success = await context.DecreaseProductUnitsInStockAsync(item.ProductId, item.UnitsInStock);
            if (!success)
            {
                outOfStock.Add(item.ProductId);
            }
        }
        return outOfStock;
    }

    public async Task SaveChanges() => await context.SaveChangesAsync();
}
