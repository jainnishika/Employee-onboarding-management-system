import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const adminOrHrGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);

  const role = localStorage.getItem("role");

  if (role === "Admin" || role === "HR") {

    return true;

  }

  router.navigate(['/employee-dashboard']);

  return false;

};