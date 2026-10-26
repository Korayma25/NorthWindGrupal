namespace Microsoft.Extensions.DependencyInjection;

public static class DependencyContainer
{
    public static IServiceCollection AddPdfGateways(this IServiceCollection services)
    {
        services.AddScoped<IInvoicePdfGenerator, QuestPdfInvoiceGenerator>();
        return services;
    }
}
