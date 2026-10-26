import { environment } from '../../../environments/environment';

const base = environment.apiBaseUrl ? environment.apiBaseUrl.replace(/\/+$/, '') : '';

export const Endpoints = {
  // NorthWind.Sales.Entities.ValueObjects.Endpoints
  CreateOrder: `${base}/CreateOrder`,
  SearchCustomers: `${base}/SearchCustomers`,
  SearchProducts: `${base}/SearchProducts`,
  SearchInvoices: `${base}/SearchInvoices`,
  GetInvoice: `${base}/GetInvoice`,
  GetInvoicePdf: `${base}/GetInvoicePdf`,

  // NorthWind.Membership.Entities.ValueObjects.Endpoints
  Register: `${base}/user/Register`,
  Login: `${base}/user/Login`
} as const;
