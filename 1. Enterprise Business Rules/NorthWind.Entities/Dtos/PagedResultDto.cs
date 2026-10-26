namespace NorthWind.Entities.Dtos;

public class PagedResultDto<T>(
    IEnumerable<T> items,
    int page,
    int pageSize,
    int totalCount)
{
    public IEnumerable<T> Items => items;
    public int Page => page;
    public int PageSize => pageSize;
    public int TotalCount => totalCount;
    public int TotalPages => pageSize <= 0 ? 0 : (int)Math.Ceiling(totalCount / (double)pageSize);
}
