namespace NorthWind.Sales.Validators.Entities.SearchCustomers;

internal class SearchCustomersDtoValidator : AbstractModelValidator<SearchCustomersDto>
{
    public SearchCustomersDtoValidator(IValidationService<SearchCustomersDto> validationService) : base(validationService)
    {
        AddRuleFor(c => c.Page)
            .Must(page => page >= 1, SearchMessages.PageGreaterThanZero);

        AddRuleFor(c => c.PageSize)
            .Must(pageSize => pageSize >= 1 && pageSize <= 50, SearchMessages.PageSizeBetweenOneAndFifty);

        AddRuleFor(c => c.Name)
            .Must(name => string.IsNullOrEmpty(name) || name.Length <= 40, SearchMessages.CustomerNameMaximumLength)
            .Must(name => string.IsNullOrEmpty(name) || TextRules.OnlyLetters(name), SearchMessages.CustomerNameOnlyLetters);

        AddRuleFor(c => c.IdentityCard)
            .Must(id => string.IsNullOrEmpty(id) || TextRules.OnlyDigits(id), SearchMessages.IdentityCardOnlyDigits)
            .Must(id => string.IsNullOrEmpty(id) || id.Length <= 10, SearchMessages.IdentityCardMaximumLength)
            .Must(id => string.IsNullOrEmpty(id) || id.Length != 10 || EcuadorianIdentityCard.IsValid(id), SearchMessages.IdentityCardInvalid);
    }
}
