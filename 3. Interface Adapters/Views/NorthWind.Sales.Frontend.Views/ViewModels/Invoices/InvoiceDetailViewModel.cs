namespace NorthWind.Sales.Frontend.Views.ViewModels.Invoices;

public class InvoiceDetailViewModel(IInvoiceGateway gateway)
{
    public int Id { get; set; }
    public InvoiceDto? Invoice { get; private set; }
    public byte[]? PdfContent { get; private set; }
    public bool IsLoading { get; private set; }
    public string? ErrorMessage { get; private set; }

    public async Task LoadAsync(int id)
    {
        Id = id;
        IsLoading = true;
        ErrorMessage = null;
        try
        {
            Invoice = await gateway.GetAsync(id);
            if (Invoice == null)
            {
                ErrorMessage = InvoiceMessages.InvoiceNotFound;
            }
        }
        catch (Exception ex)
        {
            ErrorMessage = ex.Message;
        }
        finally
        {
            IsLoading = false;
        }
    }

    public async Task LoadPdfAsync(int id)
    {
        Id = id;
        IsLoading = true;
        ErrorMessage = null;
        try
        {
            PdfContent = await gateway.GetPdfAsync(id);
        }
        catch (Exception ex)
        {
            ErrorMessage = ex.Message;
        }
        finally
        {
            IsLoading = false;
        }
    }
}
