namespace NorthWind.Membership.Frontend.RazorViews.Helpers;

public static class MembershipTextRules
{
    public static string KeepLetters(string? text)
    {
        if (string.IsNullOrEmpty(text))
        {
            return string.Empty;
        }

        var filtered = text.Where(c => char.IsLetter(c) || char.IsWhiteSpace(c)).ToArray();
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
