import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const usuario = localStorage.getItem('usuario');

  if (usuario) {
    return true;
  } else {
    return router.createUrlTree(['/']);
  }
};
