using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using NorthWind.Membership.Backend.AspNetIdentity.DataContexts;
using NorthWind.Membership.Backend.AspNetIdentity.Entities;
using NorthWind.Membership.Backend.AspNetIdentity.Options;
using NorthWind.Membership.Backend.AspNetIdentity.Services;
using NorthWind.Membership.Backend.Core.Interfaces.Common;
namespace Microsoft.Extensions.DependencyInjection;
public static class MembershipIdentityDependencyContainer { public static IServiceCollection AddMembershipIdentityServices(this IServiceCollection services,Action<MembershipDBOptions> configure) { services.Configure(configure); services.AddDbContext<NorthWindMembershipContext>((provider,options)=>options.UseSqlServer(provider.GetRequiredService<Microsoft.Extensions.Options.IOptions<MembershipDBOptions>>().Value.ConnectionString)); services.AddIdentityCore<NorthWindUser>(options=>{options.User.RequireUniqueEmail=true;options.Password.RequiredLength=6;options.Password.RequireLowercase=true;options.Password.RequireUppercase=true;options.Password.RequireDigit=true;options.Password.RequireNonAlphanumeric=true;}).AddEntityFrameworkStores<NorthWindMembershipContext>(); services.AddScoped<IMembershipService,MembershipService>(); return services; } }
