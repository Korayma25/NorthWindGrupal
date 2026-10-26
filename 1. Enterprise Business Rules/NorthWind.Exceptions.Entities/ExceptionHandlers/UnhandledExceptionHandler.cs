namespace NorthWind.Exceptions.Entities.ExceptionHandlers;

internal class UnhandledExceptionHandler(ILogger<UnhandledExceptionHandler> logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        var details = new ProblemDetails
        {
            Status = StatusCodes.Status500InternalServerError,
            Type = "https://datatracker.ietf.org/doc/html/rfc7231#section-6.6.1",
            Title = ExceptionMessages.UnhandledExceptionTitle,
            Detail = ExceptionMessages.UnhandledExceptionDetail,
            Instance = $"{nameof(ProblemDetails)}/{exception.GetType()}"
        };
        logger.LogError(exception, "{Title}", ExceptionMessages.UnhandledExceptionTitle);
        await httpContext.WriteProblemDetailsAsync(details);
        return true;
    }
}
