namespace NorthWind.Sales.Backend.UseCases.CreateOrder;

internal class CreateOrderCustomerValidator(IQueriesRepository repository) : IModelValidator<CreateOrderDto>
{
    private readonly List<ValidationError> errors = [];
    public IEnumerable<ValidationError> Errors => errors;
    public ValidationConstraint Constraint => ValidationConstraint.ValidateIfThereAreNoPreviousErrors;
    public async Task<bool> Validate(CreateOrderDto model)
    {
        errors.Clear();
        var currentBalance = await repository.GetCustomerCurrentBalance(model.CustomerId);
        if (currentBalance is null)
            errors.Add(new ValidationError(nameof(model.CustomerId), CreateOrderMessages.CustomerIdNotFoundError));
        else if (currentBalance > 0)
            errors.Add(new ValidationError(nameof(model.CustomerId), string.Format(CreateOrderMessages.CustomerWithBalanceErrorTemplate, model.CustomerId, currentBalance)));
        return !errors.Any();
    }
}
