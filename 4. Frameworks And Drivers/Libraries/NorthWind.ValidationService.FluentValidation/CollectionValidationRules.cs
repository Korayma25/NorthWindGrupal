using NorthWind.Validation.Entities.Abstractions;
using NorthWind.ValidationService.FluentValidation;

namespace NorthWind.ValidationService.FluentValidation;

internal class CollectionValidationRules<T, TProperty>(IRuleBuilderInitialCollection<T, TProperty> ruleBuilderInitialCollection) : ICollectionValidationRules<T, TProperty>
{
    public ICollectionValidationRules<T, TProperty> SetValidator(IModelValidator<TProperty> modelValidator)
    {
        var abstractValidator = (AbstractModelValidator<TProperty>)modelValidator;
        var validationService = (FluentValidationService<TProperty>)abstractValidator.ValidatorService;
        ruleBuilderInitialCollection.SetValidator(validationService.Wrapper);
        return this;
    }
}
