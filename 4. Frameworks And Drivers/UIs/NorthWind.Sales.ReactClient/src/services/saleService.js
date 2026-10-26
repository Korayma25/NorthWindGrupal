import axiosClient from '../api/axiosClient';

const saleService = {
    async createSale(saleData) {
        const response = await axiosClient.post('/CreateOrder', saleData);
        return response.data;
    },

    async getSaleById(id) {
        const response = await axiosClient.get('/GetInvoice', {
            params: { id },
        });

        return response.data;
    },

    async searchSales(
        invoiceNumber = '',
        customerName = '',
        page = 1,
        pageSize = 10
    ) {
        let params;
        if (typeof invoiceNumber === 'object' && invoiceNumber !== null) {
            params = {
                invoiceNumber: invoiceNumber.invoiceNumber ?? '',
                customerName: invoiceNumber.customerName ?? '',
                page: invoiceNumber.page ?? 1,
                pageSize: invoiceNumber.pageSize ?? 10,
            };
        } else {
            params = {
                invoiceNumber: invoiceNumber || '',
                customerName: customerName || '',
                page: page || 1,
                pageSize: pageSize || 10,
            };
        }

        const response = await axiosClient.get('/SearchInvoices', {
            params,
        });

        return response.data;
    },

    async downloadPdf(id) {
        const response = await axiosClient.get('/GetInvoicePdf', {
            params: { id },
            responseType: 'blob',
        });

        const blob = new Blob([response.data], {
            type: 'application/pdf',
        });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = url;
        link.download = `factura_${id}.pdf`;

        document.body.appendChild(link);
        link.click();
        link.remove();

        window.URL.revokeObjectURL(url);
    },
};

export default saleService;
