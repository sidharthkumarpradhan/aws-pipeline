import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Store} from '@ngrx/store';
import {ToastrService} from 'ngx-toastr';
import {FileUploadComponent} from 'src/app/shared/component/file-upload/file-upload.component';
import {ICON_AVATAR} from 'src/app/shared/constant';
import {HelperService} from 'src/app/shared/services/helper.service';
import {AuthState} from 'src/app/store/auth.model';
import {userResponse} from 'src/app/store/auth.selector';
import {environment} from 'src/environments/environment';

@Component({
  selector: 'app-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss']
})
export class UserAvatarComponent implements OnInit {

  userAvatar;
  userData;

  defaultImage = 'assets/img/upload-avatar.png';
  userProfilePic: string;
  ctrlName1 = 'radioCtrl1';
  ctrlName2 = 'radioCtrl2';
  ctrlName3 = 'radioCtrl3';
  femaleAvatars = ICON_AVATAR.femaleAvatars;
  maleAvatars = ICON_AVATAR.maleAvatars;
  otherAvatars = ICON_AVATAR.otherAvatars;

  createProfileForm = this.fb.group({
    gender: [''],
    avatar_image_file: [null, [Validators.required]],
  });
  selectedAvatar: string;
  userId: any;
  isLoading = false;
  personalInfoDashboard: any;
  filePathLocation = environment.fileLocation;

  constructor(
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private helperService: HelperService,
    private store: Store<AuthState>,
    private router: Router,

  ) { }

  ngOnInit() {
    this.store.select(userResponse).subscribe(res => {
      if (res) {
        this.userId = res.id;
      }
    });
    this.userProfilePic = this.userAvatar;
    this.getUserInfo();
  }
  getUserInfo(): void {
    this.isLoading = true;
    this.helperService.getUserDetails(this.userId).subscribe(res => {
      this.isLoading = false;
      if (res) {
        this.userData = res;
        this.updateProfileForm(this.userData);
      }
    }, () => this.isLoading = false)
  }

  updateProfileForm(user: any) {
    this.createProfileForm.patchValue({
      gender: user.gender,
      avatar_image_file: user.avatar_image_file,
    });
    if (user.avatar_image_file) {
      this.userProfilePic = this.filePathLocation + user.avatar_image_file;
    }

  }

  selectAvatar(avatar: string): void {
    this.selectedAvatar = avatar;
    this.userProfilePic = 'assets/img/' + avatar;
    this.createProfileForm.controls.avatar_image_file.setValue(avatar);
  }

  onImgError(event) {
    event.target.src = this.defaultImage;
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
        this.userProfilePic = this.setImage(fileName);
        this.createProfileForm.patchValue({
          avatar_image_file: fileName
        });
      }
    });
  }

  setImage(fileName: string): string {
    return (this.validUrl(fileName)) ? fileName : `${environment.fileLocation}${fileName}`;
  }

  validUrl(link: string) {
    if (!link) { return false; }
    return (link.indexOf('http://') === 0 || link.indexOf('https://') === 0);
 }

  saveAvatar() {
    if (!this.createProfileForm.valid) {
      this.toastrService.warning('Please select gender and avatar');
      return false;
    }
    const userData = this.createProfileForm.value;
    userData.user_id = this.userId;
    this.isLoading = true;
    this.helperService.updateUserProfile(userData).subscribe(res => {
      this.isLoading = false;
      this.toastrService.success('Your information updated successfully');
      this.router.navigateByUrl('main-route/student-onboard/personality-quiz')
    }, err => {
      this.isLoading = false;
      this.toastrService.error('Something went wrong');
    });
  }
  ngOnDestroy() {
  }



  backToProfile(): void {
    this.router.navigateByUrl('main-route/student-onboard/user-info')
  }

}
