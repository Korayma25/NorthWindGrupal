namespace NorthWind.Sales.Backend.DataContexts.EFCore.DataContexts;

internal class NorthWindSalesContext(IOptions<DBOptions> dbOptions) : DbContext
{
    public DbSet<Order> Orders { get; set; } = null!;

    public DbSet<Repositories.Entities.OrderDetail> OrderDetails { get; set; } = null!;
    public DbSet<Repositories.Entities.Customer> Customers { get; set; } = null!;
    public DbSet<Repositories.Entities.Product> Products { get; set; } = null!;

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlServer(dbOptions.Value.ConnectionString);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }
}
