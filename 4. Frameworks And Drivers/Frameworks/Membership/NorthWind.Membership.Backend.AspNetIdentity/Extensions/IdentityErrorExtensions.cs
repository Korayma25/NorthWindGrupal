using Microsoft.AspNetCore.Identity;
using NorthWind.Membership.Backend.AspNetIdentity.Resources;
using NorthWind.Membership.Entities.Dtos.UserRegistration;
using NorthWind.Validation.Entities.ValueObjects;
namespace NorthWind.Membership.Backend.AspNetIdentity.Extensions;
internal static class IdentityErrorExtensions { public static IEnumerable<ValidationError> ToValidationErrors(this IEnumerable<IdentityError> errors) { List<ValidationError> result=[]; foreach(var error in errors) { if(error.Code==nameof(IdentityErrorDescriber.DuplicateUserName)) result.Add(new(nameof(UserRegistrationDto.Email),Messages.DuplicateUserNameErrorMessage)); else result.Add(new(error.Code,error.Description)); } return result; } }
