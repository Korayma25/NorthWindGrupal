using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using NorthWind.Membership.Backend.Core.Dtos;
using NorthWind.Membership.Backend.Core.Options;

namespace NorthWind.Membership.Backend.Core.Services;

internal class JwtService(IOptions<JwtOptions> options)
{
    private SigningCredentials GetSigningCredentials()
    {
        var key = Encoding.UTF8.GetBytes(options.Value.SecurityKey);
        return new SigningCredentials(
            new SymmetricSecurityKey(key),
            SecurityAlgorithms.HmacSha256);
    }

    private static List<Claim> GetClaims(UserDto user) =>
    [
        new Claim(ClaimTypes.Name, user.Email),
        new Claim("FullName", $"{user.FirstName} {user.LastName}")
    ];

    public string GetToken(UserDto user)
    {
        var descriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(GetClaims(user)),
            Issuer = options.Value.ValidIssuer,
            Audience = options.Value.ValidAudience,
            Expires = DateTime.UtcNow.AddMinutes(options.Value.ExpireInMinutes),
            SigningCredentials = GetSigningCredentials()
        };

        return new JsonWebTokenHandler().CreateToken(descriptor);
    }
}
