import { Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { LoanManagementComponent } from './components/loan-management/loan-management.component';
import { GuaranteeManagementComponent } from './components/guarantee-management/guarantee-management.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './auth/auth.guard';
import { NotificationsComponent } from './components/notifications/notifications.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'loan-management', component: LoanManagementComponent, canActivate: [authGuard] },
  { path: 'guarantee-management', component: GuaranteeManagementComponent, canActivate: [authGuard] },
  { path: 'notifications', component: NotificationsComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];
