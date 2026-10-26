using NorthWind.Membership.Frontend.RazorViews.Resources;
using NorthWind.Validation.Entities.Abstractions;
using NorthWind.Validation.Entities.Interfaces;
namespace NorthWind.Membership.Frontend.RazorViews.ViewModels.UserRegistration;
internal class UserRegistrationViewModelValidator : AbstractModelValidator<UserRegistrationViewModel> { public UserRegistrationViewModelValidator(IValidationService<UserRegistrationViewModel> service):base(service) { AddRuleFor(v=>v.PasswordConfirmation).Equal(v=>v.Password,UserRegistrationMessages.ConfirmPasswordErrorMessage); } }
