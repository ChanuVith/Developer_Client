import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Services/Authorization/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  
  const authService = inject(AuthService); // Use Angular's inject function
  const router = inject(Router); // Use Angular's inject function

  if (authService.isLoggedIn()) {
    return true;
  } else {
    console.log('Not authenticated, redirecting to login');
    router.navigate(['/login']);
    return false;
  }
};
