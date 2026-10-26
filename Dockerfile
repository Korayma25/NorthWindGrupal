FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

WORKDIR /src

COPY . .

RUN dotnet restore "4. Frameworks And Drivers/UI/NorthWind.Sales.WebApi/NorthWind.Sales.WebApi.csproj"

RUN dotnet publish "4. Frameworks And Drivers/UI/NorthWind.Sales.WebApi/NorthWind.Sales.WebApi.csproj" -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final

WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_ENVIRONMENT=Production

EXPOSE 10000

ENTRYPOINT ["sh", "-c", "dotnet NorthWind.Sales.WebApi.dll --urls http://0.0.0.0:${PORT:-10000}"]
