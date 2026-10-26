using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using NorthWind.Membership.Backend.AspNetIdentity.Entities;
namespace NorthWind.Membership.Backend.AspNetIdentity.DataContexts;
internal class NorthWindMembershipContext(DbContextOptions<NorthWindMembershipContext> options) : IdentityDbContext<NorthWindUser>(options) { }
