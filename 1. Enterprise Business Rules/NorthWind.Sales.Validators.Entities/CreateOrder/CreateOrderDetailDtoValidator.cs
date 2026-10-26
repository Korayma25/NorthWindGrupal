namespace NorthWind.Sales.Validators.Entities.CreateOrder;

internal class CreateOrderDetailDtoValidator : AbstractModelValidator<CreateOrderDetailDto>
{
    public CreateOrderDetailDtoValidator(IValidationService<CreateOrderDetailDto> validator) : base(validator)
    {
        AddRuleFor(d => d.ProductId).GreaterThan(0, Resources.CreateOrderMessages.ProductIdGreaterThanZero);
        AddRuleFor(d => d.Quantity).GreaterThan((short)0, Resources.CreateOrderMessages.QuantityGreaterThanZero);
        AddRuleFor(d => d.UnitPrice).GreaterThan<decimal>(0, Resources.CreateOrderMessages.UnitPriceGreaterThanZero);
    }
}
