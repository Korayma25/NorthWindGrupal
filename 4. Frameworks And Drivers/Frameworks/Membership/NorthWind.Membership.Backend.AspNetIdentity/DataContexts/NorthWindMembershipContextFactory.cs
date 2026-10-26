using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
namespace NorthWind.Membership.Backend.AspNetIdentity.DataContexts;
internal class NorthWindMembershipContextFactory : IDesignTimeDbContextFactory<NorthWindMembershipContext> { public NorthWindMembershipContext CreateDbContext(string[] args) { var builder=new DbContextOptionsBuilder<NorthWindMembershipContext>(); builder.UseSqlServer("Server=(localdb)\\mssqllocaldb;Database=NorthWindUsersDB;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"); return new(builder.Options); } }
