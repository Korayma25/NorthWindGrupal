namespace Microsoft.Extensions.DependencyInjection;

public static class UserServicesDependencyContainer
{
    public static IServiceCollection AddUserServices(this IServiceCollection services)
    {
        services.AddHttpContextAccessor();
        services.AddSingleton<IUserService, NorthWind.UserServices.UserService>();
        return services;
    }
}
