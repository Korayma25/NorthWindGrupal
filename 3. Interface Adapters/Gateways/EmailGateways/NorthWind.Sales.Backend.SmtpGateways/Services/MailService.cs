namespace NorthWind.Sales.Backend.SmtpGateways.Services;

internal class MailService(IOptions<SmtpOptions> smtpOptions, ILogger<MailService> logger) : IMailService
{
#pragma warning disable SYSLIB0014
    public async Task SendMailToAdministrator(string subject, string body)
    {
        try
        {
            using var message = new MailMessage(smtpOptions.Value.SenderEmail, smtpOptions.Value.AdministratorEmail)
            { Subject = subject, Body = body };
            using var client = new SmtpClient(smtpOptions.Value.SmtpHost, smtpOptions.Value.SmtpHostPort)
            {
                Credentials = new NetworkCredential(smtpOptions.Value.SmtpUserName, smtpOptions.Value.SmtpPassword),
                EnableSsl = true
            };
            await client.SendMailAsync(message);
        }
        catch (Exception exception)
        {
            logger.LogError(exception, "{Message}", exception.Message);
            throw;
        }
    }
#pragma warning restore SYSLIB0014
}
