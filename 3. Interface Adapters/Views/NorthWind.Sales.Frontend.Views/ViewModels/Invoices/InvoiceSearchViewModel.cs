namespace NorthWind.Sales.Frontend.Views.ViewModels.Invoices;

public class InvoiceSearchViewModel(IInvoiceGateway gateway) : IDisposable
{
    private readonly SearchDebouncer Debouncer = new();

    public int DebounceMilliseconds
    {
        get => Debouncer.DebounceMilliseconds;
        set => Debouncer.DebounceMilliseconds = value;
    }

    public int MinSearchLength { get; set; } = 2;

    public string InvoiceNumber { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public PagedResultDto<InvoiceSummaryDto>? Invoices { get; private set; }
    public bool IsLoading { get; private set; }

    public async Task SearchAsync(int page = 1)
    {
        Page = page;
        await Debouncer.ExecuteImmediateAsync(async version =>
        {
            IsLoading = true;
            try
            {
                var Criteria = new SearchInvoicesDto(InvoiceNumber, CustomerName, Page, PageSize);
                var Result = await gateway.SearchAsync(Criteria);
                if (Debouncer.IsLatest(version))
                {
                    Invoices = Result;
                }
            }
            catch (OperationCanceledException)
            {
                // Ignored
            }
            finally
            {
                if (Debouncer.IsLatest(version))
                {
                    IsLoading = false;
                }
            }
        });
    }

    public async Task NotifyFilterChangedAsync(Func<bool>? canSearch, Action? onStateChanged = null)
    {
        await Debouncer.DebounceAsync(async version =>
        {
            Page = 1;
            IsLoading = true;
            onStateChanged?.Invoke();

            try
            {
                var Criteria = new SearchInvoicesDto(InvoiceNumber, CustomerName, Page, PageSize);
                var Result = await gateway.SearchAsync(Criteria);
                if (Debouncer.IsLatest(version))
                {
                    Invoices = Result;
                }
            }
            catch (OperationCanceledException)
            {
                // Ignored
            }
            finally
            {
                if (Debouncer.IsLatest(version))
                {
                    IsLoading = false;
                    onStateChanged?.Invoke();
                }
            }
        }, canSearch);
    }

    public void CancelPending() => Debouncer.CancelAll();

    public void Dispose() => Debouncer.Dispose();
}
