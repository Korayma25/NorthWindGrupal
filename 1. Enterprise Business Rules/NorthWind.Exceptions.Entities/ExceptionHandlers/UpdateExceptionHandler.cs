namespace NorthWind.Exceptions.Entities.ExceptionHandlers;

internal class UpdateExceptionHandler(ILogger<UpdateExceptionHandler> logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        if (exception is not UpdateException updateException) return false;
        var details = new ProblemDetails
        {
            Status = StatusCodes.Status500InternalServerError,
            Type = "https://datatracker.ietf.org/doc/html/rfc7231#section-6.6.1",
            Title = ExceptionMessages.UpdateExceptionTitle,
            Detail = ExceptionMessages.UpdateExceptionDetail,
            Instance = $"{nameof(ProblemDetails)}/{nameof(UpdateException)}"
        };
        logger.LogError(exception, "{Title} {Entities}", ExceptionMessages.UpdateExceptionTitle, string.Join(" ", updateException.Entities));
        await httpContext.WriteProblemDetailsAsync(details);
        return true;
    }
}
