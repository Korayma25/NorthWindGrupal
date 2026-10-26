namespace NorthWind.Sales.Backend.PdfGateways.Services;

internal class QuestPdfInvoiceGenerator : IInvoicePdfGenerator
{
    static QuestPdfInvoiceGenerator()
    {
        QuestPDF.Settings.License = LicenseType.Community;
    }

    public byte[] Generate(InvoiceDto invoice)
    {
        var culture = new CultureInfo("es-EC");

        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(1.5f, Unit.Centimetre);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(x => x.FontSize(10).FontColor(Colors.Grey.Darken3));

                page.Header().Column(col =>
                {
                    col.Item().Row(row =>
                    {
                        row.RelativeItem().Column(titleCol =>
                        {
                            titleCol.Item().Text("FACTURA").FontSize(22).Bold().FontColor(Colors.Blue.Darken2);
                            titleCol.Item().Text($"Nº: {invoice.InvoiceNumber}").FontSize(12).SemiBold();
                            titleCol.Item().Text($"Fecha: {invoice.OrderDate:dd/MM/yyyy HH:mm}").FontSize(10);
                        });

                        row.RelativeItem().AlignRight().Column(companyCol =>
                        {
                            companyCol.Item().Text("NORTHWIND POS").FontSize(16).Bold().FontColor(Colors.Grey.Darken2);
                            companyCol.Item().Text("RUC: 1790011223001").FontSize(9);
                            companyCol.Item().Text("Matriz: Quito - Ecuador").FontSize(9);
                        });
                    });

                    col.Item().PaddingVertical(10).LineHorizontal(1).LineColor(Colors.Grey.Lighten2);

                    col.Item().Background(Colors.Grey.Lighten4).Padding(10).Row(row =>
                    {
                        row.RelativeItem().Column(custCol =>
                        {
                            custCol.Item().Text("DATOS DEL CLIENTE").FontSize(10).Bold().FontColor(Colors.Blue.Darken2);
                            custCol.Item().Text($"Cliente: {invoice.CustomerName}").FontSize(9);
                            custCol.Item().Text($"C.I. / RUC: {invoice.CustomerIdentityCard}").FontSize(9);
                            custCol.Item().Text($"Email: {invoice.CustomerEmail}").FontSize(9);
                        });

                        row.RelativeItem().Column(addrCol =>
                        {
                            addrCol.Item().Text("DIRECCIÓN DE ENTREGA").FontSize(10).Bold().FontColor(Colors.Blue.Darken2);
                            addrCol.Item().Text($"Dirección: {invoice.CustomerAddress}").FontSize(9);
                            addrCol.Item().Text($"Ciudad/País: {invoice.CustomerCity}, {invoice.CustomerCountry}").FontSize(9);
                            addrCol.Item().Text($"Cód. Postal: {invoice.CustomerPostalCode}").FontSize(9);
                        });
                    });

                    col.Item().Height(15);
                });

                page.Content().Column(col =>
                {
                    col.Item().Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.RelativeColumn(2); // Código
                            columns.RelativeColumn(5); // Producto
                            columns.RelativeColumn(2); // Cantidad
                            columns.RelativeColumn(2); // P. Unitario
                            columns.RelativeColumn(2); // IVA %
                            columns.RelativeColumn(2); // Subtotal
                        });

                        table.Header(header =>
                        {
                            header.Cell().Background(Colors.Blue.Darken2).Padding(4).Text("Código").FontColor(Colors.White).SemiBold();
                            header.Cell().Background(Colors.Blue.Darken2).Padding(4).Text("Producto").FontColor(Colors.White).SemiBold();
                            header.Cell().Background(Colors.Blue.Darken2).Padding(4).AlignRight().Text("Cant.").FontColor(Colors.White).SemiBold();
                            header.Cell().Background(Colors.Blue.Darken2).Padding(4).AlignRight().Text("P. Unit").FontColor(Colors.White).SemiBold();
                            header.Cell().Background(Colors.Blue.Darken2).Padding(4).AlignRight().Text("IVA").FontColor(Colors.White).SemiBold();
                            header.Cell().Background(Colors.Blue.Darken2).Padding(4).AlignRight().Text("Subtotal").FontColor(Colors.White).SemiBold();
                        });

                        foreach (var line in invoice.Lines)
                        {
                            table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(4).Text(line.ProductCode).FontSize(9);
                            table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(4).Text(line.ProductName).FontSize(9);
                            table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(4).AlignRight().Text(line.Quantity.ToString()).FontSize(9);
                            table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(4).AlignRight().Text($"${line.UnitPrice.ToString("N2", culture)}").FontSize(9);
                            table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(4).AlignRight().Text($"{(line.TaxRate * 100):0}%").FontSize(9);
                            table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(4).AlignRight().Text($"${line.LineSubtotal.ToString("N2", culture)}").FontSize(9);
                        }
                    });

                    col.Item().Height(15);

                    col.Item().AlignRight().Width(220).Table(totalsTable =>
                    {
                        totalsTable.ColumnsDefinition(columns =>
                        {
                            columns.RelativeColumn(1);
                            columns.RelativeColumn(1);
                        });

                        totalsTable.Cell().Padding(2).Text("Subtotal:").SemiBold();
                        totalsTable.Cell().Padding(2).AlignRight().Text($"${invoice.Subtotal.ToString("N2", culture)}");

                        totalsTable.Cell().Padding(2).Text("Descuento:").SemiBold();
                        totalsTable.Cell().Padding(2).AlignRight().Text($"${invoice.DiscountAmount.ToString("N2", culture)}");

                        totalsTable.Cell().Padding(2).Text("IVA:").SemiBold();
                        totalsTable.Cell().Padding(2).AlignRight().Text($"${invoice.TaxAmount.ToString("N2", culture)}");

                        totalsTable.Cell().BorderTop(1).BorderColor(Colors.Grey.Darken1).Padding(3).Text("TOTAL:").Bold().FontSize(12);
                        totalsTable.Cell().BorderTop(1).BorderColor(Colors.Grey.Darken1).Padding(3).AlignRight().Text($"${invoice.Total.ToString("N2", culture)}").Bold().FontSize(12).FontColor(Colors.Blue.Darken2);
                    });
                });

                page.Footer().AlignCenter().Text(text =>
                {
                    text.Span("Página ");
                    text.CurrentPageNumber();
                    text.Span(" de ");
                    text.TotalPages();
                });
            });
        });

        return document.GeneratePdf();
    }
}
