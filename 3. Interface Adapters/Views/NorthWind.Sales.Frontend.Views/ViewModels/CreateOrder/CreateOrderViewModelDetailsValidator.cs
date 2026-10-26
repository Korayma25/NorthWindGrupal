namespace NorthWind.Sales.Frontend.Views.ViewModels.CreateOrder;

internal class CreateOrderViewModelDetailsValidator : IModelValidator<CreateOrderViewModel>
{
    private readonly List<ValidationError> ErrorsField = [];

    public ValidationConstraint Constraint => ValidationConstraint.AlwaysValidate;
    public IEnumerable<ValidationError> Errors => ErrorsField;

    public Task<bool> Validate(CreateOrderViewModel model)
    {
        ErrorsField.Clear();

        if (string.IsNullOrWhiteSpace(model.CustomerId))
        {
            ErrorsField.Add(new ValidationError(nameof(model.CustomerId), CreateOrderMessages.CustomerRequiredError));
        }

        if (model.OrderDetails == null || model.OrderDetails.Count == 0)
        {
            ErrorsField.Add(new ValidationError(nameof(model.OrderDetails), CreateOrderMessages.OrderDetailsRequiredError));
        }
        else
        {
            var SeenProductIds = new HashSet<int>();

            for (var I = 0; I < model.OrderDetails.Count; I++)
            {
                var Item = model.OrderDetails[I];

                if (!SeenProductIds.Add(Item.ProductId))
                {
                    ErrorsField.Add(new ValidationError($"OrderDetails[{I}].ProductId", CreateOrderMessages.DuplicateProductError));
                }

                if (Item.Quantity < 1)
                {
                    ErrorsField.Add(new ValidationError($"OrderDetails[{I}].Quantity", "La cantidad debe ser al menos 1."));
                }
                else if (Item.Quantity > Item.UnitsInStock)
                {
                    ErrorsField.Add(new ValidationError($"OrderDetails[{I}].Quantity", CreateOrderMessages.QuantityExceedsStockError));
                }
            }
        }

        return Task.FromResult(ErrorsField.Count == 0);
    }
}
