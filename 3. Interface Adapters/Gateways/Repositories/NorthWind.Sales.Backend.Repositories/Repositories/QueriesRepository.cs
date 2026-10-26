namespace NorthWind.Sales.Backend.Repositories.Repositories;

internal class QueriesRepository(INorthWindSalesQueriesDataContext context) : IQueriesRepository
{
    public async Task<decimal?> GetCustomerCurrentBalance(string customerId)
    {
        var queryable = context.Customers.Where(c => c.Id == customerId).Select(c => new { c.CurrentBalance });
        var result = await context.FirstOrDefaultAync(queryable);
        return result?.CurrentBalance;
    }

    public async Task<IEnumerable<ProductUnitsInStock>> GetProductsUnitsInStock(IEnumerable<int> productIds)
    {
        var queryable = context.Products.Where(p => productIds.Contains(p.Id)).Select(p => new ProductUnitsInStock(p.Id, p.UnitsInStock));
        return await context.ToListAsync(queryable);
    }

    public async Task<PagedResultDto<ProductLookupDto>> SearchProductsInStock(SearchProductsDto searchDto)
    {
        var query = context.Products.Where(p => p.UnitsInStock > 0);
        if (!string.IsNullOrWhiteSpace(searchDto.Name))
        {
            query = query.Where(p => p.Name.Contains(searchDto.Name));
        }
        if (!string.IsNullOrWhiteSpace(searchDto.Code))
        {
            query = query.Where(p => p.Code.StartsWith(searchDto.Code));
        }

        var total = await context.CountAsync(query);

        var pagedQuery = query
            .OrderBy(p => p.Name)
            .ThenBy(p => p.Id)
            .Skip((searchDto.Page - 1) * searchDto.PageSize)
            .Take(searchDto.PageSize)
            .Select(p => new ProductLookupDto(p.Id, p.Code, p.Name, p.UnitPrice, p.UnitsInStock, p.TaxRate));

        var items = await context.ToListAsync(pagedQuery);
        return new PagedResultDto<ProductLookupDto>(items, searchDto.Page, searchDto.PageSize, total);
    }

    public async Task<PagedResultDto<CustomerLookupDto>> SearchCustomers(SearchCustomersDto searchDto)
    {
        var query = context.Customers.AsQueryable();
        if (!string.IsNullOrWhiteSpace(searchDto.Name))
        {
            query = query.Where(c => c.Name.Contains(searchDto.Name));
        }
        if (!string.IsNullOrWhiteSpace(searchDto.IdentityCard))
        {
            query = query.Where(c => c.IdentityCard.StartsWith(searchDto.IdentityCard));
        }

        var total = await context.CountAsync(query);

        var pagedQuery = query
            .OrderBy(c => c.Name)
            .ThenBy(c => c.Id)
            .Skip((searchDto.Page - 1) * searchDto.PageSize)
            .Take(searchDto.PageSize)
            .Select(c => new CustomerLookupDto(c.Id, c.Name, c.IdentityCard, c.Email, c.Address, c.City, c.Country, c.PostalCode, c.CurrentBalance));

        var items = await context.ToListAsync(pagedQuery);
        return new PagedResultDto<CustomerLookupDto>(items, searchDto.Page, searchDto.PageSize, total);
    }

    public async Task<PagedResultDto<InvoiceSummaryDto>> SearchInvoices(SearchInvoicesDto searchDto)
    {
        var query = from order in context.Orders
                    join customer in context.Customers on order.CustomerId equals customer.Id
                    select new { order, customer };

        if (!string.IsNullOrWhiteSpace(searchDto.InvoiceNumber))
        {
            query = query.Where(x => x.order.InvoiceNumber.Contains(searchDto.InvoiceNumber));
        }
        if (!string.IsNullOrWhiteSpace(searchDto.CustomerName))
        {
            query = query.Where(x => x.customer.Name.Contains(searchDto.CustomerName));
        }

        var total = await context.CountAsync(query);

        var pagedQuery = query
            .OrderByDescending(x => x.order.OrderDate)
            .ThenByDescending(x => x.order.Id)
            .Skip((searchDto.Page - 1) * searchDto.PageSize)
            .Take(searchDto.PageSize)
            .Select(x => new InvoiceSummaryDto(
                x.order.Id,
                x.order.InvoiceNumber,
                x.order.OrderDate,
                x.customer.Name,
                x.customer.IdentityCard,
                x.order.Total));

        var items = await context.ToListAsync(pagedQuery);
        return new PagedResultDto<InvoiceSummaryDto>(items, searchDto.Page, searchDto.PageSize, total);
    }

    public async Task<InvoiceDto?> GetInvoice(int id)
    {
        var orderQuery = from order in context.Orders
                         join customer in context.Customers on order.CustomerId equals customer.Id
                         where order.Id == id
                         select new { order, customer };

        var orderData = await context.FirstOrDefaultAync(orderQuery);
        if (orderData is null)
            return null;

        var detailsQuery = from detail in context.OrderDetails
                           join product in context.Products on detail.ProductId equals product.Id
                           where detail.OrderId == id
                           select new
                           {
                               detail.ProductId,
                               product.Code,
                               product.Name,
                               detail.UnitPrice,
                               detail.Quantity,
                               detail.TaxRate
                           };

        var details = await context.ToListAsync(detailsQuery);
        var lines = details.Select(d => new InvoiceLineDto(
            d.ProductId,
            d.Code,
            d.Name,
            d.UnitPrice,
            d.Quantity,
            d.TaxRate,
            d.UnitPrice * d.Quantity));

        return new InvoiceDto(
            orderData.order.Id,
            orderData.order.InvoiceNumber,
            orderData.order.OrderDate,
            orderData.customer.Id,
            orderData.customer.Name,
            orderData.customer.IdentityCard,
            orderData.customer.Email,
            orderData.customer.Address,
            orderData.customer.City,
            orderData.customer.Country,
            orderData.customer.PostalCode,
            orderData.order.Subtotal,
            orderData.order.DiscountAmount,
            orderData.order.TaxAmount,
            orderData.order.Total,
            lines);
    }

    public async Task<IEnumerable<ProductPricing>> GetProductsPricing(IEnumerable<int> productIds)
    {
        var query = context.Products
            .Where(p => productIds.Contains(p.Id))
            .Select(p => new ProductPricing(p.Id, p.UnitPrice, p.TaxRate));

        return await context.ToListAsync(query);
    }
}
