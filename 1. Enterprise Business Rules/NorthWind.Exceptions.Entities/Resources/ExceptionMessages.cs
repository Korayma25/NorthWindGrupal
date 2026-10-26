namespace NorthWind.Exceptions.Entities.Resources;

internal static class ExceptionMessages
{
    public const string ValidationExceptionTitle = "Error en los datos de entrada.";
    public const string ValidationExceptionDetail = "Se encontraron uno o más errores de validación de datos.";
    public const string UpdateExceptionTitle = "Error de actualización.";
    public const string UpdateExceptionDetail = "Se encontraron uno o más errores de actualización de datos. Consulte al administrador.";
    public const string UnhandledExceptionTitle = "El servicio no se encuentra disponible.";
    public const string UnhandledExceptionDetail = "Consulte al administrador.";
    public const string UnauthorizedAccessExceptionTitle = "Acceso no autorizado.";
    public const string UnauthorizedAccessExceptionDetail = "El acceso al recurso solicitado está restringido a usuarios autorizados.";
    public const string NotFoundExceptionTitle = "Recurso no encontrado.";
}
