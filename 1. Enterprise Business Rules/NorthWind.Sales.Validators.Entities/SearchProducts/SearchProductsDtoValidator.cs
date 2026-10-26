namespace NorthWind.Sales.Validators.Entities.SearchProducts;

internal class SearchProductsDtoValidator : AbstractModelValidator<SearchProductsDto>
{
    public SearchProductsDtoValidator(IValidationService<SearchProductsDto> validationService) : base(validationService)
    {
        AddRuleFor(p => p.Page)
            .Must(page => page >= 1, SearchMessages.PageGreaterThanZero);

        AddRuleFor(p => p.PageSize)
            .Must(pageSize => pageSize >= 1 && pageSize <= 50, SearchMessages.PageSizeBetweenOneAndFifty);

        AddRuleFor(p => p.Name)
            .Must(name => string.IsNullOrEmpty(name) || name.Length <= 60, SearchMessages.ProductNameMaximumLength);

        AddRuleFor(p => p.Code)
            .Must(code => string.IsNullOrEmpty(code) || code.Length <= 20, SearchMessages.ProductCodeMaximumLength);
    }
}
