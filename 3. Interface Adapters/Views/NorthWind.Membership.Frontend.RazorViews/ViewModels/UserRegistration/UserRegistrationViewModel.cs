using NorthWind.Membership.Entities.Dtos.UserRegistration;
using NorthWind.Membership.Entities.ValueObjects;
using NorthWind.Membership.Frontend.RazorViews.Resources;
using NorthWind.Membership.Frontend.RazorViews.WebApiGateways;
using NorthWind.RazorComponents.Validators;
using NorthWind.Validation.Entities.Interfaces;
using NorthWind.Validation.Entities.ValueObjects;
namespace NorthWind.Membership.Frontend.RazorViews.ViewModels.UserRegistration;
public class UserRegistrationViewModel(MembershipGateway gateway,IModelValidatorHub<UserRegistrationViewModel> validator)
{
 public IModelValidatorHub<UserRegistrationViewModel> Validator=>validator;
 public ModelValidator<UserRegistrationViewModel>? ModelValidatorComponentReference {get;set;}
 public string FirstName {get;set;}=string.Empty; public string LastName {get;set;}=string.Empty; public string Email {get;set;}=string.Empty; public string Password {get;set;}=string.Empty; public string PasswordConfirmation {get;set;}=string.Empty; public string InformationMessage {get;private set;}=string.Empty;
 public async Task Register() { try { InformationMessage=string.Empty; await gateway.RegisterAsync((UserRegistrationDto)this); InformationMessage=UserRegistrationMessages.RegisteredUserMessage; } catch(HttpRequestException ex) { if(ex.Data["Errors"] is IEnumerable<ValidationError> errors) ModelValidatorComponentReference?.AddErrors(errors); else throw; } }
 public static explicit operator UserRegistrationDto(UserRegistrationViewModel model)=>new(model.Email,model.Password,model.FirstName,model.LastName);
}
