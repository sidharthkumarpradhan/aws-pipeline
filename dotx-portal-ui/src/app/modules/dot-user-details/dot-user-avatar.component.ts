import { CommunicationService } from './../../default/communication.services';
import { HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { FileUploadComponent } from 'src/app/shared/component/file-upload/file-upload.component';
import { DATE_TIME_FORMAT } from 'src/app/shared/constants/input.constants';
import { ICON_AVATAR } from 'src/app/shared/constant';
import { DotUserDetails, IDotUserDetails } from 'src/app/shared/model/dot-user-details.model';
import { UploadService } from 'src/app/shared/modules/upload.service';
import { CustomDateParserFormatterService } from 'src/app/shared/services/custom-date-parser-formatter.service';
import { HelperService } from 'src/app/shared/services/helper.service';
import { CustomValidator } from 'src/app/shared/validators/customValidator';
import { environment } from 'src/environments/environment';
import { StudentHelperService } from '../student-dashboard/student-helper.service';
import { DotUserDetailsService } from './dot-user-details.service';
import { AuthState } from 'src/app/store/auth.model';
import { Store } from '@ngrx/store';
import { userInfo } from 'src/app/store/auth.selector';
import { SetUserDetail } from 'src/app/store/auth.action';

export let browserRefresh = false;

@Component({
  selector: 'app-dotUser-avatar',
  templateUrl: './dot-user-avatar.component.html',
  styleUrls: ['./dot-user-avatar.component.css'],
  providers: [{ provide: NgbDateParserFormatter, useClass: CustomDateParserFormatterService }]
})
export class dotUserAvatarComponent implements OnInit {

  ctrlName1 = 'radioCtrl1';
  ctrlName2 = 'radioCtrl2';
  ctrlName3 = 'radioCtrl3';
  @Input() userAvatar;
  @Input() applyCssAvatar: boolean;
  isLoading: boolean;
  userData: any;
  showProfileForm: any;
  personalInfoDashboard: any;
  userId: number;
  class_details: any;
  subscription: Subscription;
  userProfilePic: string | ArrayBuffer;
  defaultImage = 'assets/img/upload-avatar.png';
  imgIcon = 'assets/img/img_icon.png';
  videoIcon = 'assets/img/video_icon.png';
  selectedAvatar: string;
  navigationParams: NavigationExtras = {
    queryParams: {
      path: 'quizOne',
      typeOf: 'personality'
    }
  };
  femaleAvatars = ICON_AVATAR.femaleAvatars;
  maleAvatars = ICON_AVATAR.maleAvatars;
  otherAvatars = ICON_AVATAR.otherAvatars;

  createProfileForm = this.fb.group({

    displayName: [null, [Validators.required]],
    gender: ['Female', [Validators.required]],
    userPhoneNum: [null, [Validators.required, CustomValidator.AllowNumericOnly]],
    userEmail: ['', [Validators.required]],
    userDob: ['', [Validators.required]],
    schoolName: [null, [Validators.required]],
    classDetails: [null, [Validators.required]],
    avatarImageFile: [null],
  });


  constructor(
    private toastrService: ToastrService,
    public _uhs: HelperService,
    protected dotUserDetailsService: DotUserDetailsService,
    protected activatedRoute: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder,
    private uploadService: UploadService,
    private communicationService: CommunicationService,
    private studentHelperService: StudentHelperService,
    private router: Router,
    private modalService: NgbModal,
    private store: Store<AuthState>) {

  }

  ngOnInit() {
    this.isLoading = true;
    this.personalInfoDashboard = this.userAvatar;
    this.navigationExtras();
    this.userProfilePic = 'assets/img/upload-avatar.png';
    this.showProfileForm = 'avatar';
    this.store.select(userInfo).subscribe(res => {
      if (res) {
        this.userId = res.user_id ? res.user_id : res.userId ? res.userId : undefined;
      }
    });
    const { handleUserAvatar } = this.studentHelperService;
    if (handleUserAvatar.observers.length === 0) {
      this.studentHelperService.handleUserAvatar.subscribe(resp => {
        if (resp) {
          this.showProfileForm = 'avatar';
          this.personalInfoDashboard = resp;
          this.ctrlName1 = 'radioCtrl4';
          this.ctrlName2 = 'radioCtrl5';
          this.ctrlName3 = 'radioCtrl6';
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
          this.updateForm(this.userData);
        });
    });
  }

  selectAvatar(avatar: string): void {
    this.selectedAvatar = avatar;
    this.userProfilePic = 'assets/img/' + avatar;
    this.createProfileForm.controls.avatarImageFile.setValue(avatar);
  }


  navigationExtras() {
    this.activatedRoute.queryParams.subscribe(params => {
      console.log('params', params)
      this.showProfileForm = params.path;
      this.cd.detectChanges();
      if (params.hasOwnProperty('fromGoogle')) {
        this.toastrService.success(' Account verified !');
      } else if (!params.hasOwnProperty('path')) {
        this.showProfileForm = 'avatar';
      }
    });
  }

  updateForm(dotUserDetails: IDotUserDetails): void {
    // this.formHeading = 'Edit';
    this.createProfileForm.patchValue({
      userId: dotUserDetails.userId,
      userCode: dotUserDetails.userCode,
      userType: dotUserDetails.userType,
      firstName: dotUserDetails.firstName,
      middleName: dotUserDetails.middleName,
      lastName: dotUserDetails.lastName,
      displayName: dotUserDetails.displayName,
      gender: dotUserDetails.gender,
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
      //   avatarImageFile: dotUserDetails.avatarImageFile,
      avatarImageFile: dotUserDetails.avatarImageFile ? dotUserDetails.avatarImageFile : '',
      createdBy: dotUserDetails.createdBy,
      createdDate: dotUserDetails.createdDate ? dotUserDetails.createdDate : null,
      lastmodifiedBy: dotUserDetails.lastmodifiedBy,
      lastmodifiedDate: dotUserDetails.lastmodifiedDate ? dotUserDetails.lastmodifiedDate : null,
      joincodeIdId: dotUserDetails.joincodeIdId,
    });
    const avatarPic = this.createProfileForm.controls.avatarImageFile.value;
    this.userProfilePic = (this.validUrl(avatarPic)) ? avatarPic : `${environment.fileLocation}${avatarPic}`;
    console.log(this.userProfilePic, 'profilepic');
    this.cd.detectChanges();
    this.isLoading = false;

  }

  moveToQuiz(): void {
    this.router.navigate(['main-route/quiz/detail'], this.navigationParams);
  }

  openAvatarModal() {
    const modalData = {
      headerName: 'Profile Pic',
      fileType: 'image'
    };

    const modalRef = this.modalService.open(FileUploadComponent, {
      centered: true,
      backdrop: 'static',
      size: 'lg',
      windowClass: 'file-modal'
    });
    modalRef.componentInstance.data = modalData;
    modalRef.result.then((res) => {
      console.log(res);
    }, (reason) => {
      if (reason && reason.length) {
        const fileName = reason[0].file;
        this.userProfilePic = (this.validUrl(fileName)) ? fileName : `${environment.fileLocation}${fileName}`;
        this.createProfileForm.patchValue({
          avatarImageFile: fileName
        });
        this.cd.detectChanges();
      }
    });
  }

  validUrl(link: string) {
    if (!link) { return false }
    return (link.indexOf('http://') === 0 || link.indexOf('https://') === 0);
  }


  onUpload(evt) {
    if (evt.target.files && evt.target.files[0]) {
      const file = evt.target.files[0];
      this.isLoading = true;
      this.uploadService.uploadDocument(file).subscribe((resp) => {
        console.log(resp);
        this.isLoading = false;
      }, err => console.log(err));
    }
  }

  submitCreateProfilemarkAsTouched() {
    Object.values(this.createProfileForm.controls).forEach((control: any) => {
      control.markAsTouched();
    });
  }


  save(): any {
    this.isLoading = true;
    if (!this.createProfileForm.valid) {
      this.submitCreateProfilemarkAsTouched();
      this.toastrService.warning('Please enter all required fields');
      this.isLoading = false;
      return false;
    }
    // this.isSaving = true;
    const dotUserDetails = this.createFromForm();
    if (dotUserDetails.userId !== undefined) {
      this.subscribeToSaveResponse(this.dotUserDetailsService.update(dotUserDetails));
    } else {
      this.subscribeToSaveResponse(this.dotUserDetailsService.create(dotUserDetails));
    }
  }

  private createFromForm(): IDotUserDetails {
    return {
      ...new DotUserDetails(),
      userId: this.userId,
      displayName: this.createProfileForm.get(['displayName']) ? this.createProfileForm.get(['displayName']).value : '',
      gender: this.createProfileForm.get(['gender']) ? this.createProfileForm.get(['gender']).value : '',
      userPhoneNum: this.createProfileForm.get(['userPhoneNum']) ? this.createProfileForm.get(['userPhoneNum']).value : '',
      userEmail: this.createProfileForm.get(['userEmail']) ? this.createProfileForm.get(['userEmail']).value : '',
      userDob: (this.createProfileForm.get(['userDob']) && this.createProfileForm.get(['userDob']).value) ?
         moment(this.createProfileForm.get(['userDob']).value).format(DATE_TIME_FORMAT)
        : undefined,
      schoolName: this.createProfileForm.get(['schoolName']) ? this.createProfileForm.get(['schoolName']).value : '',
      classDetails: this.createProfileForm.get(['classDetails']) ? this.createProfileForm.get(['classDetails']).value : '',
      avatarImageFile: this.createProfileForm.get(['avatarImageFile']) ? this.createProfileForm.get(['avatarImageFile']).value : '',
    };
  }


  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDotUserDetails>>): void {
    result.subscribe(
      () => this.onSaveSuccess(result),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(result) {
    const fileSource = result.source.source.source.value.body.avatarImageFile;
    const msg = this.createProfileForm.get(['userId']) && this.createProfileForm.get(['userId']).value ? 'Updated' : 'Created';
    if (this.personalInfoDashboard === 'userAvatar') {
      this.toastrService.success(`Profile Updated Successfully`);
      this.userProfilePic = (this.validUrl(fileSource)) ? fileSource : environment.fileLocation + fileSource;
      this.communicationService.changeprofileImage(this.userProfilePic);
      this.isLoading = false;
      this.cd.detectChanges();
      this.getUserInfo();

      return false;
    } else {
      this.toastrService.success(`Profile ${msg} Successfully`);
      this.isLoading = false;
      this.moveToQuiz();
    }

  }

  protected onSaveError(): void {
    this.isLoading = false;
    this.cd.detectChanges();
  }

  avatarSkip() {
    this.router.navigate(['main-route/quiz/detail'], this.navigationParams);
  }

  backToProfile() {
    this.router.navigate(['main-route/user/userDetails']);
  }
  onImgError(event) {
    event.target.src = this.defaultImage;
  }
  getUserInfo(): void {
    this.studentHelperService.getUserInfo(this.userId).subscribe((resp) => {
      this.store.dispatch(new SetUserDetail(resp));
    }, () => { });
  }
}
