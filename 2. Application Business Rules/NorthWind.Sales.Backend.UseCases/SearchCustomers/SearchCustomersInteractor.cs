namespace NorthWind.Sales.Backend.UseCases.SearchCustomers;

internal class SearchCustomersInteractor(
    IQueriesRepository repository,
    ISearchCustomersOutputPort outputPort,
    IModelValidatorHub<SearchCustomersDto> validatorHub) : ISearchCustomersInputPort
{
    public async Task Handle(SearchCustomersDto searchDto)
    {
        await GuardModel.AgainstNotValid(validatorHub, searchDto);
        var result = await repository.SearchCustomers(searchDto);
        await outputPort.Handle(result);
    }
}
