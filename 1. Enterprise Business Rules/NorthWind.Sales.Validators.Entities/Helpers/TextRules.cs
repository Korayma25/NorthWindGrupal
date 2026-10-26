namespace NorthWind.Sales.Validators.Entities.Helpers;

public static class TextRules
{
    public static bool OnlyLetters(string? text) =>
        string.IsNullOrEmpty(text) || text.All(c => char.IsLetter(c) || char.IsWhiteSpace(c));

    public static bool OnlyDigits(string? text) =>
        string.IsNullOrEmpty(text) || text.All(char.IsDigit);

    public static string KeepLetters(string? text)
    {
        if (string.IsNullOrEmpty(text))
        {
            return string.Empty;
        }

        var filtered = text.Where(c => char.IsLetter(c) || char.IsWhiteSpace(c)).ToArray();
        return new string(filtered);
    }

    public static string KeepDigits(string? text)
    {
        if (string.IsNullOrEmpty(text))
        {
            return string.Empty;
        }

        var filtered = text.Where(c => c >= '0' && c <= '9').ToArray();
        return new string(filtered);
    }

    public static string KeepDigitsAndHyphen(string? text)
    {
        if (string.IsNullOrEmpty(text))
        {
            return string.Empty;
        }

        var filtered = text.Where(c => (c >= '0' && c <= '9') || c == '-').ToArray();
        return new string(filtered);
    }

    public static string KeepLoginCharacters(string? text)
    {
        if (string.IsNullOrEmpty(text))
        {
            return string.Empty;
        }

        var filtered = text.Where(c => char.IsLetter(c) || (c >= '0' && c <= '9') || c == '@' || c == '.').ToArray();
        return new string(filtered);
    }
}
