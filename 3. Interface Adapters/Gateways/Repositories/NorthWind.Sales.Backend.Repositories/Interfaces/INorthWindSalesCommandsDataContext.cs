namespace NorthWind.Sales.Backend.Repositories.Interfaces;

public interface INorthWindSalesCommandsDataContext
{
    Task AddOrderAsync(Order order);
    Task AddOrderDetailsAsync(IEnumerable<Entities.OrderDetail> orderDetails);
    Task<bool> DecreaseProductUnitsInStockAsync(int productId, short quantity);
    Task SaveChangesAsync();
}
