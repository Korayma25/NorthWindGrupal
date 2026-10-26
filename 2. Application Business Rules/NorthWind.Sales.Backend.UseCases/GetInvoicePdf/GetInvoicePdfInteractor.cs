namespace NorthWind.Sales.Backend.UseCases.GetInvoicePdf;

internal class GetInvoicePdfInteractor(
    IQueriesRepository repository,
    IInvoicePdfGenerator pdfGenerator,
    IGetInvoicePdfOutputPort outputPort) : IGetInvoicePdfInputPort
{
    public async Task Handle(int id)
    {
        var invoice = await repository.GetInvoice(id);
        if (invoice is null)
        {
            throw new NotFoundException(string.Format(InvoiceMessages.InvoiceNotFoundTemplate, id));
        }

        var pdfBytes = pdfGenerator.Generate(invoice);
        await outputPort.Handle(pdfBytes);
    }
}
