/**
 * Production environment configuration.
 *
 * NOTE: If your production backend is deployed on a separate domain/origin (e.g., https://api.northwindsales.com),
 * configure that base URL here. However, because the ASP.NET Core backend in this solution does not have CORS enabled,
 * in production you should either:
 * 1. Enable CORS in the backend for this frontend origin, OR
 * 2. Deploy the Angular app and backend behind a reverse proxy (e.g., Nginx, Azure App Gateway, Cloudflare, etc.)
 *    that routes API endpoints (/CreateOrder, /SearchInvoices, /user, etc.) to the backend on the same origin.
 *
 * If deploying behind a reverse proxy on the same origin, leave apiBaseUrl as '' (empty string).
 */
export const environment = {
  production: true,
  apiBaseUrl: 'https://api.northwindsales.com'
};
