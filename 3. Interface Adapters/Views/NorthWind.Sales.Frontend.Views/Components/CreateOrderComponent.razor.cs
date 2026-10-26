using Microsoft.AspNetCore.Components;

namespace NorthWind.Sales.Frontend.Views.Components;

public partial class CreateOrderComponent
{
    [Parameter]
    public CreateOrderViewModel Order { get; set; } = null!;
}
