import {UploadService} from 'src/app/shared/modules/upload.service';
import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {HelperService} from 'src/app/shared/services/helper.service';
import {StudentHelperService} from '../student-helper.service';
import {CommunicationService} from 'src/app/default/communication.services';
import {NgbActiveModal, NgbModal, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import {environment} from 'src/environments/environment';
import {DomSanitizer} from '@angular/platform-browser';
import {AuthState} from 'src/app/store/auth.model';
import {Store} from '@ngrx/store';
import {userInfo} from 'src/app/store/auth.selector';
import {SendMessagePopupComponent} from '../../../shared/component/send-message-popup/send-message-popup.component';
import {EditStudentProfileComponent} from '../edit-student-profile/edit-student-profile.component';
import {MyChallengesPopupComponent} from '../../../shared/component/my-challenges-popup/my-challenges-popup.component';
import {FileUploadComponent} from '../../../shared/component/file-upload/file-upload.component';

declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent implements OnInit, OnDestroy {
  @Input() data;
  isLoading: boolean;
  userDetails: any;
  mySkillsList: any[];
  myTalentsList: any = [];
  alluserDetails: any[];
  // userSkillDetails: any;
  birthdate: Date;
  age: number;
  searchValue: any;
  searchName: any;
  searchRes: any;
  searchPayload: any;
  isCheck: any;
  userId: any;
  fileName: any;
  checkListFriends: Boolean = false;
  dot_activitiesData: any;
  isMySkillsLoaded: boolean;
  isUsersLoading: boolean;
  filePath: string;
  fileType: string;
  mediaType: string;
  badges: number = 0;
  dotCoins: number = 0;
  totalChallengesCount: number = 0;
  filePathLocation: any;
  defaultImage = 'assets/img/upload-avatar.png';
  originalMyBuddies : any[];
  myNotificationList: any[] = [];
  myBuddiesFlag: Boolean = true;
  myNotificationsFlag: Boolean;
  myTalentsFlag: Boolean = true;
  myFavouritesFlag: Boolean;
  achievementsList: any;
  favourites: any[] = [];
  favouriteList: any[] = [];


  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    size: 'xl',
    windowClass: 'custom-modal edit-student-dashboard'
  };

  @Output() userInfoEmit = new EventEmitter<any>();
  displayBadgesPopup: boolean;
  displayDotcoinsPopup: boolean;
  badgesList: any;

  constructor(
    private uploadService: UploadService,
    private commService: CommunicationService,
    private studentHelperService: StudentHelperService,
    private toastrService: ToastrService,
    private cd: ChangeDetectorRef,
    public activeModal: NgbActiveModal,
    public _uhs: HelperService,
    private modalService: NgbModal,
    private sanitizer: DomSanitizer,
    private store: Store<AuthState>
  ) { }

  ngOnInit() {
    this.store.select(userInfo).subscribe(res => {
      if (res) {
        this.userId = res.user_id;
        this.userDetails = res;
      }
    });

    this.filePathLocation = environment.fileLocation;
    this.setProfilePic();
    this.userInfo();
    this.UserSkillsInfo();
    this.getMyBuddies();
    this.activities();
    this.getAchievements(this.userId);
    this.getBadges(this.userId);


    this.commService.currentProfilePic.subscribe(pic => {
      this.fileName = pic;
      this.cd.detectChanges();
    });
  }

  setProfilePic() {
    if (this.userDetails) {
      this.fileName = this.uploadService.getFileName(this.userDetails.avatar_image_file);
      this.age = this.getAge(this.userDetails.user_dob);
    }
  }

  getAge(dob): number {
    if (!dob) { return 0; }
    const timeDiff = Math.abs(Date.now() - new Date(dob).getTime());
    return Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
  }

  openEditStudentDashboard(currentPage?:string): void {
    const modalData = {
      usersList: this.originalMyBuddies,
      userDetails: this.userDetails,
      userSkills: this.mySkillsList
    };
    const modalRef = this.modalService.open(EditStudentProfileComponent, this.ngbModalOptions);
    modalRef.componentInstance.data = modalData;
    modalRef.componentInstance.currentPage = currentPage ? currentPage : 'personalInfo';
    modalRef.result.then((res) => {
      this.updateRecords(res);
    }, (reason) => {
      if (reason) {
        this.updateRecords(reason);
      }
    });
  }

  updateRecords(info) {
    if (info && info.userDetails) {
      this.userDetails = info.userDetails;
      this.age = this.getAge(this.userDetails.user_dob);
    }
    this.UserSkillsInfo();
  }

  closeModal() {
    this.activeModal.close();
  }

  userInfo() {
    this.studentHelperService.getUserInfo(this.userId).subscribe((resp) => {
      this.userDetails = resp;
      sessionStorage.setItem('st_details', JSON.stringify(this.userDetails));
      this.setProfilePic();
      this.userInfoEmit.emit(JSON.stringify(this.userDetails));
      this.cd.detectChanges();
    }, () => { });
  }

  getMyBuddies() {
    this.isUsersLoading = true;
    this.studentHelperService.getMyBuddies().subscribe((resp) => {
      this.alluserDetails = resp;
      this.originalMyBuddies = resp;
      this.calculateAge(this.alluserDetails);
      this.isUsersLoading = false;
      this.checkListFriends = true;
    }, () => {
      this.isUsersLoading = false;
      this.alluserDetails = [];
    });
  }

  buddiesListFilter() {
    this.isLoading = true;
    this.studentHelperService.buddyByGroup(this.userId).subscribe((resp) => {
      console.log('..... buddies by group', resp);
      this.alluserDetails = resp;
      this.calculateAge(this.alluserDetails);
      this.isLoading = false;
    }, () => {
      this.isLoading = false;
      console.log('error ......');
      this.toastrService.error('Unable to get users ');
    });
  }

  UserSkillsInfo() {
    this.isMySkillsLoaded = true;
    this.mySkillsList = [];
    this.myTalentsList = [];
    this.favouriteList = [];
    this.favourites = [];
    this.studentHelperService.getUserSkills().subscribe((resp) => {
      this.isMySkillsLoaded = false;
      if (resp && resp.length) {
        const talents = resp.filter(res => res.skill_category === 'Talents' && res.is_selected);
        const favourites = resp.filter(res => res.skill_category === 'Favourites' && res.is_selected);
        talents.forEach(element => {
          if (element.is_selected) {
            this.mySkillsList.push(element);
          }
          if (element.attachments) {
            element.attachments.forEach(ele => {
              const filename = environment.fileLocation + ele.file;
              let fileExtension = ele.file.split('.').pop();
              if (fileExtension.match(/(jpg|jpeg|png|gif)$/i)) {
                fileExtension = 'image';
              }
              const file = { filePath: filename, fileType: fileExtension }
              this.myTalentsList.push(file);
            });

          }
        });
        favourites.forEach(element => {
          if (element.is_selected) {
            this.favourites.push(element);
          }
          if (element.attachments) {
            element.attachments.forEach(ele => {
              const filename = environment.fileLocation + ele.file;
              let fileExtension = ele.file.split('.').pop();
              if (fileExtension.match(/(jpg|jpeg|png|gif)$/i)) {
                fileExtension = 'image';
              }
              const file = { filePath: filename, fileType: fileExtension }
              this.favouriteList.push(file);
            });

          }
        });
        this.safeUrl();
      }

    }, () => {
      this.isMySkillsLoaded = false;
      this.mySkillsList = [];
    });
  }

  safeUrl(): any {
    if (this.myTalentsList.length) {
      this.myTalentsList.forEach(element => {
        if (element.fileType === 'mp3') {
          element['loading'] = true;
          element['content'] = this.sanitizer.bypassSecurityTrustResourceUrl(element.filePath);
        }
      });
    }
    if (this.favouriteList.length) {
      this.favouriteList.forEach(element => {
        if (element.fileType === 'mp3') {
          element['loading'] = true;
          element['content'] = this.sanitizer.bypassSecurityTrustResourceUrl(element.filePath);
        }
      });
    }
  }

  activities() {
    this.studentHelperService.dot_activities().subscribe((resp) => {
      this.dot_activitiesData = resp;
      this.cd.detectChanges();
    }, () => {
      this.dot_activitiesData = {Challenge: 0, Quest: 0, daily_dots: 0};
    });
  }

  getAchievements(userId) {
    this.studentHelperService.getAchievements(userId).subscribe(result => {
      if (result && result.length) {
        this.achievementsList = result[0];
        this.badges = result[0].winning_badges_count;
        this.dotCoins = result[0].total_dot_coins;
        this.totalChallengesCount = result[0].total_challenges_count;
      }
    });
  }

  getBadges(userId): void {
    this.studentHelperService.getBadges(userId).subscribe(res => {
      this.badgesList = res;
    });
  }

  calculateAge(alluserDetails) {
    const allusers = alluserDetails;
    allusers.forEach(user => {
      user.userdob = this.getAge(user.date_of_creation);
    });
  }

  onChangeValue(value) {
    this.alluserDetails = this.originalMyBuddies.filter(item => {
      if (this.searchName.trim() === '') {
        return true;
      } else {
        return item.display_name != null && item.display_name.toLowerCase().includes(this.searchName.trim().toLocaleLowerCase());
      }
    })
  }

  searchBy(selectionValue) {
    this.cd.detectChanges();
    this.searchValue = selectionValue;
  }

  searchByCatagory() {
    this.isLoading = true;
    if (this.searchValue == undefined || this.searchName == undefined) {
      this.toastrService.warning('Please provide search criteria');
      this.isLoading = false;
      return false;
    }
    this.isLoading = true;
    jQuery('#buddiesSearchModal').modal('show');
    if (this.searchValue === 'school') {
      this.isCheck = this.searchValue;
      this.searchPayload = {
        school_name: this.searchName
      };
    } else if (this.searchValue === 'class') {
      this.isCheck = this.searchValue;
      this.searchPayload = {
        class_details: this.searchName
      };
    } else if (this.searchValue === 'name') {
      this.isCheck = this.searchValue;
      this.searchPayload = {
        display_name: this.searchName
      };
    } else if (this.searchValue === 'skill') {
      this.isCheck = this.searchValue;
      this.searchPayload = {
        skill: this.searchName
      };
    } else if (this.searchValue === 'age') {
      this.isCheck = this.searchValue;
      this.searchPayload = {
        age: this.searchName
      };
    }
    this.studentHelperService.searchByValue(this.searchPayload).subscribe((resp) => {
      this.searchRes = resp;
      this.isLoading = false;
      $('#buddiesSearchModal').modal('show');
      $('#studentDashboardModal').modal('hide');
    }, () => {
      this.isLoading = false;
      this.toastrService.error('Unable to get ');
    });
  }

  backTo() {
    $('#buddiesSearchModal').modal('hide');
    $('#studentDashboardModal').modal('show');
    this.searchName = this.searchName;
  }

  onImgError(event) {
    event.target.src = this.defaultImage;
  }

  getImageName(imageLink, index) {
    if (imageLink) { return 'assets/img/friend-' + index + '.png'; }
    return this.uploadService.getFileName(imageLink);
  }

  ngOnDestroy() {
    this.cd.detach();
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
    this.modalService.open(content, { size: 'md' });
  }

  openMyBuddies() {
    this.myNotificationsFlag = false;
    this.myBuddiesFlag = true;
  }

  openMyNotifications() {
    this.myBuddiesFlag = false;
    this.myNotificationsFlag = true;
    // call notification service
  }

  openMyTalents() {
    this.myFavouritesFlag = false;
    this.myTalentsFlag = true;
  }

  openMyFavourites() {
    this.myTalentsFlag = false;
    this.myFavouritesFlag = true;
  }

  openMessagePopup(userDetails) {
    const modalRef = this.modalService.open(SendMessagePopupComponent, {
      keyboard: false
    });
    modalRef.componentInstance.data = userDetails;
    // modalRef.result.then((res) => {
    // });
  }

  openMyChallengesPopup() {
    const myChallengeDetails = {
      badges: this.badges,
      dotcoins: this.dotCoins
    };
    const modalRef = this.modalService.open(MyChallengesPopupComponent, {
      keyboard: false,
      size: 'xl'
    });
    modalRef.componentInstance.data = myChallengeDetails;
    // modalRef.result.then((res) => {
    // });
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
            user_id: this.userId
          };
          this.studentHelperService.updateUserProfile(payload).subscribe(res => {
            this.userDetails = res;
          });
        }
      }
    });
  }
}
