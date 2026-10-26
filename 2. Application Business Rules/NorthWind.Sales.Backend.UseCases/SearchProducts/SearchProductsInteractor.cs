namespace NorthWind.Sales.Backend.UseCases.SearchProducts;

internal class SearchProductsInteractor(
    IQueriesRepository repository,
    ISearchProductsOutputPort outputPort,
    IModelValidatorHub<SearchProductsDto> validatorHub) : ISearchProductsInputPort
{
    public async Task Handle(SearchProductsDto searchDto)
    {
        await GuardModel.AgainstNotValid(validatorHub, searchDto);
        var result = await repository.SearchProductsInStock(searchDto);
        await outputPort.Handle(result);
    }
}
