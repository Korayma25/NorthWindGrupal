namespace Microsoft.Extensions.DependencyInjection;

public static class DependencyContainer
{
    public static IServiceCollection AddPresenters(
        this IServiceCollection services)
    {
        services.AddScoped<ICreateOrderOutputPort, CreateOrderPresenter>();
        services.AddScoped<ISearchCustomersOutputPort, SearchCustomersPresenter>();
        services.AddScoped<ISearchProductsOutputPort, SearchProductsPresenter>();
        services.AddScoped<ISearchInvoicesOutputPort, SearchInvoicesPresenter>();
        services.AddScoped<IGetInvoiceOutputPort, GetInvoicePresenter>();
        services.AddScoped<IGetInvoicePdfOutputPort, GetInvoicePdfPresenter>();
        return services;
    }
}
