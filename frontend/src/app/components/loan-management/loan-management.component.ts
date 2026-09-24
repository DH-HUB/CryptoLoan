import { Component } from '@angular/core';
import { LoanFormComponent } from "../loan-form/loan-form.component";
import { LoanListComponent } from "../loan-list/loan-list.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-loan-management',
  standalone: true,
  imports: [LoanFormComponent, LoanListComponent, RouterModule],
  templateUrl: './loan-management.component.html',
  styleUrls: ['./loan-management.component.css']
})
export class LoanManagementComponent {}
