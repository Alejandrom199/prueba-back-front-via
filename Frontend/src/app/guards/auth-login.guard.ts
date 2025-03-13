import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';

export const authLoginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const usuario = localStorage.getItem('usuario');

  if (usuario) {
    return router.createUrlTree(['/dashboard']);
  }

  return true;
};
