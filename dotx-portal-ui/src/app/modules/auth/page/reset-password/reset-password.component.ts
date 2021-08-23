import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { StudentHelperService } from 'src/app/modules/student-dashboard/student-helper.service';
import { AuthorizeService } from 'src/app/shared/services/auth.service';
import { HelperService } from 'src/app/shared/services/helper.service';
import { CustomValidator } from 'src/app/shared/validators/customValidator';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  @Input() userReset;
  resetPasswordForm: FormGroup;
  old_showHide = false;
  fromLogin: Boolean = false;
  navigateSource: any;
  isLoading: Boolean;
  resetInfoDashboard: any;
  new_showHide = false;
  confirm_showHide = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toastrService: ToastrService,
    protected activatedRoute: ActivatedRoute,
    public _uhs: HelperService,
    private cd: ChangeDetectorRef,
    private studentHelperService: StudentHelperService,
    private authService: AuthorizeService) { }

  ngOnInit() {
    this.resetForm();
    this.navigationExtras();
    this.resetInfoDashboard = this.userReset;

    const { handleResetPassword } = this.studentHelperService;
    if (handleResetPassword.observers.length === 0) {
      this.studentHelperService.handleResetPassword.subscribe(resp => {
        if (resp) {
          console.log('respSubject', resp);
          this.resetInfoDashboard = resp;
        }
      })
    }
  }

  resetForm(): void {
    this.resetPasswordForm = this.formBuilder.group({
      current_password: ['', [Validators.required]],
      new_password: ['', [Validators.required]],
      confirm_password: ['', [Validators.required]]
    });
  }

  navigationExtras() {
    this.activatedRoute.queryParams.subscribe(params => {
      console.log('params', params)
      this.navigateSource = params.source;
      this.cd.detectChanges();
      if (this.navigateSource == 'fromLogin') {
        this.fromLogin = true;
      } else if (this.navigateSource == 'fromStudentLogin') {
        this.fromLogin = true;
      } else {
        this.fromLogin = false;
      }
    });
  }

  showPasswordtext() {
    this.old_showHide = !this.old_showHide;
  }

  showNewPasswordtext() {
    this.new_showHide = !this.new_showHide;
  }

  showConfrmPasswordtext() {
    this.confirm_showHide = !this.confirm_showHide;
  }

  submitLoginmarkAsTouched() {
    Object.values(this.resetPasswordForm.controls).forEach((control: any) => {
      control.markAsTouched();
    });
  }

  resetPasswordSubmit() {
    this.isLoading = true;
    if (!this.resetPasswordForm.valid) {
      this.submitLoginmarkAsTouched();
      this.cd.detectChanges();
      this.toastrService.warning('Please enter Password');
      this.isLoading = false;
      return;
    }
    const { current_password, new_password, confirm_password } = this.resetPasswordForm.value;
    const body = {
      current_password: current_password,
      new_password: new_password,
      confirm_password: confirm_password
    }

    this.authService.resetPassword(body).subscribe((resp) => {
      this.isLoading = false;
      const { access_token, refresh_token } = resp.body;
      console.log('.....call respose oauth', resp.body);
      this.toastrService.success('Reset Password successfully');
      if (this.resetInfoDashboard == 'resetPassword') {
        return false;
      } else {
        if (this.navigateSource == 'fromLogin') {
          this.router.navigate(['auth/login']);
        } else if (this.navigateSource == 'fromStudentLogin') {
          this.router.navigate(['/home']);
        } else {
          this.router.navigate(['main-route/user/userDetails/userList']);
        }
      }

    }, () => {
      this.isLoading = false;
      console.log('error auth......');
      this.toastrService.error('Invalid login details');
    })
  }

}
