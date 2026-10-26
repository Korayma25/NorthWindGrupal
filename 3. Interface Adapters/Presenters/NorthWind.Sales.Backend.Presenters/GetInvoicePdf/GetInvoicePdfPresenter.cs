namespace NorthWind.Sales.Backend.Presenters.GetInvoicePdf;

internal class GetInvoicePdfPresenter : IGetInvoicePdfOutputPort
{
    public byte[] Pdf { get; private set; } = [];

    public Task Handle(byte[] pdf)
    {
        Pdf = pdf;
        return Task.CompletedTask;
    }
}
