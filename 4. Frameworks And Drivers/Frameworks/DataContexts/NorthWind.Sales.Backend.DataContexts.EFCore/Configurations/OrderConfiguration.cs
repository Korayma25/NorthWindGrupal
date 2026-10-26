namespace NorthWind.Sales.Backend.DataContexts.EFCore.Configurations;

internal class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.Property(order => order.CustomerId)
            .IsRequired()
            .HasMaxLength(5)
            .IsFixedLength();

        builder.Property(order => order.ShipAddress)
            .IsRequired()
            .HasMaxLength(60);

        builder.Property(order => order.ShipCity)
            .HasMaxLength(15);

        builder.Property(order => order.ShipCountry)
            .HasMaxLength(15);

        builder.Property(order => order.ShipPostalCode)
            .HasMaxLength(10);

        builder.Property(o => o.InvoiceNumber)
            .HasMaxLength(17)
            .HasComputedColumnSql("'001-001-' + RIGHT('000000000' + CONVERT(varchar(9), [Id]), 9)", stored: true);

        builder.HasIndex(o => o.InvoiceNumber)
            .IsUnique();

        builder.Property(o => o.Subtotal)
            .HasPrecision(10, 2);

        builder.Property(o => o.DiscountAmount)
            .HasPrecision(10, 2);

        builder.Property(o => o.TaxAmount)
            .HasPrecision(10, 2);

        builder.Property(o => o.Total)
            .HasPrecision(10, 2);

        builder.HasOne<Repositories.Entities.Customer>()
            .WithMany()
            .HasForeignKey(order => order.CustomerId);
    }
}
