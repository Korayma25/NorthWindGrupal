namespace NorthWind.Sales.Backend.UseCases.GetInvoice;

internal class GetInvoiceInteractor(
    IQueriesRepository repository,
    IGetInvoiceOutputPort outputPort) : IGetInvoiceInputPort
{
    public async Task Handle(int id)
    {
        var invoice = await repository.GetInvoice(id);
        if (invoice is null)
        {
            throw new NotFoundException(string.Format(InvoiceMessages.InvoiceNotFoundTemplate, id));
        }

        await outputPort.Handle(invoice);
    }
}
