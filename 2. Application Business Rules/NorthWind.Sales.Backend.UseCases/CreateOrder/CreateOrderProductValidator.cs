namespace NorthWind.Sales.Backend.UseCases.CreateOrder;

internal class CreateOrderProductValidator(IQueriesRepository repository) : IModelValidator<CreateOrderDto>
{
    private readonly List<ValidationError> errors = [];
    public IEnumerable<ValidationError> Errors => errors;
    public ValidationConstraint Constraint => ValidationConstraint.ValidateIfThereAreNoPreviousErrors;
    public async Task<bool> Validate(CreateOrderDto model)
    {
        errors.Clear();
        var requiredQuantities = model.OrderDetails.GroupBy(d => d.ProductId)
            .Select(group => new ProductUnitsInStock(group.Key, (short)group.Sum(d => d.Quantity))).ToList();
        var productIds = requiredQuantities.Select(item => item.ProductId);
        var inStockQuantities = await repository.GetProductsUnitsInStock(productIds);
        var requiredVsInStock = requiredQuantities
            .GroupJoin(inStockQuantities, required => required.ProductId, inStock => inStock.ProductId,
                (required, manyInStock) => new { required, manyInStock })
            .SelectMany(group => group.manyInStock.DefaultIfEmpty(),
                (group, single) => new { group.required.ProductId, Required = group.required.UnitsInStock, InStock = (short?)single?.UnitsInStock });
        foreach (var item in requiredVsInStock)
        {
            if (!item.InStock.HasValue)
                errors.Add(new ValidationError(GetPropertyNameWithIndex(model, item.ProductId, nameof(CreateOrderDetailDto.ProductId)), string.Format(CreateOrderMessages.ProductIdNotFoundErrorTemplate, item.ProductId)));
            else if (item.InStock < item.Required)
                errors.Add(new ValidationError(GetPropertyNameWithIndex(model, item.ProductId, nameof(CreateOrderDetailDto.Quantity)), string.Format(CreateOrderMessages.UnitsInStockLessThanQuantityErrorTemplate, item.Required, item.InStock, item.ProductId)));
        }
        return !errors.Any();
    }
    private static string GetPropertyNameWithIndex(CreateOrderDto model, int productId, string propertyName)
    {
        var index = model.OrderDetails.ToList().FindIndex(item => item.ProductId == productId);
        return $"{nameof(model.OrderDetails)}[{index}].{propertyName}";
    }
}
