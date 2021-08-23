import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {UploadService} from '../../../shared/modules/upload.service';
import {CommunicationService} from '../../../default/communication.services';
import {FileUploadComponent} from '../../../shared/component/file-upload/file-upload.component';
import {StudentHelperService} from '../student-helper.service';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-edit-student-profile',
  templateUrl: './edit-student-profile.component.html',
  styleUrls: ['./edit-student-profile.component.scss']
})
export class EditStudentProfileComponent implements OnInit {

  @Input() data;
  isLoading: boolean;
  filePathLocation = environment.fileLocation;
  currentPage = 'personalInfo';
  userDetails: any;
  fileName: string;
  age: number;
  view: any = 'personalInfo';
  defaultImage = 'assets/img/upload-avatar.png';
  updatedDetails: any = {};
  filePath: any;
  fileType: string;
  mediaType: string;

  constructor(private activeModal: NgbActiveModal, private uploadService: UploadService,
              private commService: CommunicationService, private modalService: NgbModal, private studentHelperService: StudentHelperService) {
  }

  ngOnInit() {
    this.userDetails = this.data.userDetails;
    this.age = this.getAge(this.userDetails.user_dob);
    this.fileName = this.uploadService.getFileName(this.userDetails.avatar_image_file);
  }

  getAge(dob): number {
    if (!dob) {
      return 0;
    }
    const timeDiff = Math.abs(Date.now() - new Date(dob).getTime());
    return Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
  }

  onImgError(event) {
    event.target.src = this.defaultImage;
  }

  closeModal() {
    this.activeModal.close(this.updatedDetails);
  }

  userInfoUpdate(userinfo: string) {
    this.userDetails = userinfo;
    this.age = this.getAge(this.userDetails.user_dob);
    this.updatedDetails.userDetails = userinfo;
    sessionStorage.setItem('st_details', JSON.stringify(userinfo));
  }

  avatarUpdate(userinfo: any): void {
    const imagePath = this.uploadService.getFileName(userinfo.avatar_image_file);
    this.fileName = imagePath;
    this.commService.changeprofileImage(imagePath);
    this.updatedDetails.userDetails = userinfo;
    sessionStorage.setItem('st_details', JSON.stringify(userinfo));
  }

  openDocument(content, item) {
    this.filePath = item.filePath;
    if (item.fileType === 'mp4') {
      this.fileType = `video`;
      this.mediaType = 'video/mp4';
    } else if (item.fileType === 'mp3') {
      this.fileType = 'audio';
      this.mediaType = 'audio/mp3';
    } else {
      this.fileType = 'image';
    }
    this.modalService.open(content, {size: 'md'});
  }

  openBioVideo(content, item, type): void {
    const data = {
      filePath: this.filePathLocation + item,
      fileType: type
    };
    this.openDocument(content, data);
  }

  uploadBioVideo() {
    const modalData = {
      headerName: 'Bio',
      fileType: 'video',
      fileCategory: 'skill'
    };
    const modalRef = this.modalService.open(FileUploadComponent, {
      centered: true,
      backdrop: 'static',
      size: 'lg'
    });
    modalRef.componentInstance.data = modalData;
    modalRef.result.then((reason) => {
      if (reason) {
      }
    }, (reason) => {
      if (reason) {
        if (reason && reason.length) {
          const payload = {
            user_bio_video_file: reason[0].file,
            user_id: this.userDetails.user_id
          };
          this.studentHelperService.updateUserProfile(payload).subscribe(res => {
            this.userDetails = res;
          });
        }
      }
    });
  }
}
