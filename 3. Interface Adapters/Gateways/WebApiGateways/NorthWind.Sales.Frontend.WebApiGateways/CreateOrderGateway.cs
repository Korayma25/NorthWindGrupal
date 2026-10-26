namespace NorthWind.Sales.Frontend.WebApiGateways;

internal class CreateOrderGateway(HttpClient client) : ICreateOrderGateway
{
    public async Task<int> CreateOrderAsync(CreateOrderDto order)
    {
        var response = await client.PostAsJsonAsync(Endpoints.CreateOrder, order);
        return await response.Content.ReadFromJsonAsync<int>();
    }
}
