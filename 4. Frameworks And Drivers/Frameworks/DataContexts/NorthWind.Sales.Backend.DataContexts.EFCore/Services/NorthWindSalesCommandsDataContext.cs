namespace NorthWind.Sales.Backend.DataContexts.EFCore.Services;

internal class NorthWindSalesCommandsDataContext(IOptions<DBOptions> dbOptions)
    : NorthWindSalesContext(dbOptions), INorthWindSalesCommandsDataContext
{
    public async Task AddOrderAsync(Order order) => await AddAsync(order);

    public async Task AddOrderDetailsAsync(
        IEnumerable<Repositories.Entities.OrderDetail> orderDetails) =>
        await AddRangeAsync(orderDetails);

    public async Task<bool> DecreaseProductUnitsInStockAsync(int productId, short quantity) =>
        await Products.Where(p => p.Id == productId && p.UnitsInStock >= quantity)
            .ExecuteUpdateAsync(s => s.SetProperty(p => p.UnitsInStock, p => (short)(p.UnitsInStock - quantity))) == 1;

    public async Task SaveChangesAsync() => await GuardDBContext.AgainstSaveChangesErrorAsync(this);
}
