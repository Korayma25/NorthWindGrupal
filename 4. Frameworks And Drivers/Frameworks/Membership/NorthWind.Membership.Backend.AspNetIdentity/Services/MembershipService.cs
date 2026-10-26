using Microsoft.AspNetCore.Identity;
using NorthWind.Membership.Backend.AspNetIdentity.Entities;
using NorthWind.Membership.Backend.AspNetIdentity.Extensions;
using NorthWind.Membership.Backend.Core.Interfaces.Common;
using NorthWind.Membership.Entities.Dtos.UserRegistration;
using NorthWind.Membership.Entities.Dtos.UserLogin;
using NorthWind.Membership.Backend.Core.Dtos;
using NorthWind.Result.Entities;
using NorthWind.Validation.Entities.ValueObjects;
namespace NorthWind.Membership.Backend.AspNetIdentity.Services;
internal class MembershipService(UserManager<NorthWindUser> manager) : IMembershipService
{
    public async Task<Result<IEnumerable<ValidationError>>> Register(UserRegistrationDto userData)
    {
        var user = new NorthWindUser
        {
            UserName = userData.Email,
            Email = userData.Email,
            FirstName = userData.FirstName,
            LastName = userData.LastName
        };
        var created = await manager.CreateAsync(user, userData.Password);
        return created.Succeeded
            ? new Result<IEnumerable<ValidationError>>()
            : new Result<IEnumerable<ValidationError>>(created.Errors.ToValidationErrors());
    }

    public async Task<UserDto?> GetUserByCredentials(UserCredentialsDto userData)
    {
        var user = await manager.FindByNameAsync(userData.Email);
        if (user is null || !await manager.CheckPasswordAsync(user, userData.Password))
        {
            return null;
        }

        return new UserDto(user.Email ?? user.UserName!, user.FirstName, user.LastName);
    }
}
