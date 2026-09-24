import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api.config';

@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  constructor(private http: HttpClient) {}

  getCryptoPriceEur(cryptoId: string): Observable<number> {
    return this.http.get<number>(`${API_BASE_URL}/crypto/price`, { params: { cryptoId } });
  }

  getCryptoPricesEur(cryptoIds: string[]): Observable<Record<string, number>> {
    let params = new HttpParams();
    cryptoIds.forEach((id) => (params = params.append('cryptoIds', id)));
    return this.http.get<Record<string, number>>(`${API_BASE_URL}/crypto/prices`, { params });
  }
}
