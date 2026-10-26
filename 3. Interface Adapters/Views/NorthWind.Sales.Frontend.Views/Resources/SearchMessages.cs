using System.Globalization;
using System.Resources;

namespace NorthWind.Sales.Frontend.Views.Resources;

public static class SearchMessages
{
    private static readonly ResourceManager ResourceManager = new(
        "NorthWind.Sales.Frontend.Views.Resources.SearchMessages",
        typeof(SearchMessages).Assembly);

    public static string SearchCustomersTitle => GetString(nameof(SearchCustomersTitle));
    public static string SearchProductsTitle => GetString(nameof(SearchProductsTitle));
    public static string SearchInvoicesTitle => GetString(nameof(SearchInvoicesTitle));
    public static string FilterNameLabel => GetString(nameof(FilterNameLabel));
    public static string FilterIdentityCardLabel => GetString(nameof(FilterIdentityCardLabel));
    public static string FilterCodeLabel => GetString(nameof(FilterCodeLabel));
    public static string FilterInvoiceNumberLabel => GetString(nameof(FilterInvoiceNumberLabel));
    public static string FilterCustomerNameLabel => GetString(nameof(FilterCustomerNameLabel));
    public static string CustomerIdHeader => GetString(nameof(CustomerIdHeader));
    public static string CustomerNameHeader => GetString(nameof(CustomerNameHeader));
    public static string CustomerIdentityCardHeader => GetString(nameof(CustomerIdentityCardHeader));
    public static string CustomerEmailHeader => GetString(nameof(CustomerEmailHeader));
    public static string CustomerCityHeader => GetString(nameof(CustomerCityHeader));
    public static string CustomerBalanceHeader => GetString(nameof(CustomerBalanceHeader));
    public static string ProductCodeHeader => GetString(nameof(ProductCodeHeader));
    public static string ProductNameHeader => GetString(nameof(ProductNameHeader));
    public static string ProductPriceHeader => GetString(nameof(ProductPriceHeader));
    public static string ProductStockHeader => GetString(nameof(ProductStockHeader));
    public static string ProductTaxRateHeader => GetString(nameof(ProductTaxRateHeader));
    public static string InvoiceNumberHeader => GetString(nameof(InvoiceNumberHeader));
    public static string InvoiceDateHeader => GetString(nameof(InvoiceDateHeader));
    public static string InvoiceCustomerHeader => GetString(nameof(InvoiceCustomerHeader));
    public static string InvoiceTotalHeader => GetString(nameof(InvoiceTotalHeader));
    public static string ActionsHeader => GetString(nameof(ActionsHeader));
    public static string NoResultsMessage => GetString(nameof(NoResultsMessage));
    public static string SearchButtonText => GetString(nameof(SearchButtonText));
    public static string CloseButtonText => GetString(nameof(CloseButtonText));
    public static string SelectButtonText => GetString(nameof(SelectButtonText));
    public static string LoadingMessage => GetString(nameof(LoadingMessage));

    private static string GetString(string name) =>
        ResourceManager.GetString(name, CultureInfo.CurrentUICulture)!;
}
