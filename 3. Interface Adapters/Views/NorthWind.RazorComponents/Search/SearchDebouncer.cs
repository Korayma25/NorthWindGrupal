namespace NorthWind.RazorComponents.Search;

public class SearchDebouncer : IDisposable
{
    private CancellationTokenSource? DebounceCts;
    private long SearchVersion;

    public int DebounceMilliseconds { get; set; } = 400;

    public long CurrentVersion => Interlocked.Read(ref SearchVersion);

    public bool IsLatest(long version) => Interlocked.Read(ref SearchVersion) == version;

    public void CancelDebounce()
    {
        DebounceCts?.Cancel();
        DebounceCts?.Dispose();
        DebounceCts = null;
    }

    public void CancelAll()
    {
        CancelDebounce();
        Interlocked.Increment(ref SearchVersion);
    }

    public async Task DebounceAsync(Func<long, Task> executeSearch, Func<bool>? canSearch = null)
    {
        CancelDebounce();

        if (canSearch != null && !canSearch())
        {
            return;
        }

        DebounceCts = new CancellationTokenSource();
        var Token = DebounceCts.Token;

        try
        {
            await Task.Delay(DebounceMilliseconds, Token);
            if (Token.IsCancellationRequested)
            {
                return;
            }

            if (canSearch != null && !canSearch())
            {
                return;
            }

            var Version = Interlocked.Increment(ref SearchVersion);
            await executeSearch(Version);
        }
        catch (OperationCanceledException)
        {
            // Expected when a new debounce or search cancels the wait.
        }
    }

    public async Task ExecuteImmediateAsync(Func<long, Task> executeSearch)
    {
        CancelDebounce();
        var Version = Interlocked.Increment(ref SearchVersion);
        try
        {
            await executeSearch(Version);
        }
        catch (OperationCanceledException)
        {
            // Expected if canceled.
        }
    }

    public void Dispose()
    {
        CancelAll();
    }
}
