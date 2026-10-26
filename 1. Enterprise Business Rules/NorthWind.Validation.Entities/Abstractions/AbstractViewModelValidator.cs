using NorthWind.Validation.Entities.Enums;
using NorthWind.Validation.Entities.Interfaces;
using NorthWind.Validation.Entities.ValueObjects;

namespace NorthWind.Validation.Entities.Abstractions;

public abstract class AbstractViewModelValidator<DtoType, ViewModelType>(IModelValidatorHub<DtoType> dtoModelValidatorHub,
    ValidationConstraint constraint) : IModelValidator<ViewModelType>
{
    public ValidationConstraint Constraint => constraint;
    public IEnumerable<ValidationError> Errors => dtoModelValidatorHub.Errors;
    public virtual DtoType Cast(ViewModelType viewModel)
    {
        var explicitMethod = typeof(ViewModelType).GetMethod("op_Explicit");
        if (explicitMethod is null) throw new InvalidCastException();
        return (DtoType)explicitMethod.Invoke(viewModel, [viewModel])!;
    }
    public Task<bool> Validate(ViewModelType model) => dtoModelValidatorHub.Validate(Cast(model));
}
