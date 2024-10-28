import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Services/Authorization/auth.service';

export const testGuard: CanActivateFn = (route, state) => {
  
  const router = inject(Router);
  const auth = inject(AuthService);

  const localData = auth.getToken();

  if (localData != null) {
    return true;
  } else {
    router.navigateByUrl('/login');
    return false;
  }
};
