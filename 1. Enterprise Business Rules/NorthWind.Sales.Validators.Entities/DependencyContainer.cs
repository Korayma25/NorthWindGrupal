using NorthWind.Sales.Validators.Entities.CreateOrder;
using NorthWind.Sales.Validators.Entities.SearchCustomers;
using NorthWind.Sales.Validators.Entities.SearchProducts;
using NorthWind.Sales.Validators.Entities.SearchInvoices;
using NorthWind.Validation.Entities.Interfaces;

namespace Microsoft.Extensions.DependencyInjection;

public static class DependencyContainer
{
    public static IServiceCollection AddValidators(this IServiceCollection services)
    {
        services.AddModelValidator<CreateOrderDto, CreateOrderDtoValidator>();
        services.AddModelValidator<CreateOrderDetailDto, CreateOrderDetailDtoValidator>();
        services.AddModelValidator<SearchCustomersDto, SearchCustomersDtoValidator>();
        services.AddModelValidator<SearchProductsDto, SearchProductsDtoValidator>();
        services.AddModelValidator<SearchInvoicesDto, SearchInvoicesDtoValidator>();
        return services;
    }
}
