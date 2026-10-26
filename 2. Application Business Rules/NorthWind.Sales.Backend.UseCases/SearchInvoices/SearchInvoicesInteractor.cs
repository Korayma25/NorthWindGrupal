namespace NorthWind.Sales.Backend.UseCases.SearchInvoices;

internal class SearchInvoicesInteractor(
    IQueriesRepository repository,
    ISearchInvoicesOutputPort outputPort,
    IModelValidatorHub<SearchInvoicesDto> validatorHub) : ISearchInvoicesInputPort
{
    public async Task Handle(SearchInvoicesDto searchDto)
    {
        await GuardModel.AgainstNotValid(validatorHub, searchDto);
        var result = await repository.SearchInvoices(searchDto);
        await outputPort.Handle(result);
    }
}
