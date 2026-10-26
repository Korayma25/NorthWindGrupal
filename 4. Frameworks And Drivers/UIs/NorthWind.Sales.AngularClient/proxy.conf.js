const TARGET = 'http://localhost:5081';

/**
 * Bypass proxying for browser navigation requests (Accept: text/html)
 * so that Angular Router serves index.html instead of forwarding to backend.
 * API calls (XHR/fetch with JSON or blob) will be forwarded to the backend.
 */
const bypassHtml = function (req) {
  if (req.headers && req.headers.accept && req.headers.accept.includes('text/html')) {
    return '/index.html';
  }
};

const PROXY_CONFIG = {
  '/user': {
    target: TARGET,
    changeOrigin: true,
    logLevel: 'debug',
    bypass: bypassHtml
  },
  '/CreateOrder': {
    target: TARGET,
    changeOrigin: true,
    logLevel: 'debug',
    bypass: bypassHtml
  },
  '/SearchCustomers': {
    target: TARGET,
    changeOrigin: true,
    logLevel: 'debug',
    bypass: bypassHtml
  },
  '/SearchProducts': {
    target: TARGET,
    changeOrigin: true,
    logLevel: 'debug',
    bypass: bypassHtml
  },
  '/SearchInvoices': {
    target: TARGET,
    changeOrigin: true,
    logLevel: 'debug',
    bypass: bypassHtml
  },
  '/GetInvoice': {
    target: TARGET,
    changeOrigin: true,
    logLevel: 'debug',
    bypass: bypassHtml
  },
  '/GetInvoicePdf': {
    target: TARGET,
    changeOrigin: true,
    logLevel: 'debug',
    bypass: bypassHtml
  }
};

module.exports = PROXY_CONFIG;
