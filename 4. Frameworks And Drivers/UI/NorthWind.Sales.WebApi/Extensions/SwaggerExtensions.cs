using Microsoft.OpenApi;

namespace Microsoft.Extensions.DependencyInjection;

public static class SwaggerExtensions
{
    public static IServiceCollection AddSwaggerGenBearer(this IServiceCollection services)
    {
        services.AddSwaggerGen(options =>
        {
            options.AddSecurityDefinition("BearerToken", new OpenApiSecurityScheme
            {
                Name = "Authorization",
                Description = "Proporciona el valor del token.",
                In = ParameterLocation.Header,
                Type = SecuritySchemeType.Http,
                Scheme = "Bearer"
            });
            options.AddSecurityRequirement(document => new OpenApiSecurityRequirement
            {
                [new OpenApiSecuritySchemeReference("BearerToken", document)] = new List<string>()
            });
        });
        return services;
    }
}
