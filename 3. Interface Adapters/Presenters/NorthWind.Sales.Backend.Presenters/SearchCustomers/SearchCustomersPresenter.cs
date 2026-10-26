namespace NorthWind.Sales.Backend.Presenters.SearchCustomers;

internal class SearchCustomersPresenter : ISearchCustomersOutputPort
{
    public PagedResultDto<CustomerLookupDto> Result { get; private set; } = null!;

    public Task Handle(PagedResultDto<CustomerLookupDto> result)
    {
        Result = result;
        return Task.CompletedTask;
    }
}
