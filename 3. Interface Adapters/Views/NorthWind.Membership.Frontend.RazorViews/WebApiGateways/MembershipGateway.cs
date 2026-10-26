using System.Net.Http.Json;
using NorthWind.Membership.Entities.Dtos.UserRegistration;
using NorthWind.Membership.Entities.Dtos.UserLogin;
using NorthWind.Membership.Entities.ValueObjects;
namespace NorthWind.Membership.Frontend.RazorViews.WebApiGateways;
public class MembershipGateway(HttpClient client)
{
    public async Task RegisterAsync(UserRegistrationDto userData)
    {
        using var response = await client.PostAsJsonAsync(Endpoints.Register, userData);
        response.EnsureSuccessStatusCode();
    }

    public async Task<TokensDto> LoginAsync(UserCredentialsDto userCredentials)
    {
        using var response = await client.PostAsJsonAsync(Endpoints.Login, userCredentials);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<TokensDto>()
            ?? throw new InvalidDataException("La API no devolvió el token de acceso.");
    }
}
