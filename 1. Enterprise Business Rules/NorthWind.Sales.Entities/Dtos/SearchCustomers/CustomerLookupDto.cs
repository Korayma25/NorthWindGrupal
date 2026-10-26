namespace NorthWind.Sales.Entities.Dtos.SearchCustomers;

public class CustomerLookupDto(
    string id,
    string name,
    string identityCard,
    string email,
    string address,
    string city,
    string country,
    string postalCode,
    decimal currentBalance)
{
    public string Id => id;
    public string Name => name;
    public string IdentityCard => identityCard;
    public string Email => email;
    public string Address => address;
    public string City => city;
    public string Country => country;
    public string PostalCode => postalCode;
    public decimal CurrentBalance => currentBalance;
}
