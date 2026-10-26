using System.Globalization;
using System.Resources;

namespace NorthWind.Sales.Frontend.Views.Resources;

public static class CreateOrderMessages
{
    private static readonly ResourceManager ResourceManager = new(
        "NorthWind.Sales.Frontend.Views.Resources.CreateOrderMessages",
        typeof(CreateOrderMessages).Assembly);

    public static string CustomerIdLabel => GetString(nameof(CustomerIdLabel));
    public static string CustomerLabel => GetString(nameof(CustomerLabel));
    public static string CustomerCardLabel => GetString(nameof(CustomerCardLabel));
    public static string CustomerNameLabel => GetString(nameof(CustomerNameLabel));
    public static string ShipAddressLabel => GetString(nameof(ShipAddressLabel));
    public static string ShipCityLabel => GetString(nameof(ShipCityLabel));
    public static string ShipCountryLabel => GetString(nameof(ShipCountryLabel));
    public static string ShipPostalCodeLabel => GetString(nameof(ShipPostalCodeLabel));
    public static string ProductIdLabel => GetString(nameof(ProductIdLabel));
    public static string ProductLabel => GetString(nameof(ProductLabel));
    public static string ProductCodeLabel => GetString(nameof(ProductCodeLabel));
    public static string ProductNameLabel => GetString(nameof(ProductNameLabel));
    public static string UnitPriceLabel => GetString(nameof(UnitPriceLabel));
    public static string QuantityLabel => GetString(nameof(QuantityLabel));
    public static string UnitsInStockLabel => GetString(nameof(UnitsInStockLabel));
    public static string SubtotalLabel => GetString(nameof(SubtotalLabel));
    public static string TaxRateLabel => GetString(nameof(TaxRateLabel));
    public static string TaxAmountLabel => GetString(nameof(TaxAmountLabel));
    public static string DiscountLabel => GetString(nameof(DiscountLabel));
    public static string DiscountAmountLabel => GetString(nameof(DiscountAmountLabel));
    public static string TotalLabel => GetString(nameof(TotalLabel));
    public static string SearchCustomerButtonText => GetString(nameof(SearchCustomerButtonText));
    public static string AddProductButtonText => GetString(nameof(AddProductButtonText));
    public static string ChangeCustomerButtonText => GetString(nameof(ChangeCustomerButtonText));
    public static string RemoveProductButtonText => GetString(nameof(RemoveProductButtonText));
    public static string RemoveProductTitle => GetString(nameof(RemoveProductTitle));
    public static string RemoveProductConfirmation => GetString(nameof(RemoveProductConfirmation));
    public static string RemoveProductConfirmButton => GetString(nameof(RemoveProductConfirmButton));
    public static string CancelButton => GetString(nameof(CancelButton));
    public static string SaveOrderButtonText => GetString(nameof(SaveOrderButtonText));
    public static string SendButtonText => GetString(nameof(SendButtonText));
    public static string CreatedOrderTemplate => GetString(nameof(CreatedOrderTemplate));
    public static string CreateOrderMenuItemTitle => GetString(nameof(CreateOrderMenuItemTitle));
    public static string CreateOrderPageTitle => GetString(nameof(CreateOrderPageTitle));
    public static string DuplicateProductError => GetString(nameof(DuplicateProductError));
    public static string QuantityExceedsStockError => GetString(nameof(QuantityExceedsStockError));
    public static string CustomerRequiredError => GetString(nameof(CustomerRequiredError));
    public static string OrderDetailsRequiredError => GetString(nameof(OrderDetailsRequiredError));
    public static string OrderCreatedSuccessTemplate => GetString(nameof(OrderCreatedSuccessTemplate));

    private static string GetString(string name) =>
        ResourceManager.GetString(name, CultureInfo.CurrentUICulture)!;
}
