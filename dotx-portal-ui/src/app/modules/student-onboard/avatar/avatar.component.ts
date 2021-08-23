import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FileUploadComponent } from 'src/app/shared/component/file-upload/file-upload.component';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { StudentHelperService } from '../../student-dashboard/student-helper.service';
import { ICON_AVATAR } from 'src/app/shared/constant';
import { AuthState } from 'src/app/store/auth.model';
import { Store } from '@ngrx/store';
import { userInfo, userResponse } from 'src/app/store/auth.selector';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html'
})
export class AvatarComponent implements OnInit, OnDestroy {
  @Input() userAvatar;
  @Input() userData;
  @Output() avatarUpdate = new EventEmitter<string>();

  defaultImage = 'assets/img/upload-avatar.png';
  userProfilePic: string;
  ctrlName1 = 'radioCtrl1';
  ctrlName2 = 'radioCtrl2';
  ctrlName3 = 'radioCtrl3';
  femaleAvatars = ICON_AVATAR.femaleAvatars;
  maleAvatars = ICON_AVATAR.maleAvatars;
  otherAvatars = ICON_AVATAR.otherAvatars;

  createAvatarForm = this.fb.group({
    gender: ['', [Validators.required]],
    avatar_image_file: [null, [Validators.required]],
  });
  selectedAvatar: string;
  userId;
  isFormSubmitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private cd: ChangeDetectorRef,
    private studentHelperService: StudentHelperService,
    private modalService: NgbModal,
    private store: Store<AuthState>
  ) { }

  ngOnInit() {
    this.store.select(userResponse).subscribe(res => {
      if (res) {
        this.userId = res.id;
      }
    });
    this.userProfilePic = this.userAvatar;

    if (this.userData) {
      this.updateProfileForm(this.userData);
    }
  }

  updateProfileForm(user: any) {
    this.createAvatarForm.patchValue({
      gender: user.gender,
      avatar_image_file: user.avatar_image_file,
    });
  }

  selectAvatar(avatar: string): void {
    this.selectedAvatar = avatar;
    this.userProfilePic = 'assets/img/' + avatar;
    this.createAvatarForm.controls.avatar_image_file.setValue(avatar);
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
        this.createAvatarForm.patchValue({
          avatar_image_file: fileName
        });
        this.cd.detectChanges();
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
    this.cd.detectChanges();
    if (!this.createAvatarForm.valid) {
      this.toastrService.warning('Please select gender and avatar');
      return false;
    }
    const userData = this.createAvatarForm.value;
    userData.user_id = this.userId;
    this.isFormSubmitted = true;
    this.studentHelperService.updateUserProfile(userData).subscribe(res => {
      this.isFormSubmitted = false;
      this.cd.detectChanges();
      this.toastrService.success('Your information updated successfully');
      if (res && res.avatar_image_file) {
        this.avatarUpdate.emit(res);
      }
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
