import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { HelperService } from 'src/app/shared/services/helper.service';
import { CustomValidator } from 'src/app/shared/validators/customValidator';
import { AuthState } from 'src/app/store/auth.model';
import { userInfo, userResponse } from 'src/app/store/auth.selector';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {
  createProfileForm: FormGroup;
  userInfo: any;
  userId: any;
  dobMaxDate: any;
  isLoading: boolean;
  constructor(private fb: FormBuilder,
              private store: Store<AuthState>,
              public _uhs: HelperService,
              private toasterService: ToastrService,
              private router: Router) {
    this.buildForm();
  }

  ngOnInit() {
    this.store.select(userResponse).subscribe(res => {
      if (res) {
        this.userId = res.id;
      }
    });
    this.getUserInfo();

  }

  getUserInfo(): void {
    this.isLoading = true;
    this._uhs.getUserDetails(this.userId).subscribe(res => {
      this.isLoading = false;
      if (res) {
        this.userInfo = res;
        this.updateForm();
      }
    }, () => this.isLoading = false)
  }

  buildForm(): void {
    this.dobMaxDate = this._uhs.getTodaysFormattedDate();
    this.createProfileForm = this.fb.group({
      display_name: [null, [Validators.required]],
      user_phone_num: [null, [Validators.required, CustomValidator.AllowNumericOnly]],
      user_email: ['', [Validators.required]],
      user_dob: ['', [Validators.required]],
      class_details: [null, [Validators.required]],
      gender: ['Male', [Validators.required]],
      school_name: ['', [Validators.required]],
    });
  }
  updateForm(): void {
    this.createProfileForm.patchValue({
      display_name: this.userInfo.display_name,
      user_phone_num: this.userInfo.user_phone_num,
      user_email: this.userInfo.user_email,
      user_dob: this.userInfo.user_dob ? this._uhs.getFormattedDateForAdminChall(this.userInfo.user_dob) : null,
      gender: this.userInfo.gender,
      class_details: this.userInfo.class_details,
      school_name: this.userInfo.school_name
    });
  }
  profilemarkAsTouched() {
    Object.values(this.createProfileForm.controls).forEach((control: any) => {
      control.markAsTouched();
    });
  }

  submitCreateProfile(): void {
    if (!this.createProfileForm.valid) {
      this.profilemarkAsTouched();
      this.toasterService.warning('Please enter all required fields');
    } else {
      const userData = this.createProfileForm.value;
      userData.user_id = this.userId;
      userData.user_dob = this._uhs.getFormattedDateToBind(userData.user_dob) + 'T00:00';
      console.log(userData);
      this.isLoading = true;
      this._uhs.updateUserProfile(userData).subscribe(res => {
        this.isLoading = false;
        this.toasterService.success('Profile updated successfully');
        this.router.navigateByUrl('main-route/student-onboard/avatar');
      }, err => {
        this.isLoading = false;
        this.toasterService.error('Something went wrong');
      });
    }
  }
  backToOnBoarding(): void {
    this.router.navigateByUrl('main-route/student-onboard/about-dotx')
  }
}
