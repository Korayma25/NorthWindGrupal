namespace NorthWind.Sales.Frontend.Views.ViewModels.CreateOrder;

public class CreateOrderViewModel(ICreateOrderGateway gateway, IModelValidatorHub<CreateOrderViewModel> validator)
{
    public IModelValidatorHub<CreateOrderViewModel> Validator => validator;
    public ModelValidator<CreateOrderViewModel>? ModelValidatorComponentReference { get; set; }

    public string CustomerId { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerIdentityCard { get; set; } = string.Empty;
    public string ShipAddress { get; set; } = string.Empty;
    public string ShipCity { get; set; } = string.Empty;
    public string ShipCountry { get; set; } = string.Empty;
    public string ShipPostalCode { get; set; } = string.Empty;

    public List<CreateOrderDetailViewModel> OrderDetails { get; set; } = [];
    public string InformationMessage { get; private set; } = string.Empty;
    public string ErrorMessage { get; set; } = string.Empty;
    public int? CreatedOrderId { get; private set; }

    public decimal Subtotal => Math.Round(OrderDetails.Sum(d => d.UnitPrice * d.Quantity), 2, MidpointRounding.AwayFromZero);
    public decimal DiscountAmount => 0m;
    public decimal TaxAmount => Subtotal == 0m ? 0m : Math.Round(OrderDetails.Sum(d => (d.UnitPrice * d.Quantity) * (1m - (Subtotal == 0m ? 0m : (DiscountAmount / Subtotal))) * d.TaxRate), 2, MidpointRounding.AwayFromZero);
    public decimal Total => Math.Round(Subtotal - DiscountAmount + TaxAmount, 2, MidpointRounding.AwayFromZero);

    public void SelectCustomer(CustomerLookupDto customer)
    {
        CustomerId = customer.Id;
        CustomerName = customer.Name;
        CustomerIdentityCard = customer.IdentityCard;
        ShipAddress = customer.Address;
        ShipCity = customer.City;
        ShipCountry = customer.Country;
        ShipPostalCode = customer.PostalCode;
        ErrorMessage = string.Empty;
    }

    public bool AddProduct(ProductLookupDto product)
    {
        ErrorMessage = string.Empty;
        if (OrderDetails.Any(d => d.ProductId == product.Id))
        {
            ErrorMessage = CreateOrderMessages.DuplicateProductError;
            return false;
        }

        OrderDetails.Add(new CreateOrderDetailViewModel
        {
            ProductId = product.Id,
            ProductCode = product.Code,
            ProductName = product.Name,
            UnitPrice = product.UnitPrice,
            UnitsInStock = product.UnitsInStock,
            TaxRate = product.TaxRate,
            Quantity = 1
        });
        return true;
    }

    public void RemoveDetail(CreateOrderDetailViewModel item)
    {
        OrderDetails.Remove(item);
    }

    public bool ReplaceProduct(CreateOrderDetailViewModel item, ProductLookupDto product)
    {
        ErrorMessage = string.Empty;
        if (OrderDetails.Any(d => d != item && d.ProductId == product.Id))
        {
            ErrorMessage = CreateOrderMessages.DuplicateProductError;
            return false;
        }

        item.ProductId = product.Id;
        item.ProductCode = product.Code;
        item.ProductName = product.Name;
        item.UnitPrice = product.UnitPrice;
        item.UnitsInStock = product.UnitsInStock;
        item.TaxRate = product.TaxRate;

        var newQuantity = item.Quantity;
        if (product.UnitsInStock > 0 && newQuantity > product.UnitsInStock)
        {
            newQuantity = product.UnitsInStock;
        }
        if (newQuantity < 1)
        {
            newQuantity = 1;
        }
        item.Quantity = (short)newQuantity;
        return true;
    }

    public void Reset()
    {
        CustomerId = string.Empty;
        CustomerName = string.Empty;
        CustomerIdentityCard = string.Empty;
        ShipAddress = string.Empty;
        ShipCity = string.Empty;
        ShipCountry = string.Empty;
        ShipPostalCode = string.Empty;
        OrderDetails.Clear();
        ErrorMessage = string.Empty;
    }

    public async Task Send()
    {
        InformationMessage = string.Empty;
        ErrorMessage = string.Empty;
        CreatedOrderId = null;
        try
        {
            var orderId = await gateway.CreateOrderAsync((CreateOrderDto)this);
            CreatedOrderId = orderId;
            InformationMessage = string.Format(CreateOrderMessages.CreatedOrderTemplate, orderId);
            Reset();
        }
        catch (HttpRequestException exception)
        {
            if (exception.Data["Errors"] is IEnumerable<ValidationError> errors)
                ModelValidatorComponentReference?.AddErrors(errors);
            else
                throw;
        }
    }

    public static explicit operator CreateOrderDto(CreateOrderViewModel model) =>
        new(model.CustomerId, model.ShipAddress, model.ShipCity, model.ShipCountry, model.ShipPostalCode,
            model.OrderDetails.Select(detail => new CreateOrderDetailDto(detail.ProductId, detail.UnitPrice, detail.Quantity)));
}
