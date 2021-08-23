import {ERROR_MESSAGE} from 'src/app/shared/constant';
import {UploadService} from './../../modules/upload.service';
import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {
  @Input() data;
  isLoading: boolean;
  imageName = [];
  imageSaveBtnDisable = true;
  allowedFileTypes = ['image/png', 'image/jpeg', 'image/webp'];
  maxFileSize = 2097152;
  minFileSize5KB = 5120;
  headerName: string;
  imageAllowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
  fileAccepts: string;
  fileType: string;
  fileErrorName: string;
  validationInfo: string;
  fileSupport = '';

  constructor(
    private toastrService: ToastrService,
    public modal: NgbActiveModal,
    private uploadService: UploadService
  ) { }

  ngOnInit() {
    this.headerName = this.data.headerName;
    this.fileType = this.data.fileType;
    this.validationInfo = this.data.validationInfo;
    this.checkAllowTypesFiles(this.fileType);
  }

  checkAllowTypesFiles(fileType: string): void {
    const userType = sessionStorage.getItem('userType');

    const videoAllowedTypes = ['video/mp4', 'video/avi', 'video/quicktime', 'video/mpeg'];

    if (fileType === 'image') {
      this.fileSupport = 'JPEG, PNG';
      this.fileAccepts = 'image/*';
      this.allowedFileTypes = this.imageAllowedTypes;
      this.maxFileSize = (userType === 'admin') ? 20971520 : 2097152; // 20 MB and 2MB
      this.fileErrorName = 'an Image';
    } else if (fileType === 'video') {
      this.fileSupport = 'MP4';
      this.fileAccepts = 'video/*';
      this.maxFileSize = (userType === 'admin') ? 1073741824 : 5242880; // 1GB and 5mb
      this.allowedFileTypes = [...videoAllowedTypes];
      this.fileErrorName = 'a Video File';
    } else if (fileType === 'audio') {
      this.fileSupport = 'MP3';
      this.fileAccepts = 'audio/*';
      this.allowedFileTypes = ['audio/mp3', 'audio/mpeg'];
      this.maxFileSize = (userType === 'admin') ? 20971520 : 2097152;
      this.fileErrorName = 'an Audio file';
    } else if (fileType === 'doc') {
      this.fileSupport = 'Doc';
      this.fileAccepts = '.doc,.docx, application/msword, application/vnd.ms-excel,text/plain, application/pdf';
      this.allowedFileTypes = ['application/msword', 'application/vnd.ms-excel', 'text/plain', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      this.maxFileSize = (userType === 'admin') ? 20971520 : 2097152;
      this.fileErrorName = 'a Documnet file';
    } else if (fileType === 'image&video') {
      this.fileSupport = 'JPEG, PNG, MP4';
      this.fileAccepts = 'image/*, video/*';
      this.allowedFileTypes = [...videoAllowedTypes, ...this.imageAllowedTypes];
      this.maxFileSize = (userType === 'admin') ? 1073741824 : 5242880; // 1GB and 5mb
      this.fileErrorName = 'a Image/Video file';
    }
  }

  onSelectFile(event: any): void {
    let files = [];
    //  this.imageName = [];
    const sizeInMB = (this.maxFileSize / (1024 * 1024)).toFixed(2);
    if (event.target) {
      files = event.target.files;
    } else {
      files = event;
    }
    if (this.headerName === 'Profile Pic') {
      this.imageName = [];
    }
    if (files && files.length) {
      Array.from(files).forEach((file) => {
        if (this.allowedFileTypes.indexOf(file.type) === -1) {
          this.toastrService.warning('Please select valid File / Format');
        } else if (file.size && file.size > this.maxFileSize) {
          this.toastrService.warning('File size should be less than ' + sizeInMB + 'MB');
          setTimeout(() => {
          }, 1500);
        } else if (!this.validateFileName(file.name)) {
          this.toastrService.warning('Invalid Filename. Only underscore and hyphen special characters are allowed in a Filename.');
        } else if (file.name) {
          let fileExtension = file.name.split('.').pop();
          if (fileExtension.match(/(jpg|jpeg|png|gif)$/i)) {
            fileExtension = 'image';
          }
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            this.imageName.push({file: file, source: reader.result, name: file.name, fileType: fileExtension});
        }
      }
      });

    }

  }

  validateFileName(name: string): any {
    return name.match(/^[0-9a-zA-Z\_\-. ()]+$/);
  }

  onInputClick(event: any): any {
    const element = event.target as HTMLInputElement;
    element.value = '';
  }

  removeUpload(i) {
    this.imageName = this.imageName.filter((item, index) => index !== i)
  }

  saveImage() {
    if (!(this.imageName && this.imageName.length)) {
      this.toastrService.error(`Please select ${this.fileErrorName}`);
      return false;
    }
    this.isLoading = true;
    this.imageSaveBtnDisable = true;
    if (this.data.fileCategory === 'dot_coin_badge') {
      this.dotCoionUpload();
    } else if (this.data.fileCategory === 'skill') {
      this.skillUpload();
    } else {
      this.challengeFileUpload();
    }

  }

  dotCoionUpload() {
    const files = this.imageName.map(res => res.file);
    this.uploadService.uploadDotCoinBadge(files).subscribe((resp) => {
      this.imageSaveBtnDisable = false;
      if (resp) {
        this.toastrService.success(ERROR_MESSAGE.FILE_UPLOADED);
        const reason = this.buildImageArray(resp);
        this.modal.dismiss(reason);
      }
      console.log(resp);
      this.isLoading = false;
    }, err => {
      this.isLoading = false;
      this.imageSaveBtnDisable = false;
    });
  }

  buildImageArray(resp: any): any {
    const imageArray = [];
    if (resp && resp.length) {
      resp.forEach(element => {
         const imageObj = {
           name: this.imageName.find(img => img.file.name === element.display_name).name,
           file: element.file
         }
         imageArray.push(imageObj);
      });
    }
    return imageArray;
  }

  skillUpload() {
    const files = this.imageName.map(res => res.file);
    this.uploadService.uploadDocument(files, this.data.fileCategory).subscribe((resp) => {
      this.imageSaveBtnDisable = false;
      if (resp) {
        this.toastrService.success(ERROR_MESSAGE.FILE_UPLOADED);
        const reason = this.buildImageArray(resp);
        this.modal.dismiss(reason);
      }
      console.log(resp);
      this.isLoading = false;
    }, err => {
      this.isLoading = false;
      this.imageSaveBtnDisable = false;
    });
  }

  challengeFileUpload() {
    const files = this.imageName.map(res => res.file);
    this.uploadService.uploadDocument(files, this.data.fileCategory).subscribe((resp) => {
      this.imageSaveBtnDisable = false;
      if (resp) {
        this.toastrService.success(ERROR_MESSAGE.FILE_UPLOADED);
        const reason = this.buildImageArray(resp);
        this.modal.dismiss(reason);
      }
      this.isLoading = false;
    }, err => {
      this.isLoading = false;
      this.imageSaveBtnDisable = false;
    });
  }

}
