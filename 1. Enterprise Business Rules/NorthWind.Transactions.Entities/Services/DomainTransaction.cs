namespace NorthWind.Transactions.Entities.Services;

internal class DomainTransaction : IDomainTransaction, IDisposable
{
    private TransactionScope? transactionScope;

    public void BeginTransaction()
    {
        transactionScope = new TransactionScope(
            TransactionScopeOption.Required,
            new TransactionOptions
            {
                IsolationLevel = IsolationLevel.ReadCommitted
            },
            TransactionScopeAsyncFlowOption.Enabled);
    }

    public void CommitTransaction()
    {
        transactionScope?.Complete();
        Dispose();
    }

    public void RollbackTransaction() => Dispose();

    public void Dispose()
    {
        transactionScope?.Dispose();
        transactionScope = null;
    }
}
