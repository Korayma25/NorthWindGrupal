using System.Globalization;
using System.Resources;

namespace NorthWind.Sales.Frontend.Views.Resources;

public static class HomeMessages
{
    private static readonly ResourceManager ResourceManager = new(
        "NorthWind.Sales.Frontend.Views.Resources.HomeMessages",
        typeof(HomeMessages).Assembly);

    public static string PageTitle => GetString(nameof(PageTitle));
    public static string AppTitle => GetString(nameof(AppTitle));
    public static string AppSubtitle => GetString(nameof(AppSubtitle));
    public static string CreateOrderCardTitle => GetString(nameof(CreateOrderCardTitle));
    public static string CreateOrderCardDescription => GetString(nameof(CreateOrderCardDescription));
    public static string InvoicesCardTitle => GetString(nameof(InvoicesCardTitle));
    public static string InvoicesCardDescription => GetString(nameof(InvoicesCardDescription));
    public static string OpenButton => GetString(nameof(OpenButton));
    public static string WelcomeMessage => GetString(nameof(WelcomeMessage));

    private static string GetString(string name) =>
        ResourceManager.GetString(name, CultureInfo.CurrentUICulture)!;
}
