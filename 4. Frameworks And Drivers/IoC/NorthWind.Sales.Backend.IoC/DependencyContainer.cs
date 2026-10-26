namespace Microsoft.Extensions.DependencyInjection;

public static class DependencyContainer
{
    public static IServiceCollection AddNorthWindSalesServices(
        this IServiceCollection services,
        Action<DBOptions> configureDBOptions,
        Action<SmtpOptions> configureSmtpOptions,
        Action<NorthWind.Membership.Backend.AspNetIdentity.Options.MembershipDBOptions> configureMembershipDBOptions,
        Action<NorthWind.Membership.Backend.Core.Options.JwtOptions> configureJwtOptions)
    {
        services.AddUseCasesServices()
            .AddRepositories()
            .AddDataContexts(configureDBOptions)
            .AddPresenters()
            .AddValidationService()
            .AddValidators()
            .AddValidationExceptionHandler()
            .AddUpdateExceptionHandler()
            .AddUnauthorizedAccessExceptionHandler()
            .AddNotFoundExceptionHandler()
            .AddUnhandledExceptionHandler()
            .AddEventServices()
            .AddMailServices(configureSmtpOptions)
            .AddDomainLogsServices()
            .AddTransactionServices()
            .AddUserServices()
            .AddMembershipCoreServices(configureJwtOptions)
            .AddMembershipIdentityServices(configureMembershipDBOptions)
            .AddPdfGateways();

        return services;
    }
}
