using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;

namespace NorthWind.Sales.Frontend.Views.Pages;

public partial class CreateOrder
{
    [Inject]
    public CreateOrderViewModel ViewModel { get; set; } = null!;

    private ErrorBoundary ErrorBoundaryRef = null!;

    private void Recover()
    {
        ErrorBoundaryRef?.Recover();
    }
}
