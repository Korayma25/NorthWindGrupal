using NorthWind.HttpDelegatingHandlers;
using NorthWind.Membership.Entities.Dtos.UserRegistration;
using NorthWind.Membership.Entities.Validators.UserRegistration;
using NorthWind.Membership.Frontend.RazorViews.ViewModels.UserRegistration;
using NorthWind.Membership.Frontend.RazorViews.ViewModels.UserLogin;
using NorthWind.Membership.Frontend.RazorViews.AuthenticationStateProviders;
using NorthWind.Membership.Frontend.RazorViews.HttpMessageHandlers;
using NorthWind.Membership.Frontend.RazorViews.Interfaces;
using NorthWind.Membership.Frontend.RazorViews.Services;
using Microsoft.AspNetCore.Components.Authorization;
using Microsoft.Extensions.DependencyInjection.Extensions;
using NorthWind.Membership.Entities.Dtos.UserLogin;
using NorthWind.Membership.Frontend.RazorViews.WebApiGateways;
namespace Microsoft.Extensions.DependencyInjection;
public static class MembershipFrontendDependencyContainer
{
    public static IServiceCollection AddMembershipServices(this IServiceCollection services, Action<HttpClient> configure)
    {
        services.AddTransient<ExceptionDelegatingHandler>();
        services.AddHttpClient<MembershipGateway>(configure).AddHttpMessageHandler<ExceptionDelegatingHandler>();
        services.AddScoped<UserRegistrationViewModel>();
        services.AddScoped<UserLoginViewModel>();
        services.AddMembershipValidators();
        services.AddModelValidator<UserRegistrationViewModel, UserRegistrationViewModelDtoValidator>();
        services.AddModelValidator<UserRegistrationViewModel, UserRegistrationViewModelValidator>();
        services.AddModelValidator<UserLoginViewModel, UserLoginViewModelDtoValidator>();
        services.AddAuthorizationCore();
        services.AddScoped<ITokenStorage, TokenLocalStorage>();
        services.AddScoped<JWTAuthenticationStateProvider>();
        services.AddScoped<AuthenticationStateProvider>(provider =>
            provider.GetRequiredService<JWTAuthenticationStateProvider>());
        return services;
    }

    public static IHttpClientBuilder AddMembershipBearerTokenHandler(this IHttpClientBuilder builder)
    {
        builder.Services.TryAddTransient<MembershipBearerTokenHandler>();
        builder.AddHttpMessageHandler<MembershipBearerTokenHandler>();
        return builder;
    }
}
