import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { StudentHelperService } from 'src/app/modules/student-dashboard/student-helper.service';
import { AuthorizeService } from 'src/app/shared/services/auth.service';
import { HelperService } from 'src/app/shared/services/helper.service';
import { CustomValidator } from 'src/app/shared/validators/customValidator';
import { SetUser, SetUserDetail } from 'src/app/store/auth.action';
import { AuthState } from 'src/app/store/auth.model';
import { userInfo } from 'src/app/store/auth.selector';

@Component({
  selector: 'app-create-password',
  templateUrl: './create-password.component.html'
})
export class CreatePasswordComponent implements OnInit {
  isLoading: boolean;
  buildForm: FormGroup;
  userId: string | number;
  isTermsChecked = false;
  showPassword = false;
  showConfPwd = false;
  userDetails: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: Router,
    private toastrService: ToastrService,
    private studentHelperService: StudentHelperService,
    public _uhs: HelperService,
    private authService: AuthorizeService,
    private store: Store<AuthState>
  ) { }

  ngOnInit() {
    this.initializeForm();
    this.store.select(userInfo).subscribe(res => this.userDetails = res);
    if (this.userDetails.joincode['invited_by'] !== 'admin') {
      this.buildForm.patchValue({
        email: this.userDetails.user_email ? this.userDetails.user_email : this.userDetails.user_gmail
      });
    }
  }

  initializeForm() {
    this.buildForm = this.formBuilder.group({
      email: ['', [Validators.required, CustomValidator.ValidateEmail]],
      password: ['', [Validators.required]],
      confirm_password: ['']
    }, { validators: this.checkPasswords('password', 'confirm_password') });
  }

  checkPasswords(password: string, confirmPassword: string) {
    return (group: FormGroup) => {
      const passwordInput = group.controls[password];
      const passwordConfirmationInput = group.controls[confirmPassword];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({ notSame: true });
      } else {
        return passwordConfirmationInput.setErrors(null);
      }
    };
  }

  checkTerms(event) {
    this.isTermsChecked = event.srcElement.checked;
  }

  setPassword() {
    const { email, password, confirm_password } = this.buildForm.value;
    const navigationExtras: NavigationExtras = {
      queryParams: {
        path: 'createProfile',
        typeOf: 'onboarding'
      }
    };
    if (!this.buildForm.valid) {
      this.toastrService.warning('Please fill details');
      return;
    }

    if (password !== confirm_password) {
      this.toastrService.warning('Passwords Should Match');
      return;
    }
    this.isLoading = true;

    const body = {
      user_email: email,
      new_password: password,
      confirm_password: confirm_password

    };
    this.authService.createUser(body).subscribe((resp) => {
      this.isLoading = false;
      this.getUserID('userSignUp', navigationExtras);
      this.toastrService.success('Your Password has been changed successfully');

    }, () => {
      this.isLoading = false;
      this.toastrService.error('Invalid details');
    });
  }

  getUserID(typeSignIn: any, navigationExtras: any) {
    this.isLoading = true;
    this.authService.getUserIdData().subscribe((resp) => {
      this.userId = resp.id;
      this.store.dispatch(new SetUser(resp));
      this.studentHelperService.getUserInfo(this.userId).subscribe((res) => {
        this.store.dispatch(new SetUserDetail(res));
      }, () => {
        this.toastrService.error('Unable to get User info');
        this.isLoading = false;
      });

      this.redirectQuizDetails(navigationExtras);
    }, () => {
      this.isLoading = false;
      console.log('error join code......');
      this.toastrService.error('Unable to get User id');
    });
  }

  redirectQuizDetails(navigationExtras: any) {
    this.isLoading = false;
    this.route.navigate(['main-route/student-onboard/about-dotx']);
  }
}
