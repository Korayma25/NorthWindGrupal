using NorthWind.Membership.Entities.Dtos.UserLogin;
using NorthWind.Membership.Frontend.RazorViews.WebApiGateways;
using NorthWind.RazorComponents.Validators;
using NorthWind.Validation.Entities.Interfaces;
using NorthWind.Validation.Entities.ValueObjects;
using NorthWind.Membership.Frontend.RazorViews.AuthenticationStateProviders;

namespace NorthWind.Membership.Frontend.RazorViews.ViewModels.UserLogin;

public class UserLoginViewModel(
    MembershipGateway gateway,
    IModelValidatorHub<UserLoginViewModel> validator,
    JWTAuthenticationStateProvider authenticationStateProvider)
{
    public IModelValidatorHub<UserLoginViewModel> Validator => validator;
    public ModelValidator<UserLoginViewModel>? ModelValidatorComponentReference { get; set; }
    public event Action? OnLogin;

    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;

    public async Task Login()
    {
        try
        {
            var tokens = await gateway.LoginAsync((UserCredentialsDto)this);
            await authenticationStateProvider.LoginAsync(tokens);
            OnLogin?.Invoke();
        }
        catch (HttpRequestException exception)
        {
            if (exception.Data["Errors"] is IEnumerable<ValidationError> errors)
            {
                ModelValidatorComponentReference?.AddErrors(errors);
            }
            else
            {
                throw;
            }
        }
    }

    public static explicit operator UserCredentialsDto(UserLoginViewModel model) =>
        new(model.Email, model.Password);
}
