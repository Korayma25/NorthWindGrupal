namespace NorthWind.Sales.Backend.DataContexts.EFCore.Configurations;

internal class ProductConfiguration : IEntityTypeConfiguration<NorthWind.Sales.Backend.Repositories.Entities.Product>
{
    public void Configure(EntityTypeBuilder<NorthWind.Sales.Backend.Repositories.Entities.Product> builder)
    {
        builder.ToTable(t => t.HasCheckConstraint("CK_Products_UnitsInStock", "[UnitsInStock] >= 0"));

        builder.Property(p => p.Name).IsRequired().HasMaxLength(40);
        builder.Property(p => p.UnitPrice).HasPrecision(8, 2);

        builder.Property(p => p.Code).IsRequired().HasMaxLength(20);
        builder.HasIndex(p => p.Code).IsUnique();

        builder.Property(p => p.TaxRate).HasPrecision(4, 2);
    }
}
