import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthorizeService } from 'src/app/shared/services/auth.service';
import { HelperService } from 'src/app/shared/services/helper.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  forgotPasswordForm: FormGroup;
  isLoading: Boolean;
  resultObject: any;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private toastrService: ToastrService,
    protected activatedRoute: ActivatedRoute,
    public _uhs: HelperService,
    private cd: ChangeDetectorRef,
    private authService: AuthorizeService) { }

  ngOnInit() {
    this.forgotForm();
  }

  forgotForm(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      user_email: ['', [Validators.required]]
    });
  }

  submitAsTouched() {
    Object.values(this.forgotPasswordForm.controls).forEach((control: any) => {
      control.markAsTouched();
    });
  }

  forgotPasswordSubmit() {
    this.isLoading = true;
    if (!this.forgotPasswordForm.valid) {
      this.submitAsTouched();
      this.cd.detectChanges();
      this.toastrService.warning('Please enter Email Id');
      this.isLoading = false;
      return;
    }
    const { user_email } = this.forgotPasswordForm.value;
    const body = {
      user_email: user_email
    }

    this.authService.forgotPassword(body).subscribe((resp) => {
      this.isLoading = false;
      this.resultObject = resp.body;
      if (this.resultObject.hasOwnProperty('success')) {
        this.toastrService.success('Temporary password is sent to the given Email-id.');
        this.router.navigate(['/home']);
      } else if (this.resultObject.hasOwnProperty('failure')) {
        this.toastrService.error('Email Id does not match');
      }

    }, () => {
      this.isLoading = false;
      this.toastrService.error('Invalid details');
    });
  }

}
