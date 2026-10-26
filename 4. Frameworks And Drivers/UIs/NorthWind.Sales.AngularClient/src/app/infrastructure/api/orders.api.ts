import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateOrderDto } from '../../domain/dtos';
import { Endpoints } from './endpoints';

@Injectable({
  providedIn: 'root'
})
export class OrdersApi {
  private readonly http = inject(HttpClient);

  public createOrder(order: CreateOrderDto): Observable<number> {
    return this.http.post<number>(Endpoints.CreateOrder, order);
  }
}
