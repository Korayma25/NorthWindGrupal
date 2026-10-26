namespace NorthWind.Sales.Validators.Entities.Helpers;

public static class EcuadorianIdentityCard
{
    public static bool IsValid(string? id)
    {
        if (string.IsNullOrWhiteSpace(id) || id.Length != 10 || !id.All(char.IsAsciiDigit))
            return false;

        var province = int.Parse(id[..2]);
        if (!((province >= 1 && province <= 24) || province == 30))
            return false;

        var thirdDigit = id[2] - '0';
        if (thirdDigit > 5)
            return false;

        int[] coefficients = [2, 1, 2, 1, 2, 1, 2, 1, 2];
        var sum = 0;
        for (var i = 0; i < 9; i++)
        {
            var product = (id[i] - '0') * coefficients[i];
            if (product > 9)
                product -= 9;
            sum += product;
        }

        var verifier = (10 - sum % 10) % 10;
        return verifier == (id[9] - '0');
    }
}
