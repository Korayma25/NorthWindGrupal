namespace NorthWind.Exceptions.Entities.ExceptionHandlers;

internal class NotFoundExceptionHandler : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        if (exception is not NotFoundException notFoundException) return false;
        var details = new ProblemDetails
        {
            Status = StatusCodes.Status404NotFound,
            Type = "https://datatracker.ietf.org/doc/html/rfc7231#section-6.5.4",
            Title = ExceptionMessages.NotFoundExceptionTitle,
            Detail = notFoundException.Message,
            Instance = $"{nameof(ProblemDetails)}/{nameof(NotFoundException)}"
        };
        await httpContext.WriteProblemDetailsAsync(details);
        return true;
    }
}
