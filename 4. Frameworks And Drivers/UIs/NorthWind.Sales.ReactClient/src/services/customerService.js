import axiosClient from '../api/axiosClient';

const customerService = {
    async searchCustomers(
        name = '',
        identityCard = '',
        page = 1,
        pageSize = 5
    ) {
        let params;
        if (typeof name === 'object' && name !== null) {
            params = {
                name: name.name ?? '',
                identityCard: name.identityCard ?? '',
                page: name.page ?? 1,
                pageSize: name.pageSize ?? 5,
            };
        } else {
            params = {
                name: name || '',
                identityCard: identityCard || '',
                page: page || 1,
                pageSize: pageSize || 5,
            };
        }

        const response = await axiosClient.get('/SearchCustomers', {
            params,
        });

        return response.data;
    },
};

export default customerService;
