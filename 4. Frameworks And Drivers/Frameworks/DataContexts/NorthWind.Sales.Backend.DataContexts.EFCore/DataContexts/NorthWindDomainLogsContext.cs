namespace NorthWind.Sales.Backend.DataContexts.EFCore.DataContexts;

public class NorthWindDomainLogsContext(IOptions<DBOptions> dbOptions)
    : DbContext
{
    public DbSet<Repositories.Entities.DomainLog> DomainLogs { get; set; } = null!;

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlServer(dbOptions.Value.DomainLogsConnectionString);
    }
}
