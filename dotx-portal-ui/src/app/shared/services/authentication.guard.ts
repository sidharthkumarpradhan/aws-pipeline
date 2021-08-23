import { Injectable, OnDestroy } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthState, Menus } from 'src/app/store/auth.model';
import { accessToken, menus, userInfo, userResponse } from 'src/app/store/auth.selector';
import { Subscription } from 'rxjs';
import { AuthLogout } from 'src/app/store/auth.action';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate, OnDestroy {
    accessToken: string;
    subscription: Subscription[] = [];
    userInfo: any;
    constructor(private store: Store<AuthState>,
                private router: Router ) {
        this.subscription.push(this.store.select(accessToken).subscribe(res => this.accessToken = res));
        this.subscription.push(this.store.select(userResponse).subscribe(res => this.userInfo = res));
     }
    ngOnDestroy(): void {
       this.subscription.forEach(sub => sub.unsubscribe());
    }

    canActivate(): boolean {
        if (this.accessToken && this.userInfo) {
            return true;
        }
        this.store.dispatch(new AuthLogout());
        this.router.navigateByUrl('/login');
        return false;
    }
}
