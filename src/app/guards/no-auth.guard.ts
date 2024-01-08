import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { UtilService } from '../services/util.service';
import { KR_MAIN, KR_MAIN_HOME } from '../constants';

export const NoAutGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const firebaseServce = inject(FirebaseService);
  const utilService = inject(UtilService);

  return new Promise((resolve, reject) => {
    firebaseServce.getAuthUser().onAuthStateChanged((auth) => {
      if (!auth) {
        resolve(true);
      } else {
        utilService.routerLink(`${KR_MAIN}/${KR_MAIN_HOME}`)
        resolve(false);
      }
    })
  });
}
