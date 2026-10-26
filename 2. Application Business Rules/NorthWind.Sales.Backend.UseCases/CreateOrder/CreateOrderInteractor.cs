namespace NorthWind.Sales.Backend.UseCases.CreateOrder;

internal class CreateOrderInteractor(
    ICreateOrderOutputPort outputPort,
    ICommandsRepository repository,
    IQueriesRepository queriesRepository,
    IModelValidatorHub<CreateOrderDto> modelValidatorHub,
    IDomainEventHub<SpecialOrderCreatedEvent> domainEventHub,
    IDomainLogger domainLogger,
    IDomainTransaction domainTransaction,
    IUserService userService) : ICreateOrderInputPort
{
    public async Task Handle(CreateOrderDto orderDto)
    {
        GuardUser.AgainstUnauthenticated(userService);
        await GuardModel.AgainstNotValid(modelValidatorHub, orderDto);
        await domainLogger.LogInformation(new DomainLog(
            CreateOrderMessages.StartingPurchaseOrderCreation, userService.UserName));
        var order = OrderAggregate.From(orderDto);
        try
        {
            domainTransaction.BeginTransaction();
            order.ApplyPricing(await queriesRepository.GetProductsPricing(order.OrderDetails.Select(d => d.ProductId)));
            order.CalculateTotals();
            var outOfStock = await repository.DecreaseUnitsInStock(
                order.OrderDetails.Select(d => new ProductUnitsInStock(d.ProductId, d.Quantity)));
            if (outOfStock.Any())
            {
                var errors = new List<ValidationError>();
                foreach (var productId in outOfStock)
                {
                    var index = orderDto.OrderDetails.ToList().FindIndex(item => item.ProductId == productId);
                    var detail = orderDto.OrderDetails.ElementAt(index);
                    errors.Add(new ValidationError(
                        $"{nameof(orderDto.OrderDetails)}[{index}].{nameof(CreateOrderDetailDto.Quantity)}",
                        string.Format(CreateOrderMessages.UnitsInStockLessThanQuantityErrorTemplate, detail.Quantity, 0, productId)));
                }
                throw new ValidationException(errors);
            }
            await repository.CreateOrder(order);
            await repository.SaveChanges();
            await domainLogger.LogInformation(new DomainLog(string.Format(
                CreateOrderMessages.PurchaseOrderCreatedTemplate, order.Id), userService.UserName));
            await outputPort.Handle(order);
            if (new SpecialOrderSpecification().IsSatisfiedBy(order))
            {
                await domainEventHub.Raise(new SpecialOrderCreatedEvent(
                    order.Id, order.OrderDetails.Count));
            }

            domainTransaction.CommitTransaction();
        }
        catch
        {
            domainTransaction.RollbackTransaction();
            var information = string.Format(
                CreateOrderMessages.OrderCreationCancelledTemplate,
                order.Id);
            await domainLogger.LogInformation(new DomainLog(information, userService.UserName));
            throw;
        }
    }
}
