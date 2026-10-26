namespace Microsoft.Extensions.DependencyInjection;

public static class DependencyContainer
{
    public static IServiceCollection AddWebApiGateways(
        this IServiceCollection services,
        Action<HttpClient> configureHttpClient,
        Action<IHttpClientBuilder> configureHttpClientBuilder)
    {
        services.AddExceptionDelegatingHandler();
        Add<ICreateOrderGateway, CreateOrderGateway>(services, configureHttpClient, configureHttpClientBuilder);
        Add<ISearchCustomersGateway, SearchCustomersGateway>(services, configureHttpClient, configureHttpClientBuilder);
        Add<ISearchProductsGateway, SearchProductsGateway>(services, configureHttpClient, configureHttpClientBuilder);
        Add<IInvoiceGateway, InvoiceGateway>(services, configureHttpClient, configureHttpClientBuilder);
        return services;
    }

    static void Add<TClient, TImpl>(
        IServiceCollection services,
        Action<HttpClient> cfg,
        Action<IHttpClientBuilder> cfgBuilder)
        where TClient : class
        where TImpl : class, TClient
    {
        var Builder = services.AddHttpClient<TClient, TImpl>(cfg)
            .AddHttpMessageHandler<ExceptionDelegatingHandler>();
        cfgBuilder(Builder);
    }
}
