import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CommunicationService } from 'src/app/default/communication.services';
import { UploadService } from 'src/app/shared/modules/upload.service';
import { AuthState } from 'src/app/store/auth.model';
import { userInfo } from 'src/app/store/auth.selector';

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.css']
})
export class CreateProfileComponent implements OnInit {

  st_details: any;
  imageUrl: any;
  defaultImage = 'assets/img/upload-avatar.png';

  constructor(private router: Router, private uploadService: UploadService,
              private communicationService: CommunicationService,
              private store: Store<AuthState>) { }

  ngOnInit() {
    this.store.select(userInfo).subscribe(res => {
      if (res) {
        this.st_details = res;
      }
    });
    if (this.st_details) {
      this.setProfilePic();
    }
  }

  setProfilePic() {
    if (this.st_details && this.st_details.avatar_image_file) {
      this.imageUrl = this.uploadService.getFileName(this.st_details.avatar_image_file);
      this.communicationService.changeprofileImage(this.imageUrl);
    }
  }

  onImgError(event) {
    event.target.src = this.defaultImage;
  }

  goToDashboard() {
    if (this.st_details.is_temp_passwd == 1) {
      this.router.navigate(['auth/resetPassword']);
    } else if (this.st_details.is_temp_passwd == 0) {
      this.router.navigate(['main-route/student/home']);
    } else {
      sessionStorage.setItem('login_type', 'fromGoogle');
      this.router.navigate(['main-route/student/home']);
    }
    // this.router.navigate(['student/home']);
  }
}
