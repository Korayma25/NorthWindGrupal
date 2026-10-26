namespace NorthWind.Sales.Validators.Entities.SearchInvoices;

internal class SearchInvoicesDtoValidator : AbstractModelValidator<SearchInvoicesDto>
{
    public SearchInvoicesDtoValidator(IValidationService<SearchInvoicesDto> validationService) : base(validationService)
    {
        AddRuleFor(i => i.Page)
            .Must(page => page >= 1, SearchMessages.PageGreaterThanZero);

        AddRuleFor(i => i.PageSize)
            .Must(pageSize => pageSize >= 1 && pageSize <= 50, SearchMessages.PageSizeBetweenOneAndFifty);

        AddRuleFor(i => i.InvoiceNumber)
            .Must(inv => string.IsNullOrEmpty(inv) || inv.Length <= 17, SearchMessages.InvoiceNumberMaximumLength)
            .Must(inv => string.IsNullOrEmpty(inv) || inv.All(ch => char.IsDigit(ch) || ch == '-'), SearchMessages.InvoiceNumberOnlyDigitsAndHyphens);

        AddRuleFor(i => i.CustomerName)
            .Must(name => string.IsNullOrEmpty(name) || name.Length <= 40, SearchMessages.CustomerNameMaximumLength)
            .Must(name => string.IsNullOrEmpty(name) || TextRules.OnlyLetters(name), SearchMessages.CustomerNameOnlyLetters);
    }
}
