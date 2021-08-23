import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AdminHelperService } from './admin-helper.service';
@Injectable({
  providedIn: 'root'
})
export class AdminGuardService implements CanActivate {
  constructor(public auth: AdminHelperService, public router: Router) {}
  canActivate(): boolean {
    if (!this.auth.isAuthenticated()) {
      sessionStorage.clear();
      this.router.navigate(['home']);
      return true;
    }
    return true;
  }
}