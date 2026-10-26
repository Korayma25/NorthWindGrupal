namespace Microsoft.AspNetCore.Builder;

public static class GetInvoiceController
{
    public static WebApplication UseGetInvoiceController(this WebApplication app)
    {
        app.MapGet(Endpoints.GetInvoice, GetInvoice).RequireAuthorization();
        return app;
    }

    public static async Task<InvoiceDto> GetInvoice(
        int id,
        IGetInvoiceInputPort inputPort,
        IGetInvoiceOutputPort presenter)
    {
        await inputPort.Handle(id);
        return presenter.Result;
    }
}
