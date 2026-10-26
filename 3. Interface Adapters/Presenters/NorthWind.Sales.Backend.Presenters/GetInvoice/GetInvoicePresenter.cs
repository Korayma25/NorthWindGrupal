namespace NorthWind.Sales.Backend.Presenters.GetInvoice;

internal class GetInvoicePresenter : IGetInvoiceOutputPort
{
    public InvoiceDto Result { get; private set; } = null!;

    public Task Handle(InvoiceDto result)
    {
        Result = result;
        return Task.CompletedTask;
    }
}
