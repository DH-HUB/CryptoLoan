import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('cryptoloan_token');
  if (token) return true;
  return router.createUrlTree(['/login']);
};
