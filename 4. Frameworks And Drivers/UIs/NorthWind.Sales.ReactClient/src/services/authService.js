import axiosClient from '../api/axiosClient';

const authService = {
    async login(email, password) {
        const response = await axiosClient.post('/user/Login', {
            email,
            password,
        });

        const accessToken = response.data?.accessToken;
        if (accessToken) {
            localStorage.setItem('token', accessToken);
            localStorage.setItem('user', JSON.stringify({ email }));
        }

        return response.data;
    },

    async register(userData) {
        const response = await axiosClient.post('/user/Register', userData);
        return response.data;
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated() {
        return Boolean(localStorage.getItem('token'));
    },
};

export default authService;
