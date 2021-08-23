import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthorizeService } from 'src/app/shared/services/auth.service';
import { HelperService } from 'src/app/shared/services/helper.service';
import {AdminHelperService} from '../../admin-dashboard/admin-helper.service';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html'
})
export class PasswordComponent implements OnInit, OnDestroy {
  resetPasswordForm: FormGroup;
  isLoading: boolean;
  isFormSubmitted: boolean = false;
  fromLogin = false;
  isPasswordShow = false;
  isOldPasswordShow = false;
  isConfirmPasswordShow = false;

  constructor(
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private cd: ChangeDetectorRef,
    public validateService: HelperService,
    private authService: AuthorizeService,
    private adminHelperService: AdminHelperService,
  ) { }

  ngOnInit() {
    this.initailizeResetForm();
  }

  initailizeResetForm(): void {
    this.resetPasswordForm = this.fb.group({
      current_password: ['', [Validators.required]],
      new_password: ['', [Validators.required]],
      confirm_password: ['']
    }, { validators: this.checkPasswords('new_password', 'confirm_password') });
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

  showPasswordtext() {
    this.isPasswordShow = !this.isPasswordShow;
  }

  showOldPasswordtext() {
    this.isOldPasswordShow = !this.isOldPasswordShow;
  }

  showConfirmPasswordtext() {
    this.isConfirmPasswordShow = !this.isConfirmPasswordShow;
  }

  submitLoginmarkAsTouched() {
    Object.values(this.resetPasswordForm.controls).forEach((control: any) => {
      control.markAsTouched();
    });
  }

  resetPasswordSubmit() {
    if (!this.resetPasswordForm.valid) {
      this.submitLoginmarkAsTouched();
      this.cd.detectChanges();
      this.toastrService.warning('Please enter valid details');
      return;
    }
    const body = this.resetPasswordForm.value;
    if (body.current_password === body.new_password) {
      this.toastrService.warning('Current and New password should not be same');
      return false;
    }
    this.isFormSubmitted = true;
    this.authService.resetPassword(body).subscribe((resp) => {
      console.log('resp', resp);
      if (resp.body.error == 'Invalid current password') {
        this.toastrService.warning('Invalid old password');
        this.isFormSubmitted = false;
      } else {
        this.isFormSubmitted = false;
        this.resetPasswordForm.reset();
        this.cd.detectChanges();
        this.adminHelperService.isAdminResetPassword.next(true);
        this.toastrService.success('Password updated successfully');
      }

    }, () => {
      this.isFormSubmitted = false;
      this.toastrService.error('Invalid details');
    });
  }
  ngOnDestroy() {
    this.cd.detach();
  }
}
