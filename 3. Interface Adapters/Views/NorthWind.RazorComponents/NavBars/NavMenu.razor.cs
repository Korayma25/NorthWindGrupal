using Microsoft.AspNetCore.Components;

namespace NorthWind.RazorComponents.NavBars;

public partial class NavMenu
{
    [Parameter]
    public RenderFragment NavBarBrand { get; set; } = null!;

    [Parameter]
    public RenderFragment NavBarItems { get; set; } = null!;

    private bool CollapseNavMenu = true;

    private string NavMenuCssClass => CollapseNavMenu ? "collapse" : string.Empty;

    private void ToggleNavMenu()
    {
        CollapseNavMenu = !CollapseNavMenu;
    }
}
