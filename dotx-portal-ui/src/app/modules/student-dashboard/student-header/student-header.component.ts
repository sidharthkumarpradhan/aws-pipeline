import {StudentDashboardComponent} from './../student-dashboard/student-dashboard.component';
import {CommunicationService} from './../../../default/communication.services';
import {UploadService} from 'src/app/shared/modules/upload.service';
import {StudentHelperService} from 'src/app/modules/student-dashboard/student-helper.service';
import {Component, NgZone, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NgbActiveModal, NgbModal, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';
import {Subscription} from 'rxjs';
import {AuthState} from 'src/app/store/auth.model';
import {Store} from '@ngrx/store';
import {userInfo, userResponse} from 'src/app/store/auth.selector';
import {AuthLogout, SetUserDetail} from 'src/app/store/auth.action';
import {environment} from '../../../../environments/environment';

declare var jQuery: any;

@Component({
  selector: 'app-student-header',
  templateUrl: './student-header.component.html',
  styleUrls: ['./student-header.component.css']
})

export class StudentHeaderComponent implements OnInit {
  userInfo: any;
  userId: any;
  fileName: any;
  imgSrc: any;
  isLoading: boolean;
  usersList: any[];
  badges: number = 0;
  dotCoins: number = 0;
  subscription: Subscription[] = [];
  badgesList: any;
  filePathLocation = environment.fileLocation;

  imageUrl: string = 'assets/img/upload-avatar.png';
  defaultImage = 'assets/img/upload-avatar.png';
  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    size: 'xl',
    windowClass: 'custom-modal'
  };

  constructor(
    private route: Router,
    private uploadService: UploadService,
    private modalService: NgbModal,
    private studentHelperService: StudentHelperService,
    private toastrService: ToastrService,
    public activeModal: NgbActiveModal,
    private ngZone: NgZone,
    private communicationService: CommunicationService,
    private store: Store<AuthState>) { }

  ngOnInit() {
    this.store.select(userInfo).subscribe(res => {
      if (res) {
        this.userInfo = res;

      }
    });
    this.store.select(userResponse).subscribe(res => {
      if (res) {
        this.userId = res.id;
      }
    });
    this.getUserInfo();
    this.getBadgesList(this.userId);
    // jQuery('#header').addClass('expend');
    jQuery('.nav-normal-view .hamburger-menu').click(function () {
      jQuery('#header').addClass('expend');
    });
    jQuery('.nav-expend-view .hamburger-menu').click(function () {
      jQuery('#header').removeClass('expend');
    });

    this.getAllUsers();
    this.getAchievements(this.userId);
  }

  getUserInfo(): void {
    this.communicationService.currentProfilePic.subscribe(pic => this.imageUrl = pic);
    if (!this.userInfo) {
      this.setProfilePic();
    } else {
      this.getUserDetails();
    }
  }

  setProfilePic() {
    if (this.userInfo && this.userInfo.avatar_image_file) {
      this.imageUrl = this.uploadService.getFileName(this.userInfo.avatar_image_file);
      this.communicationService.changeprofileImage(this.imageUrl);
    }
  }

  getUserDetails() {
    this.studentHelperService.getUserInfo(this.userId).subscribe((resp) => {
      this.userInfo = resp;
      this.store.dispatch(new SetUserDetail(resp));
      this.setProfilePic();
    }, () => {
    });
  }

  getAchievements(userId) {
    this.studentHelperService.getAchievements(userId).subscribe(result => {
      if (result && result.length) {
        this.badges = result[0].winning_badges_count;
        this.dotCoins = result[0].total_dot_coins;
      }
    });
  }

  getAllUsers() {
    this.isLoading = true;
    this.studentHelperService.getAllUsers(this.userId).subscribe((resp) => {
      this.usersList = resp;
      // this.calculateAge(this.usersList);
      this.isLoading = false;
    }, () => {
      this.isLoading = false;
      this.usersList = [];
    });
  }

  userInfoEmitData(data: any): void {
    this.userInfo = data;
  }

  openDashboard() {
    const modalData = {
      alluserDetails: this.usersList
    };

    const modalRef = this.modalService.open(StudentDashboardComponent, this.ngbModalOptions);
    modalRef.componentInstance.data = modalData;
    /* modalRef.result.then((res) => {
      if (res) {this.reloadRecords();}
    }, (reason) => {
      if (reason) {
        this.reloadRecords();
      }
    }); */
  }


  logout(): void {
    sessionStorage.clear();
    if (this.subscription && this.subscription.length) {
      this.subscription.forEach(sub => sub.unsubscribe());
    }
    this.store.dispatch(new AuthLogout());
    this.route.navigate(['/home']);
  }

  onImgError(event) {
    event.target.src = this.defaultImage;
  }

  getBadgesList(userId): void {
    this.studentHelperService.getBadges(userId).subscribe(res => {
      this.badgesList = res;
    });
  }

}
