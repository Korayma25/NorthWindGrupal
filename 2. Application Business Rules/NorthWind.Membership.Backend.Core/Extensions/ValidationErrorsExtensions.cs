using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NorthWind.Validation.Entities.ValueObjects;
namespace NorthWind.Membership.Backend.Core.Extensions;
internal static class ValidationErrorsExtensions { public static ProblemDetails ToProblemDetails(this IEnumerable<ValidationError> errors,string title,string detail,string instance) { var p=new ProblemDetails { Status=StatusCodes.Status400BadRequest,Type="https://datatracker.ietf.org/doc/html/rfc7231#section-6.5.1",Title=title,Detail=detail,Instance=$"ProblemDetails/{instance}" }; p.Extensions.Add("errors",errors); return p; } }
