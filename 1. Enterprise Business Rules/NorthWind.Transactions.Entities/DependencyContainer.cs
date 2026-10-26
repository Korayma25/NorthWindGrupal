namespace Microsoft.Extensions.DependencyInjection;

public static class TransactionsDependencyContainer
{
    public static IServiceCollection AddTransactionServices(
        this IServiceCollection services)
    {
        services.AddTransient<IDomainTransaction, DomainTransaction>();
        return services;
    }
}
