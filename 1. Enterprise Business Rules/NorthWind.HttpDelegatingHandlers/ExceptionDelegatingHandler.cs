namespace NorthWind.HttpDelegatingHandlers;

public class ExceptionDelegatingHandler : DelegatingHandler
{
    protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
    {
        var response = await base.SendAsync(request, cancellationToken);
        if (response.IsSuccessStatusCode) return response;

        var errorMessage = await response.Content.ReadAsStringAsync(cancellationToken);
        string? source = null;
        string? message = null;
        IEnumerable<ValidationError>? errors = null;
        if (response.StatusCode is HttpStatusCode.Unauthorized or HttpStatusCode.Forbidden)
        {
            message = $"{(int)response.StatusCode} {response.ReasonPhrase}";
        }
        else
        {
            try
            {
                if (response.Content.Headers.ContentType?.MediaType == "application/problem+json")
                {
                    using var document = JsonDocument.Parse(errorMessage);
                    var json = document.RootElement;
                    if (TryGetProperty(json, "instance", out var instance) && instance.GetString() is { } instanceText && instanceText.StartsWith("ProblemDetails/", StringComparison.OrdinalIgnoreCase))
                    {
                        source = instanceText;
                        if (TryGetProperty(json, "title", out var title)) message = title.ToString();
                        if (TryGetProperty(json, "detail", out var detail)) message = string.Join(" ", new[] { message, detail.ToString() }.Where(value => !string.IsNullOrWhiteSpace(value)));
                        if (TryGetProperty(json, "errors", out var errorElement))
                            errors = errorElement.Deserialize<IEnumerable<ValidationError>>(new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                    }
                }
            }
            catch (Exception parseException) when (parseException is JsonException or InvalidOperationException)
            {
                // If the response is not valid ProblemDetails, expose its raw body below.
            }
            message ??= errorMessage;
        }

        var exception = new HttpRequestException(message, null, response.StatusCode) { Source = source };
        if (errors is not null) exception.Data.Add("Errors", errors);
        throw exception;
    }

    private static bool TryGetProperty(JsonElement element, string propertyName, out JsonElement value)
    {
        foreach (var property in element.EnumerateObject())
            if (string.Equals(property.Name, propertyName, StringComparison.OrdinalIgnoreCase))
            { value = property.Value; return true; }
        value = default;
        return false;
    }
}
