import axiosClient from '../api/axiosClient';

const productService = {
    async searchProducts(
        name = '',
        code = '',
        page = 1,
        pageSize = 5
    ) {
        let params;
        if (typeof name === 'object' && name !== null) {
            params = {
                name: name.name ?? '',
                code: name.code ?? '',
                page: name.page ?? 1,
                pageSize: name.pageSize ?? 5,
            };
        } else {
            params = {
                name: name || '',
                code: code || '',
                page: page || 1,
                pageSize: pageSize || 5,
            };
        }

        const response = await axiosClient.get('/SearchProducts', {
            params,
        });

        return response.data;
    },
};

export default productService;
