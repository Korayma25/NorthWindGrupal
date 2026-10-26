namespace NorthWind.Sales.Backend.DataContexts.EFCore.Configurations;

internal class CustomerConfiguration : IEntityTypeConfiguration<NorthWind.Sales.Backend.Repositories.Entities.Customer>
{
    public void Configure(EntityTypeBuilder<NorthWind.Sales.Backend.Repositories.Entities.Customer> builder)
    {
        builder.Property(c => c.Id).HasMaxLength(5).IsFixedLength();
        builder.Property(c => c.Name).IsRequired().HasMaxLength(40);
        builder.Property(c => c.CurrentBalance).HasPrecision(8, 2);

        builder.Property(c => c.IdentityCard).IsRequired().HasMaxLength(10);
        builder.HasIndex(c => c.IdentityCard).IsUnique();

        builder.Property(c => c.Email).HasMaxLength(100);
        builder.Property(c => c.Address).HasMaxLength(60);
        builder.Property(c => c.City).HasMaxLength(15);
        builder.Property(c => c.Country).HasMaxLength(15);
        builder.Property(c => c.PostalCode).HasMaxLength(10);
    }
}
