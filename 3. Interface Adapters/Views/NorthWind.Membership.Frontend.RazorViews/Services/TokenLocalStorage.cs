using System.Text.Json;
using Microsoft.JSInterop;
using NorthWind.Membership.Entities.Dtos.UserLogin;
using NorthWind.Membership.Frontend.RazorViews.Interfaces;

namespace NorthWind.Membership.Frontend.RazorViews.Services;

internal class TokenLocalStorage(IJSRuntime jsRuntime) : ITokenStorage
{
    private const string StorageKey = "tokens";

    public async Task StoreTokensAsync(TokensDto tokens)
    {
        var value = JsonSerializer.Serialize(tokens);
        await jsRuntime.InvokeVoidAsync("localStorage.setItem", StorageKey, value);
    }

    public async Task<TokensDto?> GetTokensAsync()
    {
        var value = await jsRuntime.InvokeAsync<string?>("localStorage.getItem", StorageKey);
        return value is null ? null : JsonSerializer.Deserialize<TokensDto>(value);
    }

    public async Task RemoveTokensAsync() =>
        await jsRuntime.InvokeVoidAsync("localStorage.removeItem", StorageKey);
}
