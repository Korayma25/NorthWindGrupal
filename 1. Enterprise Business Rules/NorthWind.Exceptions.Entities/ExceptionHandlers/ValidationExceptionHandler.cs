namespace NorthWind.Exceptions.Entities.ExceptionHandlers;

internal class ValidationExceptionHandler : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        if (exception is not ValidationException validationException) return false;
        var details = new ProblemDetails
        {
            Status = StatusCodes.Status400BadRequest,
            Type = "https://datatracker.ietf.org/doc/html/rfc7231#section-6.5.1",
            Title = ExceptionMessages.ValidationExceptionTitle,
            Detail = ExceptionMessages.ValidationExceptionDetail,
            Instance = $"{nameof(ProblemDetails)}/{nameof(ValidationException)}"
        };
        details.Extensions.Add("errors", validationException.Errors);
        await httpContext.WriteProblemDetailsAsync(details);
        return true;
    }
}
