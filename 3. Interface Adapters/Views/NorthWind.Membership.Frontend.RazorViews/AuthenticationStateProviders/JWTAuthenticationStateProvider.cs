using System.Security.Claims;
using Microsoft.AspNetCore.Components.Authorization;
using Microsoft.IdentityModel.JsonWebTokens;
using NorthWind.Membership.Entities.Dtos.UserLogin;
using NorthWind.Membership.Frontend.RazorViews.Interfaces;

namespace NorthWind.Membership.Frontend.RazorViews.AuthenticationStateProviders;

public class JWTAuthenticationStateProvider(ITokenStorage storage) : AuthenticationStateProvider
{
    public override async Task<AuthenticationState> GetAuthenticationStateAsync()
    {
        var identity = new ClaimsIdentity();
        var tokens = await storage.GetTokensAsync();
        if (!string.IsNullOrWhiteSpace(tokens?.AccessToken))
        {
            var token = new JsonWebTokenHandler().ReadJsonWebToken(tokens.AccessToken);
            identity = new ClaimsIdentity(token.Claims, nameof(JWTAuthenticationStateProvider));
        }

        return new AuthenticationState(new ClaimsPrincipal(identity));
    }

    public async ValueTask LoginAsync(TokensDto tokens)
    {
        await storage.StoreTokensAsync(tokens);
        NotifyAuthenticationStateChanged(GetAuthenticationStateAsync());
    }

    public async ValueTask LogoutAsync()
    {
        await storage.RemoveTokensAsync();
        NotifyAuthenticationStateChanged(GetAuthenticationStateAsync());
    }
}
