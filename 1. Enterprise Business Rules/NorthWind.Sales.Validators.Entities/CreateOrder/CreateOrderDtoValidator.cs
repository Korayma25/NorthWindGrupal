namespace NorthWind.Sales.Validators.Entities.CreateOrder;

internal class CreateOrderDtoValidator : AbstractModelValidator<CreateOrderDto>
{
    public CreateOrderDtoValidator(IValidationService<CreateOrderDto> validationService, IModelValidator<CreateOrderDetailDto> detailValidator) : base(validationService)
    {
        AddRuleFor(c => c.CustomerId).NotEmpty(Resources.CreateOrderMessages.CustomerIdRequired).Length(5, Resources.CreateOrderMessages.CustomerIdRequiredLength);
        AddRuleFor(c => c.ShipAddress).NotEmpty(Resources.CreateOrderMessages.ShipAddressRequired).MaximumLength(60, Resources.CreateOrderMessages.ShipAddressMaximumLength);
        AddRuleFor(c => c.ShipCity).NotEmpty(Resources.CreateOrderMessages.ShipCityRequired).MinimumLength(3, Resources.CreateOrderMessages.ShipCityMinimumLength).MaximumLength(15, Resources.CreateOrderMessages.ShipCityMaximumLength);
        AddRuleFor(c => c.ShipCountry).NotEmpty(Resources.CreateOrderMessages.ShipCountryRequired).MinimumLength(3, Resources.CreateOrderMessages.ShipCountryMinimumLength).MaximumLength(15, Resources.CreateOrderMessages.ShipCountryMaximumLength);
        AddRuleFor(c => c.ShipPostalCode).MaximumLength(10, Resources.CreateOrderMessages.ShipPostalCodeMaximumLength);
        AddRuleFor(c => c.OrderDetails)
            .NotNull(Resources.CreateOrderMessages.OrderDetailsRequired)
            .NotEmpty(Resources.CreateOrderMessages.OrderDetailsNotEmpty)
            .Must(details => details == null || details.Select(d => d.ProductId).Distinct().Count() == details.Count(), Resources.CreateOrderMessages.DuplicateProductsNotAllowed);
        AddRuleForEach(c => c.OrderDetails).SetValidator(detailValidator);
    }
}
