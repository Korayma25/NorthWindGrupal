using System.Globalization;
using System.Resources;

namespace NorthWind.Sales.Frontend.Views.Resources;

public static class InvoiceMessages
{
    private static readonly ResourceManager ResourceManager = new(
        "NorthWind.Sales.Frontend.Views.Resources.InvoiceMessages",
        typeof(InvoiceMessages).Assembly);

    public static string InvoiceDetailTitle => GetString(nameof(InvoiceDetailTitle));
    public static string InvoiceSearchTitle => GetString(nameof(InvoiceSearchTitle));
    public static string InvoiceCreatedMessage => GetString(nameof(InvoiceCreatedMessage));
    public static string InvoiceCreatedSuccess => GetString(nameof(InvoiceCreatedSuccess));
    public static string ViewInvoicePdfButtonText => GetString(nameof(ViewInvoicePdfButtonText));
    public static string DownloadPdfButtonText => GetString(nameof(DownloadPdfButtonText));
    public static string PrintPdfButtonText => GetString(nameof(PrintPdfButtonText));
    public static string BackToListButtonText => GetString(nameof(BackToListButtonText));
    public static string InvoiceNumberLabel => GetString(nameof(InvoiceNumberLabel));
    public static string OrderDateLabel => GetString(nameof(OrderDateLabel));
    public static string CustomerLabel => GetString(nameof(CustomerLabel));
    public static string CustomerCardLabel => GetString(nameof(CustomerCardLabel));
    public static string CustomerEmailLabel => GetString(nameof(CustomerEmailLabel));
    public static string CustomerAddressLabel => GetString(nameof(CustomerAddressLabel));
    public static string CustomerCityLabel => GetString(nameof(CustomerCityLabel));
    public static string CustomerCountryLabel => GetString(nameof(CustomerCountryLabel));
    public static string SubtotalLabel => GetString(nameof(SubtotalLabel));
    public static string DiscountLabel => GetString(nameof(DiscountLabel));
    public static string TaxLabel => GetString(nameof(TaxLabel));
    public static string TotalLabel => GetString(nameof(TotalLabel));
    public static string ItemsHeader => GetString(nameof(ItemsHeader));
    public static string ProductCodeHeader => GetString(nameof(ProductCodeHeader));
    public static string ProductNameHeader => GetString(nameof(ProductNameHeader));
    public static string QuantityHeader => GetString(nameof(QuantityHeader));
    public static string UnitPriceHeader => GetString(nameof(UnitPriceHeader));
    public static string TaxRateHeader => GetString(nameof(TaxRateHeader));
    public static string LineSubtotalHeader => GetString(nameof(LineSubtotalHeader));
    public static string InvoiceNotFound => GetString(nameof(InvoiceNotFound));
    public static string LoadingInvoice => GetString(nameof(LoadingInvoice));
    public static string InvoicesMenuItemTitle => GetString(nameof(InvoicesMenuItemTitle));

    private static string GetString(string name) =>
        ResourceManager.GetString(name, CultureInfo.CurrentUICulture)!;
}
