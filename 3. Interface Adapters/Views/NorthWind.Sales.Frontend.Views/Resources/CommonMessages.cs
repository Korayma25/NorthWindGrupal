using System.Globalization;
using System.Resources;

namespace NorthWind.Sales.Frontend.Views.Resources;

public static class CommonMessages
{
    private static readonly ResourceManager ResourceManager = new(
        "NorthWind.Sales.Frontend.Views.Resources.CommonMessages",
        typeof(CommonMessages).Assembly);

    public static string OK => GetString(nameof(OK));
    public static string NavBarBrandTitle => GetString(nameof(NavBarBrandTitle));
    public static string HomeMenuItemTitle => GetString(nameof(HomeMenuItemTitle));
    public static string AboutTitle => GetString(nameof(AboutTitle));

    private static string GetString(string name) =>
        ResourceManager.GetString(name, CultureInfo.CurrentUICulture)!;
}
