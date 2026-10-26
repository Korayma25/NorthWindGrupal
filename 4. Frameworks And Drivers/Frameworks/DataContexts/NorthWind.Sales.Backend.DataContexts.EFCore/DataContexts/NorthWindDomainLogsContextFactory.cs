namespace NorthWind.Sales.Backend.DataContexts.EFCore.DataContexts;

public class NorthWindDomainLogsContextFactory
    : IDesignTimeDbContextFactory<NorthWindDomainLogsContext>
{
    public NorthWindDomainLogsContext CreateDbContext(string[] args)
    {
        var dbOptions = Microsoft.Extensions.Options.Options.Create(new DBOptions
        {
            DomainLogsConnectionString =
                "Server=(localdb)\\mssqllocaldb;Database=NorthWindLogsDB"
        });
        return new NorthWindDomainLogsContext(dbOptions);
    }
}
