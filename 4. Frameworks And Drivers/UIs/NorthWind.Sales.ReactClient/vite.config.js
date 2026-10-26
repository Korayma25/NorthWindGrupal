import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const apiRoutes = [
    '/user',
    '/CreateOrder',
    '/SearchCustomers',
    '/SearchProducts',
    '/SearchInvoices',
    '/GetInvoice',
    '/GetInvoicePdf',
];

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        proxy: Object.fromEntries(
            apiRoutes.map((route) => [
                route,
                {
                    target: 'http://localhost:5081',
                    changeOrigin: true,
                    secure: false,
                    configure: (proxy) => {
                        proxy.on('proxyReq', (proxyReq, req) => {
                            console.log(`[proxy] ${req.method} ${req.url} -> http://localhost:5081`);
                        });
                    },
                },
            ])
        ),
    },
});
