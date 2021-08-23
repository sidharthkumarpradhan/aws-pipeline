import { DotUserDetailsService } from './../../dot-user-details/dot-user-details.service';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { IDotUserDetails } from 'src/app/shared/model/dot-user-details.model';
import { HelperService } from 'src/app/shared/services/helper.service';
import { CustomValidator } from 'src/app/shared/validators/customValidator';
import { StudentHelperService } from '../../student-dashboard/student-helper.service';
import { DATE_TIME_FORMAT } from 'src/app/shared/constants/input.constants';
import * as moment from 'moment';
import { AuthState } from 'src/app/store/auth.model';
import { Store } from '@ngrx/store';
import { userInfo, userResponse } from 'src/app/store/auth.selector';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html'
})
export class PersonalInfoComponent implements OnInit, OnDestroy {
  @Input() userData;
  @Output() profileUpdated = new EventEmitter<string>();

  userId: string | number;
  dobMaxDate: any;
  isFormSubmitted: boolean = false;

  createProfileForm = this.fb.group({
    display_name: [{value: '', disabled: true}],
    user_phone_num: [null, [Validators.required, CustomValidator.AllowNumericOnly]],
    user_email: [{value: '', disabled: true}],
    user_dob: [null, [Validators.required]],
    gender: [null, [Validators.required]],
    school_name: [null, [Validators.required]],
    class_details: [null, [Validators.required]],
    user_about_me: [null, [Validators.required]]
  });

  constructor(
    private toastrService: ToastrService,
    public _uhs: HelperService,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder,
    private studentHelperService: StudentHelperService,
    private store: Store<AuthState>
  ) { }

  ngOnInit() {
    this.store.select(userResponse).subscribe(res => {
      if (res) {
        this.userId = res.id;
      }
    });

    this.dobMaxDate = this._uhs.getTodaysFormattedDate();
    if (this.userData) {
      this.updateForm(this.userData);
    }
  }

  updateForm(dotUserDetails: any): void {
    this.createProfileForm.patchValue({
      display_name: dotUserDetails.display_name,
      user_phone_num: dotUserDetails.user_phone_num,
      user_email: dotUserDetails.user_email,
      user_dob: dotUserDetails.user_dob ? this._uhs.getFormattedDateForAdminChall(this.userData.user_dob) : null,
      gender: dotUserDetails.gender,
      class_details: dotUserDetails.class_details,
      school_name: dotUserDetails.school_name,
      user_about_me: dotUserDetails.user_about_me
    });
  }

  profilemarkAsTouched() {
    Object.values(this.createProfileForm.controls).forEach((control: any) => {
      control.markAsTouched();
    });
  }

  saveProfile() {
    this.cd.detectChanges();
    if (!this.createProfileForm.valid) {
      this.profilemarkAsTouched();
      this.toastrService.warning('Please enter all required fields');
      return false;
    }
    const userData = this.createProfileForm.value;
    userData.user_id = this.userId;
    userData.user_dob = this._uhs.getFormattedDateToBind(userData.user_dob) + 'T00:00';
    console.log(userData);
    this.isFormSubmitted = true;
    this.studentHelperService.updateUserProfile(userData).subscribe(res => {
      this.isFormSubmitted = false;
      this.cd.detectChanges();
      this.toastrService.success('Profile updated successfully');
      this.profileUpdated.emit(res);
    }, err => {
      this.cd.detectChanges();
      this.isFormSubmitted = false;
      this.toastrService.error('Something went wrong');
    });
  }
  ngOnDestroy() {
    this.cd.detach();
  }

}
