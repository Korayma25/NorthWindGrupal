namespace NorthWind.Sales.Backend.UseCases.Resources;

internal static class CreateOrderMessages
{
    public const string CustomerIdNotFoundError = "El identificador de cliente proporcionado no existe.";
    public const string CustomerWithBalanceErrorTemplate = "El cliente {0} tiene un adeudo pendiente de {1}.";
    public const string ProductIdNotFoundErrorTemplate = "El producto {0} no existe.";
    public const string UnitsInStockLessThanQuantityErrorTemplate = "Cantidad {0} de {1} no suficiente para producto {2}.";
    public const string SendEmailSubject = "Orden especial creada";
    public const string SendEmailBodyTemplate = "Se ha creado la orden {0} con {1} productos.";
    public const string StartingPurchaseOrderCreation = "Inicio de creación de orden de compra";
    public const string PurchaseOrderCreatedTemplate = "Orden de compra {0} creada.";
    public const string OrderCreationCancelledTemplate = "Creación de orden {0} cancelada.";
}
