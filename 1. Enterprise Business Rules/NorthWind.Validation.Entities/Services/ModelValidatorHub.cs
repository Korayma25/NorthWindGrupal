using NorthWind.Validation.Entities.Enums;
using NorthWind.Validation.Entities.Interfaces;
using NorthWind.Validation.Entities.ValueObjects;

namespace Microsoft.Extensions.DependencyInjection;

internal class ModelValidatorHub<ModelType>(IEnumerable<IModelValidator<ModelType>> validators) : IModelValidatorHub<ModelType>
{
    public IEnumerable<ValidationError> Errors { get; private set; } = [];
    public async Task<bool> Validate(ModelType model)
    {
        var currentErrors = new List<ValidationError>();
        var orderedValidators = validators.Where(v => v.Constraint == ValidationConstraint.AlwaysValidate)
            .Concat(validators.Where(v => v.Constraint == ValidationConstraint.ValidateIfThereAreNoPreviousErrors));
        foreach (var validator in orderedValidators)
        {
            if (validator.Constraint == ValidationConstraint.AlwaysValidate || !currentErrors.Any())
                if (!await validator.Validate(model)) currentErrors.AddRange(validator.Errors);
        }
        Errors = currentErrors;
        return !Errors.Any();
    }
}
