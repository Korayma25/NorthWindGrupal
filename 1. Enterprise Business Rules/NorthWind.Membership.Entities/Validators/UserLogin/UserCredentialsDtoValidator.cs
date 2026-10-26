using NorthWind.Membership.Entities.Dtos.UserLogin;
using NorthWind.Membership.Entities.Resources;
using NorthWind.Validation.Entities.Abstractions;
using NorthWind.Validation.Entities.Interfaces;

namespace NorthWind.Membership.Entities.Validators.UserLogin;

internal class UserCredentialsDtoValidator : AbstractModelValidator<UserCredentialsDto>
{
    public UserCredentialsDtoValidator(IValidationService<UserCredentialsDto> validationService)
        : base(validationService)
    {
        AddRuleFor(user => user.Email)
            .NotEmpty(UserLoginMessages.RequiredEmailErrorMessage)
            .EmailAddress(UserLoginMessages.InvalidEmailErrorMessage);
        AddRuleFor(user => user.Password)
            .NotEmpty(UserLoginMessages.RequiredPasswordErrorMessage);
    }
}
