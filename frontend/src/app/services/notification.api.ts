import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api.config';

export interface AppNotification {
  id: number;
  type: string;
  subject: string;
  message: string;
  loanId?: number;
  status: 'PENDING' | 'SENT' | 'FAILED';
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationApi {
  constructor(private http: HttpClient) {}
  list(): Observable<AppNotification[]> { return this.http.get<AppNotification[]>(`${API_BASE_URL}/notifications`); }
  sendTest(): Observable<AppNotification> { return this.http.post<AppNotification>(`${API_BASE_URL}/notifications/test`, {}); }
}

