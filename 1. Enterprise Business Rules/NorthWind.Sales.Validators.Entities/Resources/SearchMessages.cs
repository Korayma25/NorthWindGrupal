namespace NorthWind.Sales.Validators.Entities.Resources;

internal static class SearchMessages
{
    public const string PageGreaterThanZero = "El número de página debe ser mayor o igual a 1.";
    public const string PageSizeBetweenOneAndFifty = "El tamaño de página debe estar entre 1 y 50.";
    public const string CustomerNameMaximumLength = "La longitud máxima del nombre del cliente es 40.";
    public const string CustomerNameOnlyLetters = "El nombre del cliente solo debe contener letras.";
    public const string IdentityCardOnlyDigits = "La cédula solo debe contener dígitos.";
    public const string IdentityCardMaximumLength = "La longitud máxima de la cédula es 10 dígitos.";
    public const string IdentityCardInvalid = "La cédula especificada no es una cédula ecuatoriana válida.";
    public const string ProductNameMaximumLength = "La longitud máxima del nombre del producto es 60.";
    public const string ProductCodeMaximumLength = "La longitud máxima del código del producto es 20.";
    public const string InvoiceNumberMaximumLength = "La longitud máxima del número de factura es 17.";
    public const string InvoiceNumberOnlyDigitsAndHyphens = "El número de factura solo debe contener dígitos y guiones.";
}
