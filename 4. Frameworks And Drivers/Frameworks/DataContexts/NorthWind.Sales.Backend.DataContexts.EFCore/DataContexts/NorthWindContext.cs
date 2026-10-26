namespace NorthWind.Sales.Backend.DataContexts.EFCore.DataContexts;

internal class NorthWindContext : DbContext
{
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlServer(
            "Server=(localdb)\\mssqllocaldb;Database=NorthWindDB");
    }

    public DbSet<Order> Orders { get; set; } = null!;

    public DbSet<Repositories.Entities.OrderDetail> OrderDetails { get; set; } = null!;
    public DbSet<Repositories.Entities.Customer> Customers { get; set; } = null!;
    public DbSet<Repositories.Entities.Product> Products { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }
}
