import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Loan, LoanApi } from '../../services/loan.api';
import { AppNotification, NotificationApi } from '../../services/notification.api';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-guarantee-management',
  templateUrl: './guarantee-management.component.html',
  styleUrls: ['./guarantee-management.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class GuaranteeManagementComponent {
  guarantees: Loan[] = [];
  alerts: AppNotification[] = [];
  loading = true;
  constructor(private loans: LoanApi, private notifications: NotificationApi) {
    forkJoin({loans: this.loans.listLoans(), notifications: this.notifications.list()}).subscribe({next:r=>{this.guarantees=r.loans.filter(l=>l.status!=='LIQUIDATED');this.alerts=r.notifications.filter(n=>n.type.includes('LIQUIDATION')).slice(0,10);this.loading=false;},error:()=>this.loading=false});
  }
}
