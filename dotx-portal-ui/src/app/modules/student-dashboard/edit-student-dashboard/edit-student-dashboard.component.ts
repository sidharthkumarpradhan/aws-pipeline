import {CommunicationService} from './../../../default/communication.services';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewContainerRef} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {StudentHelperService} from '../student-helper.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {UploadService} from 'src/app/shared/modules/upload.service';
import {environment} from 'src/environments/environment';

declare var $: any;

@Component({
  selector: 'app-edit-student-dashboard',
  templateUrl: './edit-student-dashboard.component.html',
  styleUrls: ['./edit-student-dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditStudentDashboardComponent implements OnInit, OnDestroy {
  @ViewChild('contain', { static: true }) contain: ViewContainerRef;
  @Input() data;

  alluserDetails: any[];
  userDetails: any;
  userSkills: any[];
  skillsList: any[];
  @Input() fileName: any;
  @Output() onSearchPicked = new EventEmitter<any>();

  personalInfoDashboard: any;
  age: any;
  // @Output() onSearchPicked = new EventEmitter<any>();
  defaultImage = 'assets/img/upload-avatar.png';

  searchValue: any;
  searchName: any;
  searchRes: any;
  searchPayload: any;
  isLoading: boolean;
  isCheck: any;
  applyCssAvatar: boolean;
  applyCssQuiz: boolean;
  applyCssSkills: boolean;
  checkListFriends: boolean = true;
  personalInfo: any;
  userAvatar: string;
  updatedDetails: any = {};
  quizDashboard: any = 'personQuiz';
  skillsDashboard: any = 'Skills';
  userReset: any = 'resetPassword';
  isGoogle: any;
  filePathLocation: any;
  originalMyBuddies: any[];

  constructor(private studentHelperService: StudentHelperService,
    private commService: CommunicationService,
    private toastrService: ToastrService,
    private activeModal: NgbActiveModal,
    private uploadService: UploadService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.alluserDetails = this.data.usersList;
    this.originalMyBuddies = this.data.usersList;
    this.userDetails = this.data.userDetails;
    this.userSkills = this.data.userSkills;
    this.skillsList = this.data.skillsList;
    this.isGoogle = sessionStorage.getItem('login_type');
    console.log('edit-stud-userinfo', this.userDetails);
    this.filePathLocation = environment.fileLocation;
    this.applyCssAvatar = true;
    this.applyCssQuiz = true;
    this.applyCssSkills = true;
    this.personalInfo = 'personalInfo';

    this.age = this.getAge(this.userDetails.user_dob);
    this.fileName = this.uploadService.getFileName(this.userDetails.avatar_image_file);

    // this.getAchievements();
  }

  userInfoUpdate(userinfo: string) {
    this.userDetails = userinfo;
    this.age = this.getAge(this.userDetails.user_dob);
    this.updatedDetails.userDetails = userinfo;
    sessionStorage.setItem('st_details', JSON.stringify(userinfo));
  }

  avatarUpdate(userinfo: any): void {
    const imagePath = this.uploadService.getFileName(userinfo.avatar_image_file);
    console.log(imagePath);
    this.fileName = imagePath;
    this.commService.changeprofileImage(imagePath);
    this.updatedDetails.userDetails = userinfo;
    sessionStorage.setItem('st_details', JSON.stringify(userinfo));
  }

  skillsUpdated(res: any) {
    if (res) {
      this.updatedDetails.isSkillsUpdated = true;
    }
  }

  closeModal() {
    this.activeModal.close(this.updatedDetails);
  }

  getAge(dob): number {
    if (!dob) return 0;
    const timeDiff = Math.abs(Date.now() - new Date(dob).getTime());
    return Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
  }

  onClickPersonalInfo(selectionNav) {
    this.personalInfoDashboard = selectionNav;
    this.studentHelperService.handleUserPersonalInfo.next(selectionNav);
    this.personalInfo = selectionNav;
  }

  onClickAvatar(selectionNav) {
    this.personalInfoDashboard = selectionNav;
    this.studentHelperService.handleUserAvatar.next(selectionNav);
  }

  onClickPersonalQuiz(selectionNav) {
    this.personalInfoDashboard = selectionNav;
    this.studentHelperService.handlePersonalQuiz.next(selectionNav);
  }

  onClickSkills(selectionNav) {

    this.personalInfoDashboard = selectionNav;
    this.studentHelperService.handleUserSkills.next(selectionNav);
  }

  onClickRestPassword(selectionNav) {
    this.personalInfoDashboard = selectionNav;
    this.studentHelperService.handleResetPassword.next(selectionNav);
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

  calculateAge(alluserDetails) {
    const allusers = alluserDetails;
    allusers.forEach(user => {
      const userdob = user.date_of_creation;
      const timeDiff = Math.abs(Date.now() - new Date(userdob).getTime());
      const age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
      user['userdob'] = age;
    });
    // console.log('final ages ......',allusers);
  }

  getMyBuddies() {
    this.isLoading = true;
    this.studentHelperService.getMyBuddies().subscribe((resp) => {
      console.log('..... all users', resp);
      this.alluserDetails = resp;
      this.calculateAge(this.alluserDetails);
      this.isLoading = false;
      this.checkListFriends = true;
      this.cd.detectChanges();
    }, () => {
      this.isLoading = false;
      console.log('error ......');
      this.toastrService.error('Unable to get users ');
    })

  }

  buddiesListFilter() {
    this.isLoading = true;
    this.studentHelperService.buddyByGroup(this.userDetails.userId).subscribe((resp) => {
      console.log('..... buddies by group', resp);
      this.alluserDetails = resp;
      this.calculateAge(this.alluserDetails);
      this.isLoading = false;
      this.cd.detectChanges();
    }, () => {
      this.isLoading = false;
      console.log('error ......');
      this.toastrService.error('Unable to get users ');
    })
  }

  searchByCatagory() {
    this.isLoading = true;
    if (this.searchValue == undefined || this.searchName == undefined) {
      this.toastrService.warning('Please provide search criteria');
      this.isLoading = false;
      return false;
    }
    if (this.searchValue === 'school') {
      this.isCheck = this.searchValue;
      this.searchPayload = {
        school_name: this.searchName
      }
    } else if (this.searchValue === 'class') {
      this.isCheck = this.searchValue;
      this.searchPayload = {
        class_details: this.searchName
      }
    } else if (this.searchValue === 'name') {
      this.isCheck = this.searchValue;
      this.searchPayload = {
        display_name: this.searchName
      }
    } else if (this.searchValue === 'skill') {
      this.isCheck = this.searchValue;
      this.searchPayload = {
        skill: this.searchName
      }
    } else if (this.searchValue === 'age') {
      this.isCheck = this.searchValue;
      this.searchPayload = {
        age: this.searchName
      }
    }
    this.studentHelperService.searchByValue(this.searchPayload).subscribe((resp) => {
      console.log('..... search result', resp);
      this.searchRes = resp;
      this.isLoading = false;
      $('#buddiesSearchModal2').modal('show');
      $('#editStudentProfileModal').modal('hide');
      // this.searchRes.push({
      //   isCheck: this.isCheck,
      //   searchName: this.searchName
      // });
      // this.onSearchPicked.emit(this.searchRes);
      this.cd.detectChanges();

    }, () => {
      this.isLoading = false;
      console.log('error ......');
      this.toastrService.error('Unable to get ');
    });
  }

  onImgError(event) {
    event.target.src = this.defaultImage;
  }

  backTo() {
    $('#buddiesSearchModal2').modal('hide');
    $('#editStudentProfileModal').modal('show');
    this.searchName = this.searchName;
  }

  getImageName(imageLink, index) {
    if (imageLink) { return 'assets/img/friend-' + index + '.png'; }
    return this.uploadService.getFileName(imageLink);
  }
  ngOnDestroy() {
    this.cd.detach();
  }

}
