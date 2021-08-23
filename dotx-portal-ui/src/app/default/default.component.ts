import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthLogout } from '../store/auth.action';
import { AuthState } from '../store/auth.model';
import { userInfo, userResponse } from '../store/auth.selector';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html'
})
export class DefaultComponent implements OnInit {
  userInfo: any;
  userResp: any;
  constructor(private store: Store<AuthState>,
              private router: Router) { }

  ngOnInit() {
    this.store.select(userInfo).subscribe(res => this.userInfo = res);
    this.store.select(userResponse).subscribe(res => this.userResp = res);
    if (this.userInfo) {
      if (this.userInfo.user_type === 'student') {
        this.router.navigateByUrl('main-route/student/home');
      } else {
        this.router.navigateByUrl('main-route/m/home');
      }
    } else if (this.userResp) {
      this.router.navigateByUrl('main-route/m/home');
    } else {
      this.store.dispatch(new AuthLogout());
    }
  }

}
