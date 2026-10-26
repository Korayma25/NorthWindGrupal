namespace NorthWind.Sales.Backend.BusinessObjects.Interfaces.Repositories;

public interface ICommandsRepository : IUnitOfWork
{
    Task CreateOrder(OrderAggregate order);
    Task<IEnumerable<int>> DecreaseUnitsInStock(IEnumerable<ProductUnitsInStock> items);
}
