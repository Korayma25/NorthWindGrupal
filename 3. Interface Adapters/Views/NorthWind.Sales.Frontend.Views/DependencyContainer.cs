namespace Microsoft.Extensions.DependencyInjection;

public static class DependencyContainer
{
    public static IServiceCollection AddViewsServices(
        this IServiceCollection services)
    {
        services.AddScoped<CreateOrderViewModel>();
        services.AddScoped<InvoiceSearchViewModel>();
        services.AddScoped<InvoiceDetailViewModel>();
        services.AddModelValidator<CreateOrderViewModel, CreateOrderViewModelValidator>();
        services.AddModelValidator<CreateOrderViewModel, CreateOrderViewModelDetailsValidator>();
        return services;
    }
}
