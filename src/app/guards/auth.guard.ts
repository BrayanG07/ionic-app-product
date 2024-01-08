import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { UtilService } from '../services/util.service';
import { KR_AUTH, LS_USER } from '../constants';

export const AuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
  ) => {
  const firebaseServce = inject(FirebaseService);
  const utilService = inject(UtilService);
  const userLocalStorage = utilService.getFromLocalStorage(LS_USER);

  return new Promise((resolve, reject) => {
    firebaseServce.getAuthUser().onAuthStateChanged((auth) => {
      if (auth && userLocalStorage) {
        resolve(true);
      } else {
        utilService.routerLink(KR_AUTH)
        resolve(false);
      }
    })
  });
}
