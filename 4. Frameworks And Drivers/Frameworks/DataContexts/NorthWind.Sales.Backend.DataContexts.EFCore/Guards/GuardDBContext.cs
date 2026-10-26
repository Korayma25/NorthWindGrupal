namespace NorthWind.Sales.Backend.DataContexts.EFCore.Guards;

internal static class GuardDBContext
{
    public static async Task AgainstSaveChangesErrorAsync(DbContext context)
    {
        try { await context.SaveChangesAsync(); }
        catch (DbUpdateException exception)
        {
            throw new UpdateException(exception, exception.Entries.Select(entry => entry.Entity.GetType().Name));
        }
    }
}
