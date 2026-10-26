namespace Microsoft.AspNetCore.Builder;

public static class EndpointsContainer
{
    public static WebApplication MapNorthWindSalesEndpoints(
        this WebApplication app)
    {
        app.UseCreateOrderController();
        app.UseSearchCustomersController();
        app.UseSearchProductsController();
        app.UseSearchInvoicesController();
        app.UseGetInvoiceController();
        app.UseGetInvoicePdfController();
        app.UseMembershipEndpoints();
        return app;
    }
}
