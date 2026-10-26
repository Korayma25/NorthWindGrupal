namespace NorthWind.Sales.Backend.DataContexts.EFCore.Services;

internal class NorthWindSalesQueriesDataContext : NorthWindSalesContext, INorthWindSalesQueriesDataContext
{
    public NorthWindSalesQueriesDataContext(IOptions<DBOptions> dbOptions) : base(dbOptions)
    {
        ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
    }
    public new IQueryable<NorthWind.Sales.Backend.Repositories.Entities.Customer> Customers => base.Customers;
    public new IQueryable<NorthWind.Sales.Backend.Repositories.Entities.Product> Products => base.Products;
    public new IQueryable<Order> Orders => base.Orders;
    public new IQueryable<NorthWind.Sales.Backend.Repositories.Entities.OrderDetail> OrderDetails => base.OrderDetails;

    public Task<ReturnType?> FirstOrDefaultAync<ReturnType>(IQueryable<ReturnType> queryable) => queryable.FirstOrDefaultAsync();
    public async Task<IEnumerable<ReturnType>> ToListAsync<ReturnType>(IQueryable<ReturnType> queryable) => await queryable.ToListAsync();
    public Task<int> CountAsync<T>(IQueryable<T> queryable) => queryable.CountAsync();
}
