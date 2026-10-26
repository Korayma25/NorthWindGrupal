import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { CustomersApi } from './customers.api';
import { ProductsApi } from './products.api';

describe('API Services', () => {
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        CustomersApi,
        ProductsApi
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('CustomersApi.search should build correct encoded query string and default pagination', () => {
    const api = TestBed.inject(CustomersApi);

    api.search({ name: 'José Pérez', identityCard: '1710034065' }).subscribe();

    const req = httpMock.expectOne(
      '/SearchCustomers?name=Jos%C3%A9%20P%C3%A9rez&identityCard=1710034065&page=1&pageSize=10'
    );
    expect(req.request.method).toBe('GET');
    req.flush({ items: [], page: 1, pageSize: 10, totalCount: 0, totalPages: 0 });
  });

  it('ProductsApi.search should build correct encoded query string and default pagination', () => {
    const api = TestBed.inject(ProductsApi);

    api.search({ name: 'Té verde', code: 'TEA#01', page: 2, pageSize: 5 }).subscribe();

    const req = httpMock.expectOne(
      '/SearchProducts?name=T%C3%A9%20verde&code=TEA%2301&page=2&pageSize=5'
    );
    expect(req.request.method).toBe('GET');
    req.flush({ items: [], page: 2, pageSize: 5, totalCount: 0, totalPages: 0 });
  });
});
