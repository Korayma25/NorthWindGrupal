using NorthWind.Membership.Entities.Dtos.UserRegistration;
using NorthWind.Membership.Entities.Dtos.UserLogin;
using NorthWind.Membership.Entities.Validators.UserRegistration;
using NorthWind.Membership.Entities.Validators.UserLogin;
namespace Microsoft.Extensions.DependencyInjection;
public static class MembershipValidatorsDependencyContainer
{
    public static IServiceCollection AddMembershipValidators(this IServiceCollection services)
    {
        services.AddModelValidator<UserRegistrationDto, UserRegistrationDtoValidator>();
        services.AddModelValidator<UserCredentialsDto, UserCredentialsDtoValidator>();
        return services;
    }
}
