namespace NorthWind.Sales.Backend.DataContexts.EFCore.Configurations;

internal class OrderDetailConfiguration
    : IEntityTypeConfiguration<Repositories.Entities.OrderDetail>
{
    public void Configure(
        EntityTypeBuilder<Repositories.Entities.OrderDetail> builder)
    {
        builder.HasKey(detail => new { detail.OrderId, detail.ProductId });
        builder.Property(detail => detail.UnitPrice).HasPrecision(8, 2);
        builder.Property(detail => detail.TaxRate).HasPrecision(4, 2);
        builder.HasOne<Repositories.Entities.Product>()
            .WithMany()
            .HasForeignKey(detail => detail.ProductId);
    }
}
