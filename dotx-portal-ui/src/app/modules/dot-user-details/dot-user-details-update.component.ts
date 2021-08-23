import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'src/app/shared/constants/input.constants';

import { IDotUserDetails, DotUserDetails } from 'src/app/shared/model/dot-user-details.model';
import { DotUserDetailsService } from './dot-user-details.service';
import { IDotJoincodeDetails } from 'src/app/shared/model/dot-joincode-details.model';
import { NgbDateParserFormatter, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { CustomDateParserFormatterService } from 'src/app/shared/services/custom-date-parser-formatter.service';
import { HelperService } from 'src/app/shared/services/helper.service';
import { CustomValidator } from 'src/app/shared/validators/customValidator';
import { StudentHelperService } from '../student-dashboard/student-helper.service';
import { PrivacyPolicyComponent } from 'src/app/shared/layout/privacy-policy/privacy-policy.component';
import { AuthState } from 'src/app/store/auth.model';
import { Store } from '@ngrx/store';
import { userInfo } from 'src/app/store/auth.selector';
import { SetUserDetail } from 'src/app/store/auth.action';

@Component({
  selector: 'app-dot-user-details-update',
  templateUrl: './dot-user-details-update.component.html',
  styleUrls: ['./dot-user-details-update.component.css'],
  providers: [{ provide: NgbDateParserFormatter, useClass: CustomDateParserFormatterService }]
})
export class DotUserDetailsUpdateComponent implements OnInit {

  @Input() personalInfo: any;
  enableAvatar: any;

  personalInfoDashboard: any;

  fromDashboard: any;
  isSaving = false;
  formHeading = 'Create';
  dotUserDetails: IDotUserDetails[] = [];
  userData: any;
  showProfileForm: any = 'avatar';
  dobMaxDate: any;
  IsDisabled = false;
  isLoading = false;
  dotUserDetailsData: any;
  userProfilePic: string | ArrayBuffer;
  navigationParams: NavigationExtras = {
    queryParams: {
      path: 'quizOne',
      typeOf: 'personality'
    }
  };
  userId: any;

  createProfileForm = this.fb.group({
    displayName: [null, [Validators.required]],
    userPhoneNum: [null, [Validators.required, CustomValidator.AllowNumericOnly]],
    userEmail: ['', [Validators.required]],
    userDob: ['', [Validators.required]],
    schoolName: [null, [Validators.required]],
    classDetails: [null, [Validators.required]],
    gender: ['Male', [Validators.required]],
  });

  constructor(
    private toastrService: ToastrService,
    public _uhs: HelperService,
    protected dotUserDetailsService: DotUserDetailsService,
    protected activatedRoute: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder,
    private studentHelperService: StudentHelperService,
    private router: Router,
    private modalService: NgbModal,
    private store: Store<AuthState>
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.store.select(userInfo).subscribe(res => {
      if (res) {
        this.userId = res.user_id ? res.user_id : res.userId ? res.userId : undefined;
      }
    });
    this.personalInfoDashboard = this.personalInfo;
    this.navigationExtras();
    this.dobMaxDate = this._uhs.getTodaysFormattedDate();
    const { handleUserPersonalInfo } = this.studentHelperService;
    if (handleUserPersonalInfo.observers.length === 0) {
      this.studentHelperService.handleUserPersonalInfo.subscribe(resp => {
        if (resp) {
          this.showProfileForm = 'createProfile';
          this.personalInfoDashboard = resp;
          this.cd.detectChanges();
        }
      });
    }

    this.activatedRoute.data.subscribe(({ dotUserDetails }) => {
      this.dotUserDetailsService
        .find(this.userId)
        .pipe(map((subRes: HttpResponse<IDotUserDetails>) => {
          return subRes.body;
        })
        ).subscribe((subRes) => {
          this.store.dispatch(new SetUserDetail(subRes));
          this.userData = subRes;
          this.dotUserDetailsData = subRes;
          this.updateForm(this.userData);
        });
    });
  }


  navigationExtras() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.showProfileForm = params.path;
      this.cd.detectChanges();
      if (params.hasOwnProperty('fromGoogle')) {
        this.toastrService.success(' Account verified !');
      } else if (!params.hasOwnProperty('path')) {
        this.showProfileForm = 'createProfile';
      }
    });
  }

  updateForm(dotUserDetails: IDotUserDetails): void {
    this.formHeading = 'Edit';

    this.createProfileForm.patchValue({
      userId: dotUserDetails.userId,
      userCode: dotUserDetails.userCode,
      userType: dotUserDetails.userType,
      firstName: dotUserDetails.firstName,
      middleName: dotUserDetails.middleName,
      lastName: dotUserDetails.lastName,
      displayName: dotUserDetails.displayName,
      //   gender: dotUserDetails.gender,
      userPhoneNum: dotUserDetails.userPhoneNum,
      userEmail: dotUserDetails.userEmail ? dotUserDetails.userEmail : dotUserDetails.userGmail,
      userGmail: dotUserDetails.userGmail ? dotUserDetails.userEmail : null,
      userDob: dotUserDetails.userDob ? this._uhs.getFormattedDateToPrefill(dotUserDetails.userDob) : null,
      dateOfExit: dotUserDetails.dateOfExit ? dotUserDetails.dateOfExit : null,
      userLoginId: dotUserDetails.userLoginId,
      userPassword: dotUserDetails.userPassword,
      isTempPasswd: dotUserDetails.isTempPasswd,
      userLoginWithgmail: dotUserDetails.userLoginWithgmail,
      userLoginUserId: dotUserDetails.userLoginUserId,
      schoolName: dotUserDetails.schoolName,
      classDetails: dotUserDetails.classDetails,
      //  avatarImageFile: dotUserDetails.avatarImageFile,
      createdBy: dotUserDetails.createdBy,
      createdDate: dotUserDetails.createdDate ? dotUserDetails.createdDate : null,
      lastmodifiedBy: dotUserDetails.lastmodifiedBy,
      lastmodifiedDate: dotUserDetails.lastmodifiedDate ? dotUserDetails.lastmodifiedDate : null,
      joincodeIdId: dotUserDetails.joincodeIdId,
    });

    this.isLoading = false;
    if (dotUserDetails.userEmail != null || dotUserDetails.userGmail != null) {
      this.IsDisabled = true;
    } else {
      this.IsDisabled = false;
    }

  }

  moveToQuiz(): void {
    this.router.navigate(['main-route/user/userDetails/userAvatar']);
  }

  submitCreateProfilemarkAsTouched() {
    Object.values(this.createProfileForm.controls).forEach((control: any) => {
      control.markAsTouched();
    });
  }

  submitCreateProfile(): any {

    if (!this.createProfileForm.valid) {
      const { userEmail, displayName, userDob, userPhoneNum, schoolName, classDetails } = this.createProfileForm.value;
      if (userEmail !== '' && displayName !== '' && userDob !== '' && userDob !== null && userPhoneNum !== '' && schoolName !== '' && classDetails !== '') {
        this.cd.detectChanges();
        this.save();
      } else {
        this.submitCreateProfilemarkAsTouched();
        this.toastrService.warning('Please enter all required fields');
        return false;
      }
    } else {
      this.save();
    }
  }

  save(): any {
    const { userEmail, displayName, userDob, userPhoneNum, schoolName, classDetails, gender } = this.createProfileForm.value;
    this.isLoading = true;
    if (!this.createProfileForm.valid) {
      this.submitCreateProfilemarkAsTouched();
      this.toastrService.warning('Please enter all required fields');
      this.isLoading = false;
      return false;
    }
    const user_Dob = this._uhs.getFormattedDateToBind(userDob) + 'T00:00';
    const payload = {
      gender: this.createProfileForm.value.gender,
      class_details: classDetails,
      display_name: displayName,
      is_temp_passwd: this.dotUserDetailsData.isTempPasswd,
      school_name: schoolName,
      user_dob: user_Dob,
      user_email: userEmail,
      user_id: this.dotUserDetailsData.userId,
      user_login_user_id: this.dotUserDetailsData.userLoginUserId,
      user_login_withgmail: this.dotUserDetailsData.userLoginWithgmail,
      user_phone_num: userPhoneNum
    };
    this.subscribeToSaveResponse(this.dotUserDetailsService.update(payload));
  }

  private createFromForm(): IDotUserDetails {
    return {
      ...new DotUserDetails(),
      userId: this.userId,
      displayName: this.createProfileForm.get(['displayName'])!.value,
      //   gender: this.createProfileForm.get(['gender'])!.value,
      userPhoneNum: this.createProfileForm.get(['userPhoneNum'])!.value,
      userEmail: this.createProfileForm.get(['userEmail'])!.value,
      //  userGmail: this.createProfileForm.get(['userGmail'])!.value,
      userDob: this.createProfileForm.get(['userDob'])!.value
        ? moment(this.createProfileForm.get(['userDob'])!.value).format(DATE_TIME_FORMAT)
        : undefined,
      schoolName: this.createProfileForm.get(['schoolName'])!.value,
      classDetails: this.createProfileForm.get(['classDetails'])!.value,
      //  avatarImageFile: this.createProfileForm.get(['avatarImageFile'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDotUserDetails>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.isLoading = false;
    this.cd.detectChanges();
    const msg = this.createProfileForm.get(['userId']) && this.createProfileForm.get(['userId']).value ? 'Updated' : 'Created';

    if (this.personalInfoDashboard === 'personalInfo') {
      this.toastrService.success(`Profile Updated Successfully`);
      return false;
    } else {
      this.toastrService.success(`Profile ${msg} Successfully`);
      this.moveToQuiz();
    }

  }

  protected onSaveError(): void {
    this.isSaving = false;
    this.isLoading = false;

  }

  trackById(index: number, item: IDotJoincodeDetails): any {
    return item.id;
  }

  createProfileSkip() {
    this.router.navigate(['main-route/quiz/detail'], this.navigationParams);
  }

  backToOnBoarding() {
    this.router.navigate(['main-route/onBoarding']);
  }

  showPrivacyModal() {
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
    };
    this.modalService.open(PrivacyPolicyComponent, ngbModalOptions);
  }
}
