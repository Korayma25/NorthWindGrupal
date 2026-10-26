internal static class Startup
{
    public static WebApplication CreateWebApplication(
        this WebApplicationBuilder builder)
    {
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGenBearer();
        builder.Services.AddNorthWindSalesServices(
            dbOptions => builder.Configuration.GetSection(DBOptions.SectionKey).Bind(dbOptions),
            smtpOptions => builder.Configuration.GetSection(SmtpOptions.SectionKey).Bind(smtpOptions),
            membershipOptions => builder.Configuration.GetSection(NorthWind.Membership.Backend.AspNetIdentity.Options.MembershipDBOptions.SectionKey).Bind(membershipOptions),
            jwtOptions => builder.Configuration.GetSection(NorthWind.Membership.Backend.Core.Options.JwtOptions.SectionKey).Bind(jwtOptions));
        builder.Services.AddAuthentication(Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                var jwtSection = builder.Configuration.GetSection(
                    NorthWind.Membership.Backend.Core.Options.JwtOptions.SectionKey);
                jwtSection.Bind(options.TokenValidationParameters);
                var securityKey = jwtSection[nameof(NorthWind.Membership.Backend.Core.Options.JwtOptions.SecurityKey)]!;
                options.TokenValidationParameters.IssuerSigningKey =
                    new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(
                        System.Text.Encoding.UTF8.GetBytes(securityKey));
            });
        builder.Services.AddAuthorization();

        builder.Services.AddCors(options =>
        {
            options.AddDefaultPolicy(config =>
            {
                config.AllowAnyMethod();
                config.AllowAnyHeader();
                config.AllowAnyOrigin();
            });
        });

        return builder.Build();
    }

    public static WebApplication ConfigureWebApplication(
        this WebApplication app)
    {
        app.UseExceptionHandler(builder => { });
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseCors();
        app.UseAuthentication();
        app.UseAuthorization();
        app.MapNorthWindSalesEndpoints();
        return app;
    }
}
