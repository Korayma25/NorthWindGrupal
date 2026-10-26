namespace NorthWind.Membership.Entities.Resources;
public static class UserRegistrationMessages
{
 public const string RequiredFirstNameErrorMessage="El nombre es requerido.";
 public const string RequiredLastNameErrorMessage="El apellido es requerido.";
 public const string RequiredEmailErrorMessage="El correo es requerido.";
 public const string InvalidEmailErrorMessage="El formato de correo no es válido.";
 public const string RequiredPasswordErrorMessage="La contraseña es requerida.";
 public const string PasswordTooShortErrorMessage="Se requiere al menos 6 caracteres en la contraseña.";
 public const string PasswordRequiresLowerErrorMessage="Se requiere al menos un caracter minúscula en la contraseña.";
 public const string PasswordRequiresUpperErrorMessage="Se requiere al menos un caracter mayúscula en la contraseña.";
 public const string PasswordRequiresDigitErrorMessage="Se requiere al menos un dígito en la contraseña.";
 public const string PasswordRequiresNonAlphanumericErrorMessage="Se requiere al menos un caracter no alfanumérico en la contraseña.";
 public const string ConfirmPasswordErrorMessage="La contraseña y la confirmación no coinciden.";
 public const string RegisteredUserMessage="Usuario registrado exitosamente.";
 public const string FirstNameLabel="Nombre"; public const string LastNameLabel="Apellidos";
 public const string PasswordConfirmationLabel="Confirmar contraseña"; public const string RegisterButtonText="Registrar";
}
