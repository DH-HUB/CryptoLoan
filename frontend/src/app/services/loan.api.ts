import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { API_BASE_URL } from './api.config';

export interface Loan {
  id: number;
  borrowerEmail: string;
  borrowerName: string;
  amountEur: number;
  liquidationRatio: number;
  status: 'PENDING' | 'APPROVED' | 'LIQUIDATED';
  collateralSymbol: string;
  collateralAmount: number;
  createdAt: string;
  lastObservedRatio?: number;
}

export interface CreateLoanRequest {
  amountEur: number;
  liquidationRatio: number;
  collateralSymbol: string;
  collateralAmount: number;
}

export interface ContractProof {
  loanId: number;
  borrowerEmail: string;
  contractHashHex: string;
  userTxHash?: string;
  adminTxHash?: string;
  documentReference: string;
  generatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class LoanApi {
  private refreshed$ = new Subject<void>();

  constructor(private http: HttpClient) {}

  refreshEvents(): Observable<void> {
    return this.refreshed$.asObservable();
  }

  listLoans(): Observable<Loan[]> {
    return this.http.get<Loan[]>(`${API_BASE_URL}/loans`);
  }

  listAllLoans(): Observable<Loan[]> { return this.http.get<Loan[]>(`${API_BASE_URL}/loans/all`); }
  approve(id: number): Observable<Loan> { return this.http.patch<Loan>(`${API_BASE_URL}/loans/${id}/approve`, {}); }
  contract(id: number): Observable<ContractProof> { return this.http.get<ContractProof>(`${API_BASE_URL}/contracts/${id}`); }
  signUser(id: number): Observable<ContractProof> { return this.http.post<ContractProof>(`${API_BASE_URL}/contracts/${id}/sign/user`, {}); }
  signAdmin(id: number): Observable<ContractProof> { return this.http.post<ContractProof>(`${API_BASE_URL}/contracts/${id}/sign/admin`, {}); }
  downloadContract(id: number): Observable<Blob> { return this.http.get(`${API_BASE_URL}/contracts/${id}/document`, { responseType: 'blob' }); }

  createLoan(req: CreateLoanRequest): Observable<Loan> {
    return this.http.post<Loan>(`${API_BASE_URL}/loans`, req).pipe(
      tap(() => this.refreshed$.next())
    );
  }
}
