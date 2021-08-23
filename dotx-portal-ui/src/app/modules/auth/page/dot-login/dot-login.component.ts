import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { StudentHelperService } from 'src/app/modules/student-dashboard/student-helper.service';
import { INVALID_CREDENTIALS, PLEASE_FILL_USERNAME_AND_PASSWORD } from 'src/app/shared/constants/error.constants';
import { PrivacyPolicyComponent } from 'src/app/shared/layout/privacy-policy/privacy-policy.component';
import { AuthorizeService } from 'src/app/shared/services/auth.service';
import { HelperService } from 'src/app/shared/services/helper.service';
import { CustomValidator } from 'src/app/shared/validators/customValidator';
import { AuthLoginSuccess, SetUser, SetUserDetail } from 'src/app/store/auth.action';
import { AuthState } from 'src/app/store/auth.model';
import { accessToken } from 'src/app/store/auth.selector';
import { environment } from 'src/environments/environment';

declare const gapi: any;
let auth2: any;



@Component({
  selector: 'app-dot-login',
  templateUrl: './dot-login.component.html',
  styleUrls: ['./dot-login.component.scss']
})
export class DotLoginComponent implements OnInit {

  userId: any;
  adminLoginForm: FormGroup;
  showPassword = false;
  isLoading: boolean;
  accessToken: any;
  errorMessage = false;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private toastrService: ToastrService,
              private studentHelperService: StudentHelperService,
              private modalService: NgbModal,
              public helperService: HelperService,
              private authService: AuthorizeService,
              private store: Store<AuthState>) { }

  ngOnInit(): void {
    this.loginBuildForm();
    this.store.select(accessToken).subscribe(res => this.accessToken = res);
    if (this.accessToken) {
      this.getUserID('userEmail', 'dashboard');
    }
  }

  loginBuildForm(): void {
    this.adminLoginForm = this.formBuilder.group({
      username: ['', [Validators.required, CustomValidator.ValidateEmail]],
      password: ['', [Validators.required]]
    });
  }

  loginSubmit() {
    this.errorMessage = false;
    this.isLoading = true;
    if (!this.adminLoginForm.valid) {
      this.adminLoginForm.markAllAsTouched();
      this.toastrService.warning(PLEASE_FILL_USERNAME_AND_PASSWORD);
      this.isLoading = false;
      return;
    }
    const body = {
      username: this.adminLoginForm.value.username,
      password: this.adminLoginForm.value.password
    };
    sessionStorage.clear();
    this.authService.loginOAuthToken(body).subscribe((resp) => {
      this.errorMessage = false;
      this.isLoading = false;
      this.store.dispatch(new AuthLoginSuccess(resp.body));
      this.getUserID('userEmail', 'dashboard');
    }, () => {
      this.isLoading = false;
      this.errorMessage = true;
     // this.toastrService.error(INVALID_CREDENTIALS);
    });
  }

  showPrivacyModal() {
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
    };
    this.modalService.open(PrivacyPolicyComponent, ngbModalOptions);
  }

  googleInit() {
    // const gapi
    gapi.load('auth2', () => {
      auth2 = gapi.auth2.init({
        client_id: environment.googleClientId,
        // client_id: '1091261426815-2e0k6uhq5csf9lb4q32s27i30t2ffa4o.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });
      this.attachSignin(document.getElementById('googleBtn'));
    });
  }

  attachSignin(element) {
    auth2.attachClickHandler(element, {},
      (googleUser) => {

        const profile = googleUser.getBasicProfile();
        console.log('Token || ' + googleUser.getAuthResponse().id_token);
        console.log('ID: ' + profile.getId());
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail());

        const payload = {
          email: profile.getEmail(),
          name: profile.getName(),
          picture: profile.getImageUrl()
        };


        this.signInwithGoogle(payload);
      }, (error) => {
        console.log('google err');
      });

  }

  signInwithGoogle(payload) {
    this.authService.signinWithGoogle(payload).subscribe((resp) => {
      this.toastrService.success('Loading..........');
      this.callLoginAuth(resp.body);

    }, () => {
      console.log('error auth......');
    });
  }

  callLoginAuth(body) {
    const { login_first_time, password, username } = body;
    body = {
      username,
      password
    };
    this.authService.loginOAuthToken(body).subscribe((resp) => {
      const { access_token, refresh_token } = resp.body;
      const token = sessionStorage.setItem('access_token', access_token);
      console.log('.....call respose oauth', resp.body, token);

      this.toastrService.success('Login success');
      if (login_first_time) {
        const navigationExtras: NavigationExtras = {
          queryParams: {
            path: 'createProfile',
            fromGoogle: true,
            typeOf: 'onboarding'
          }
        };
        this.getUserID('googleType', navigationExtras);
      } else {
        this.getUserID('googleDirectHome', 'home');
      }
    }, () => {
      console.log('error auth......');
      this.toastrService.error('Invalid Credentials');
    });
  }


  getUserID(typeSignIn: string, navigationExtras: any): void {
    this.isLoading = true;
    this.authService.getUserIdData().subscribe((resp) => {
      this.userId = resp.id;
      this.store.dispatch(new SetUser(resp));
      if (resp.usertype !== 'student') {
        this.isLoading = false;
        this.router.navigateByUrl('main-route/m/home');
      } else {
        if (typeSignIn === 'userSignUp' || typeSignIn === 'userJoinCode') {
          this.redirectQuizDetails(navigationExtras);
        } else if (typeSignIn === 'userEmail') {
          this.getUserInfo();
        } else if (typeSignIn === 'googleType') {
          this.redirectQuizDetails(navigationExtras);
        } else if (typeSignIn === 'googleDirectHome') {
          this.getUserInfo();
        }
      }
    }, () => {
      this.isLoading = false;
      console.log('error join code......');
      this.toastrService.error('Unable to get User id');
    });
  }

  redirectQuizDetails(navigationExtras: any): void {
    this.isLoading = false;
    this.router.navigate(['main-route/onBoarding'], navigationExtras);
  }

  getUserInfo(): void {
    this.studentHelperService.getUserInfo(this.userId).subscribe((resp) => {
      this.isLoading = false;
      this.store.dispatch(new SetUserDetail(resp));
      this.loginSuccess(resp.is_temp_passwd);
    }, () => {
      this.toastrService.error('Unable to get User info');
      this.isLoading = false;
    });
  }

  loginSuccess(isTempPWD: any): void {
    this.isLoading = false;
    if (isTempPWD === 1) {
      this.router.navigate(['auth/resetPassword']);
    } else if (isTempPWD === 0) {
      this.router.navigateByUrl('main-route/student/home');
    } else {
      sessionStorage.setItem('login_type', 'fromGoogle');
      this.router.navigate(['main-route/student/home']);
    }
  }
}
