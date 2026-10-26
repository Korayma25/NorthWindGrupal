namespace Microsoft.Extensions.DependencyInjection;

public static class DomainLogsDependencyContainer
{
    public static IServiceCollection AddDomainLogsServices(
        this IServiceCollection services)
    {
        services.AddScoped<IDomainLogger, DomainLogger>();
        return services;
    }
}
