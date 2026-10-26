using NorthWind.Membership.Backend.Core.Interfaces.UserRegistration;
using NorthWind.Membership.Backend.Core.Interfaces.UserLogin;
using NorthWind.Membership.Backend.Core.Presenters.UserRegistration;
using NorthWind.Membership.Backend.Core.Presenters.UserLogin;
using NorthWind.Membership.Backend.Core.UseCases.UserLogin;
using NorthWind.Membership.Backend.Core.UseCases.UserRegistration;
using NorthWind.Membership.Backend.Core.Services;
using NorthWind.Membership.Backend.Core.Options;
namespace Microsoft.Extensions.DependencyInjection;
public static class MembershipCoreDependencyContainer
{
    public static IServiceCollection AddMembershipCoreServices(
        this IServiceCollection services,
        Action<JwtOptions> configureJwtOptions)
    {
        services.AddMembershipValidators();
        services.AddDefaultModelValidatorHub();
        services.AddScoped<IUserRegistrationInputPort, UserRegistrationInteractor>();
        services.AddScoped<IUserRegistrationOutputPort, UserRegistrationPresenter>();
        services.AddScoped<IUserLoginInputPort, UserLoginInteractor>();
        services.AddScoped<IUserLoginOutputPort, UserLoginPresenter>();
        services.AddSingleton<JwtService>();
        services.Configure(configureJwtOptions);
        return services;
    }
}
