import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api.config';

export interface CollateralPosition {
  symbol: string;
  quantity: number;
}

export interface LoanPositionSummary {
  totalLoans: number;
  pendingLoans: number;
  approvedLoans: number;
  liquidatedLoans: number;
  totalBorrowedEur: number;
  outstandingEur: number;
  collateralByCrypto: CollateralPosition[];
}

@Injectable({ providedIn: 'root' })
export class LoanPositionApi {
  constructor(private http: HttpClient) {}

  getSummary(): Observable<LoanPositionSummary> {
    return this.http.get<LoanPositionSummary>(`${API_BASE_URL}/portfolio/summary`);
  }
}
