namespace Microsoft.AspNetCore.Builder;

public static class GetInvoicePdfController
{
    public static WebApplication UseGetInvoicePdfController(this WebApplication app)
    {
        app.MapGet(Endpoints.GetInvoicePdf, GetInvoicePdf).RequireAuthorization();
        return app;
    }

    public static async Task<IResult> GetInvoicePdf(
        int id,
        IGetInvoicePdfInputPort inputPort,
        IGetInvoicePdfOutputPort presenter)
    {
        await inputPort.Handle(id);
        return Results.File(presenter.Pdf, "application/pdf", $"invoice-{id}.pdf");
    }
}
