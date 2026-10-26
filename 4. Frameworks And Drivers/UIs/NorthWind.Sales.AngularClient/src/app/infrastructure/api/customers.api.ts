import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomerLookupDto, PagedResultDto, SearchCustomersDto } from '../../domain/dtos';
import { Endpoints } from './endpoints';

@Injectable({
  providedIn: 'root'
})
export class CustomersApi {
  private readonly http = inject(HttpClient);

  public search(criteria: Partial<SearchCustomersDto> = {}): Observable<PagedResultDto<CustomerLookupDto>> {
    const page = criteria.page ?? 1;
    const pageSize = criteria.pageSize ?? 10;
    const name = encodeURIComponent(criteria.name ?? '');
    const identityCard = encodeURIComponent(criteria.identityCard ?? '');

    const url = `${Endpoints.SearchCustomers}?name=${name}&identityCard=${identityCard}&page=${page}&pageSize=${pageSize}`;
    return this.http.get<PagedResultDto<CustomerLookupDto>>(url);
  }
}
