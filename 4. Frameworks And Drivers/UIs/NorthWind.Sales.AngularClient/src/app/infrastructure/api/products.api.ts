import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResultDto, ProductLookupDto, SearchProductsDto } from '../../domain/dtos';
import { Endpoints } from './endpoints';

@Injectable({
  providedIn: 'root'
})
export class ProductsApi {
  private readonly http = inject(HttpClient);

  public search(criteria: Partial<SearchProductsDto> = {}): Observable<PagedResultDto<ProductLookupDto>> {
    const page = criteria.page ?? 1;
    const pageSize = criteria.pageSize ?? 10;
    const name = encodeURIComponent(criteria.name ?? '');
    const code = encodeURIComponent(criteria.code ?? '');

    const url = `${Endpoints.SearchProducts}?name=${name}&code=${code}&page=${page}&pageSize=${pageSize}`;
    return this.http.get<PagedResultDto<ProductLookupDto>>(url);
  }
}
