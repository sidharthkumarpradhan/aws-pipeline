import {DatePipe} from '@angular/common';
import {AfterContentChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, Validators} from '@angular/forms';
import {DomSanitizer} from '@angular/platform-browser';
import {NavigationExtras, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';
import {forkJoin, Observable} from 'rxjs';
import {FileUploadComponent} from 'src/app/shared/component/file-upload/file-upload.component';
import {RECORDS_PER_PAGE} from 'src/app/shared/constant';
import {HelperService} from 'src/app/shared/services/helper.service';
import {environment} from 'src/environments/environment';
import {AdminHelperService} from '../../admin-dashboard/admin-helper.service';
import {StudentHelperService} from '../student-helper.service';
import {CommonApiService} from '../../../shared/services/common-api.service';
import {CustomValidator} from 'src/app/shared/validators/customValidator';
import {AuthState} from 'src/app/store/auth.model';
import {Store} from '@ngrx/store';
import {userInfo} from 'src/app/store/auth.selector';
import { GroupChallengeModelComponent } from './group-challenge-model/group-challenge-model.component';
import { SoloChallengeModelComponent } from './solo-challenge-model/solo-challenge-model.component';
import { ChallengeWorkareaComponent } from './challenge-workarea/challenge-workarea.component';

declare var $: any;
declare var jQuery: any;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-spotlight-challenges',
  templateUrl: './spotlight-challenges.component.html',
  styleUrls: ['./spotlight-challenges.component.css'],
  providers: [DatePipe]
})
export class SpotlightChallengesComponent implements OnInit, AfterContentChecked {

  /* To display pluralized words dynamically */
  readonly pluralMapping: any = {
    response: {
      '=0': '0 Responses',
      '=1': '1 Response',
      other: '# Responses',
    },
    day: {
      '=0': '0 days',
      '=1': '1 day',
      other: '# days',
    }
  };

  //  @Output() onSearchPicked = new EventEmitter<any>();
  assignments: any;
  isLoader2: boolean;
  buddiesList: any;
  challenges: any;
  isLoading: Boolean;
  UserEmailStore: Array<object> = [];
  isViewMode: Boolean = false;

  groupsList: any = [];
  isGroupsLoading: boolean;
  searchGroup: string = '';
  dateFormatKeys = ['lastmodified_date'];
  groupPage: number = 1;
  resultsPerPage: number = RECORDS_PER_PAGE;
  comments: string;
  count: number;
  group_id: Number;
  commentInfo: Array<object> = [];
  submitted: Boolean = false;
  public id = 0;
  wordCount: any;
  spotLightChallenges: any;
  ChallengeHolder: any;
  createdDateChallenge: any;
  topic_id: any;
  topic_status: any;
  challengeName: any;
  topic_assign_id: any;
  topic_group_size: any;
  class_details: any;
  school_name: any;
  VideoLink: any;
  documentLink: any;
  AudioLink: any;
  ImageLink: any;
  filePath: any;
  topic_description: any;
  inviteShow: Boolean = true;
  isCheck: string;
  searchValue: any;
  searchPayload: any;
  searchName: any;
  searchRes: any;
  st_details: any;
  top10Challenges: any;
  watchAgain: any;
  trending: any;
  myChall: any;
  recentChall: any;
  continueChall: any;
  submissionsChall: any;
  upcomingChallenge: any;
  influencerChallenges: any;
  dateRangeSelected: string = 'Last Week';
  commentsRetrieved: any;
  filename: any;
  commentVideoFiles = [];
  videoFiles = [];
  imageFiles = [];
  commentImageFiles = [];
  files = [];
  commentFiles = [];
  myDate = new Date();
  isCheckInvite: Boolean = true;
  autoassign_flag: any;
  logggedUserEmail: any;
  displayBuddies: any;
  copiedData: any
  presentUsers: Array<object> = [];
  FileUploaded: Boolean = false;
  userProfileUrl: any;
  filePathLocation: any;
  file: string;
  fileType: string;
  mediaType: string;
  @ViewChild('text', { static: false }) text: ElementRef;
  words: any;
  userName: any;
  filePathName: any;
  fromConfirmPage: Boolean = false;
  groupName: any;
  challengeId: any;
  rolesData: any;
  assignFlag: string = 'invite';
  selectedRole: any;
  enableContinue: Boolean = false;
  currentChallenge: any;
  group_role_id: any;
  isExist: Boolean = false;
  groupMembersList: any;
  actualGroupMemberList: any;
  challGroupName: any;
  groupOwner: any;
  groupOwnerRole: any;
  groupOwnerRoleImg: any;
  allowSubmit: any = true;
  finalComment: any;
  final_submitted: Number = 0;
  attachements = [];
  fromWorkAreaPage: Boolean = false;
  submittedComments: any = [];
  topicDetails: any;
  submittedCommentMem: any;
  reactName: string = 'React';
  topic_response_id: any;
  showFullName: Boolean = false;
  ImageHome: any;
  videoHome: any;
  challenge: any;
  viewRespList: any;
  showEditTextBox: Boolean = false;
  showEditLabel: Boolean = true;
  currentIndex: Number;
  paginationList: Array<any> = [];
  currentPage: any = 0;
  itemsPerPage: any = 1;
  storeData: any;
  userList: any;

  baseImagePath = environment.fileLocation;
  reactPic = '../../../../assets/img/smile-icon-react.jpg';

  loggedInUserId: any;
  groupOwnerId: number;
  loggedInUserDetails: any;
  daysLeftForSubmission: number;
  showReactOptionsArray = [];
  searchType: string = "topic_name";
  searchKeyword: string;
  isFormSubmitted: boolean = false;
  leaderboardUserList: any[];
  topLeaderboardUser: any;
  toggleLeaderBoard: boolean;

  wordCounter() {
    //alert(this.text.nativeElement.value)
    this.wordCount = this.text ? this.text.nativeElement.value : 0;
    this.words = this.wordCount ? this.wordCount.length : 0;
  }


  // validators = [this.must_be_email];
  // errorMessages = {
  //   'must_be_email': 'Please be sure to use a valid email format'
  // };
  // must_be_email(control: FormControl) {
  //   var EMAIL_REGEXP = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/i;
  //   if (control.value.length != "" && !EMAIL_REGEXP.test(control.value)) {
  //     return { "must_be_email": true };
  //   }
  //   return null;
  // }

  backGroundColors: [
    { bgcolor: '#b9e1ff' },
    { bgcolor: '#ffffb6' },
    { bgcolor: '#ffb2b9' },
    { bgcolor: '#ffdfb8' },
    { bgcolor: '#ede6ff' },
    { bgcolor: '#bdeff2' },
    { bgcolor: '#bdf2de' },
    { bgcolor: '#efd1f0' },
    { bgcolor: '#edd1da' },
    { bgcolor: '#d1deed' }
  ]

  itemCounts = [1, 2, 3, 4, 5]

  confirmGroupForm = this.fb.group({
    group_name: [null, [Validators.required]],
    topic_id: [null, [Validators.required]],
    assignments: [null, [Validators.required]],
    role: [null, [Validators.required]],
    roles: this.fb.array([this.fb.group({
      role_name: [''],
      role_assigned_to: [''],
      role_avatar: [''],
      role_id: ['']
    })])
  });

  submitFeedbackForm = this.fb.group({
    feedback_option: [null]
  });

  creategroupForm = this.fb.group({
    assignments: [null, [Validators.required]],
  });

  commentForm = this.fb.group({
    response_description: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]]
  });

  submitChallengeForm = this.fb.group({
    response_description: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]]
  });

  groupNameForm = this.fb.group({
    groupName: ['', [Validators.required]]
  });

  assignRoleForm = this.fb.group({
    role: ['', [Validators.required]]
  });

  inviteBuddiesForm = this.fb.group({
    assignments: [null, [Validators.required, CustomValidator.ValidateEmail]]
  });

  reactForm = this.fb.group({
    rating_value: ['', [Validators.required]],
    rating_comments: ['', [Validators.required]],
    comment_response: ['', [Validators.required]]
  });

  // confirmGroupForm = this.fb.group({
  //   finalRole: ['', [Validators.required]]
  // });

  constructor(private fb: FormBuilder, private modalService: NgbModal, private cd: ChangeDetectorRef, private toastrService: ToastrService,
              private service: AdminHelperService, private router: Router, private datePipe: DatePipe, public _uhs: HelperService,
              private studentHelperService: StudentHelperService, public sanitizer: DomSanitizer,
              private commonService: CommonApiService, private store: Store<AuthState>
  ) { }

  ngOnInit() {
    this.store.select(userInfo).subscribe(res => {
      if (res) {
        this.loggedInUserId = res.user_id;
        this.st_details = res;
      }
    });

    this.count = 0;
    this.filePathLocation = environment.fileLocation;
    this.logggedUserEmail = this.st_details.user_email ? this.st_details.user_email : this.st_details.user_gmail
    this.loadBuddies();
    this.loadChallenges();
    this.top10Responses();
    this.topChallenges();
    this.trendingChallenges();
    this.myChallenges();
    this.upcomingChallengesList();
    this.influencerChallengesList();
    this.getcontinueChallenges();
    this.recentChallenges();
    this.loadLeaderboardDetails();
    $('.show-react-option-btn').click(function () {
      $('.react-option-outer').toggleClass('show-react-option');
    });

  }

  toggleActions(popover, data: any) {
    if (popover.isOpen()) {
      popover.close();
    } else {
      popover.open({ data });
    }
  }

  onChangeInvite(checkValue) {
    if (checkValue === 'auto') {
      this.assignFlag = 'auto';
      this.isLoading = true;
      const payload = {
        topic_id: this.challengeId,
        topic_group_size: this.topicDetails.topic_group_size
      };
      this.studentHelperService.autoAssignChallenge(payload).subscribe(res => {
        if (res) {
          this.isLoading = false;
          this.toastrService.success('Auto assigned students !');
          this.UserEmailStore = res;
          console.log('store', this.UserEmailStore);
          this.cd.detectChanges();
        }
      }, err => this.isLoading = false);

    } else {
      this.assignFlag = 'invite';
    }
  }

  onChangeRole(role) {
    this.selectedRole = role;
    if (this.enableContinue) {
      return;
    } else {
      let fa = <FormArray>this.confirmGroupForm.get('roles');
      fa.reset();
      fa.removeAt(0);
      const temp = this.fb.group({
        role_name: [role.role_name],
        role_assigned_to: [this.st_details.user_email],
        role_avatar: [role.role_img],
        role_id: [role.role_id]
      });
      fa.push(temp);
    }
  }


  loadBuddies() {
    this.isLoading = true;
    forkJoin([
      this.service.getBuddiesList(),
      this.service.getChallengesList()
    ]).subscribe(results => {
      this.isLoader2 = false;
      if (results && results.length) {
        this.userList = results[0];
        this.buddiesList = this.displayBuddiesList(results[0]);
        this.buddiesList = this.buddiesList.filter(item => item !== null)
        //  console.log('buddieslist', this.buddiesList)
        this.challenges = results[1];
        this.isLoading = false;
        this.cd.detectChanges();
      }
    }, err => this.isLoader2 = false);
  }

  getUserEmails(emailsArray: any): void {
    if (emailsArray && emailsArray.length) {
      return emailsArray.map(({ user }) => {
        return user.user_email ? user.user_email : user.user_gmail;
        // return Object.assign({}, {user_email: email});
      })
    }
  }

  displayBuddiesList(result) {
    this.displayBuddies = result;
    if (result && result.length) {
      result = result.filter(item => item.user_id !== this.st_details.user_id);
      return result.map(({ user_email, user_gmail }) => user_email ? user_email : user_gmail);
      // return result.map(({ display_name }) => display_name);
    } else {
      return null;
    }
  }

  addBuddie() {
    let { assignments } = this.inviteBuddiesForm.value;
    if (this.st_details['user_email'] !== assignments && this.UserEmailStore.findIndex(item => item['user_email'] === assignments) === -1) {
      if (this.UserEmailStore.length >= this.topicDetails.topic_group_size) {
        this.toastrService.warning('You can not invite more Students');
        return false;
      } else {
        if (this.inviteBuddiesForm.valid) {
          let resultedUser = this.userList.filter(item => item.user_email === assignments);
          console.log('resultedUser', resultedUser);
          if (resultedUser.length > 0) {
            this.UserEmailStore.push({
              display_name: resultedUser[0].display_name,
              avatar_image_file: resultedUser[0].avatar_image_file,
              user_email: resultedUser[0].user_email ? resultedUser[0].user_email : resultedUser[0].user_gmail
            });
          } else {
            this.toastrService.info('You are inviting new student');
            this.UserEmailStore.push({
              display_name: assignments,
              avatar_image_file: 'avatar-boy-11.png',
              user_email: assignments
            });
          }
        } else {
          this.toastrService.warning('Please enter valid Email')
        }
      }

      this.inviteBuddiesForm.reset();
      console.log('useremailstore', this.UserEmailStore);
    }
  }


  populateAssignments(emailsList: any): void {
    let { assignments } = this.creategroupForm.value;
    assignments = [];
    this.creategroupForm.patchValue({
      assignments: emailsList
    });

    if (emailsList !== undefined) {
      emailsList.map(element => {
        this.UserEmailStore.push(element);
      })
    }
    if (this.buddiesList.length > 0 && emailsList !== undefined) {
      this.loadStudents(emailsList);
    }

  }

  getAttachments() {
    this.isLoading = true;
    const topic_id = this.topic_id;
    this.service.getChallengeMediaFiles({ topic_id }).subscribe((res: any) => {
      this.isLoading = false;
      if (res && res.length) {

        res.forEach(element => {
          const fileName = environment.fileLocation + element.attachment_file_path;
          if (element.attachment_title === 'challenge_document') {
            // this.createProfileForm.controls.topic_document.setValue(element.attachment_file_path);
            this.filePathName = element.attachment_file_path;
            this.documentLink = fileName;
          } else if (element.attachment_title === 'challenge_audio') {
            // this.createProfileForm.controls.topic_audio.setValue(element.attachment_file_path);
            this.AudioLink = this.sanitizer.bypassSecurityTrustResourceUrl(fileName);
            // this.AudioLink = fileName;
          } else if (element.attachment_title === 'challenge_image') {
            //  this.createProfileForm.controls.topic_image.setValue(element.attachment_file_path);
            this.ImageLink = this.sanitizer.bypassSecurityTrustResourceUrl(fileName);
          } else if (element.attachment_title === 'challenge_video') {
            // this.createProfileForm.controls.topic_video.setValue(element.attachment_file_path);
            // this.VideoLink = this.sanitizer.bypassSecurityTrustResourceUrl(fileName);
            this.VideoLink = fileName;
          }
        });
      } else {
        this.documentLink = '';
        this.AudioLink = '';
        this.ImageLink = '';
        this.VideoLink = '';
      }
      this.cd.detectChanges();
    })
  }

  searchBy(selectionValue) {
    this.cd.detectChanges();
    this.searchValue = selectionValue;
    this.isCheck = this.searchValue;
    $('#buddiesSearchModal3').modal('show');
  }

  onChangeValue(value) {
    this.searchName = value;
  }

  changeCount(event: any) {
    this.itemsPerPage = event.target.value;
    this.generatePaginationList(this.submittedComments);
    this.bindDataToTable();
  }

  bindDataToTable() {
    console.log('currentPage----', this.currentPage);
    const startInd = this.currentPage * this.itemsPerPage;
    const endInd = (this.currentPage + 1) * this.itemsPerPage;
    this.submittedComments = this.storeData.slice(startInd, endInd);

  }

  onItemClick(val: any) {
    this.currentPage = val;
    this.bindDataToTable();
  }

  onPrevClick() {
    this.currentPage--;
    this.bindDataToTable();
  }

  onNextClick() {
    this.currentPage++;
    this.bindDataToTable();
  }

  generatePaginationList(paginationData: string | any[]) {
    this.paginationList = [];
    const count = Math.ceil(paginationData.length / this.itemsPerPage);
    for (let i = 1; i <= count; i++) {
      this.paginationList.push(i);
    }
  }


  searchByCatagory() {
    this.isLoading = true;

    if (this.searchValue == undefined || this.searchName == undefined) {
      this.toastrService.warning('Please provide search criteria');
      this.isLoading = false;
      return false;
    }

    if (this.searchValue === 'School') {
      this.isCheck = this.searchValue;
      this.searchPayload = {
        "school_name": this.searchName
      }
    } else if (this.searchValue === 'Class') {
      this.isCheck = this.searchValue;
      this.searchPayload = {
        "class_details": this.searchName
      }
    } else if (this.searchValue === 'Name') {
      this.isCheck = this.searchValue;
      this.searchPayload = {
        "display_name": this.searchName
      }
    } else if (this.searchValue === 'Skill') {
      this.isCheck = this.searchValue;
      this.searchPayload = {
        "skill": this.searchName
      }
    } else if (this.searchValue === 'Age') {
      this.isCheck = this.searchValue;
      this.searchPayload = {
        "age": this.searchName
      }
    }

    let payload = {
      ...this.searchPayload,
      'topic_id': this.challengeId
    }

    this.studentHelperService.searchByValue(payload).subscribe((resp) => {
      console.log('..... search result', resp);
      resp = resp.filter((item) => item.user_id !== this.st_details.user_id);
      this.searchRes = resp;
      if (this.searchRes.length > 0) {
        $('#buddiesSearchModal3').modal('show');
        //  $('#shareModal').modal('hide');
        //  $('#challengeModal').modal('hide');
      } else {
        this.toastrService.info('No records found !')
      }
      // this.searchRes.push({
      //   'isCheck': this.isCheck,
      //   'searchName': this.searchName
      // });
      let PresentInData = resp.filter(entry1 =>
        this.UserEmailStore.some(entry2 => entry1.display_name === entry2));

      PresentInData.map(item => {
        item['selected'] = true
      });
      console.log('PresentInData', PresentInData)
      // this.onSearchPicked.emit(this.searchRes);
      this.isLoading = false;

    }, () => {
      this.isLoading = false;
      console.log('error ......');
      this.toastrService.error('Unable to get ');
    })
  }

  backToChallenge() {
    if (this.UserEmailStore.length > 4) {
      this.toastrService.warning('You can not invite more than 4 Students');
      return false;
    } else {
      $('#challengeModal').modal('show');
      $('#shareModal').modal('show');
      $('#buddiesSearchModal3').modal('hide');
    }
  }

  checkUser(user, event) {
    let userChek = event.srcElement.checked;
    if (this.st_details.user_email !== user.user_email){
      const filterData = this.UserEmailStore.findIndex((item, i) => item['user_email'] === user.user_email) > -1;
      if (userChek && !filterData) {
        this.UserEmailStore.push({
          display_name: user.display_name,
          avatar_image_file: user.avatar_image_file,
          user_email: user.user_email ? user.user_email : user.user_gmail
        });
      } else {
        this.UserEmailStore = this.UserEmailStore.filter(item => item['user_email'] !== user.user_email);
      }
      console.log('display_names after check', this.UserEmailStore);
    }
  }

  saveEmails() {
    let { assignments } = this.inviteBuddiesForm.value;
    if (this.UserEmailStore.length > 4) {
      this.toastrService.warning('You can not invite more than 4 Students');
      return false;
    } else {
      $('#confirmGroup').modal('show');
      $('#buddiesSearchModal3').modal('hide');
      // this.inviteBuddiesForm.patchValue({
      //   assignments: this.UserEmailStore
      // })

      console.log('assignments', assignments, this.UserEmailStore)
      this.searchName = this.searchName;
    }
  }

  deleteBuddie(user) {
    console.log('user', user, this.UserEmailStore);
    this.UserEmailStore = this.UserEmailStore.filter(item => item['user_email'] !== user.user_email);
  }

  onUploadDoc(evt, catagory, type) {
    const modalData = {
      headerName: 'Media',
      fileType: type,
      fileCategory: catagory
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
        const result = reason;
        if (modalData.fileType === 'video') {
          this.videoFiles = result.map(s => s.file ? {file: s.file, type: 'video'} : []);
        } else if (modalData.fileType === 'image') {
          this.imageFiles = result.map(s => s.file ? {file: s.file, type: 'image'} : []);
        } else if (modalData.fileType === 'doc') {
          this.files = result.map(s => s.file ? {file: s.file, type: 'doc'} : []);
        }
        this.cd.detectChanges();
        // this.FileUploaded = true;
      }
    });
  }

  onUploadComment(evt, catagory, type) {
    const modalData = {
      headerName: 'Media',
      fileType: type,
      fileCategory: catagory
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
        console.log('filename resp', reason);
        const result = reason;
        if (modalData.fileType === 'video') {
          this.commentVideoFiles = result.map(s => s.file ? {file: s.file, type: 'video'} : []);
        } else if (modalData.fileType === 'image') {
          this.commentImageFiles = result.map(s => s.file ? {file: s.file, type: 'image'} : []);
        } else if (modalData.fileType === 'doc') {
          this.commentFiles = result.map(s => s.file ? {file: s.file, type: 'doc'} : []);
        }
        // this.FileUploaded = true;
      }
    });
  }

  onUpload(evt, catagory) {
    const modalData = {
      headerName: 'Media',
      fileType: 'image&video',
      fileCategory: catagory
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
        let fileName = reason[0].file;
        console.log('filename resp', fileName);
        this.filename = fileName.filename;
        this.FileUploaded = true;
      }
    });
  }

  receiveComment($event) {
    this.comments = $event;
    this.count = this.comments.length;
    console.log(this.comments.length);
  }

  getDescToBind(desc) {
    return desc.substring(0, 199)
  }

  getsubmissionDescToBind(desc) {
    return desc.substring(0, 49)
  }

  recieveCount($event) {
    this.comments = $event;
    this.count = this.comments.length;
  }

  openDocument(event: any, fileUrl: string) {
    let filePath = fileUrl;
    // event.stopPropagation();
    // this.filePath = fileUrl;
    window.open(
      filePath,
      '_blank'
    );
  }

  openFile() {
    let filePath = environment.fileLocation + this.filename;
    // event.stopPropagation();
    // this.filePath = fileUrl;
    window.open(
      filePath,
      '_blank'
    );
  }

  deleteFile(event: Event) {
    event.stopPropagation();
    this.filename = '';
    this.FileUploaded = false;
    console.log('this.filename', this.filename, this.FileUploaded);
  }

  deleteFiles(event: Event, file, type) {
    event.stopPropagation();
    if (type === 'video') {
      this.videoFiles = this.videoFiles.filter(item => item.file !== file.file);
    } else if (type === 'image') {
      this.imageFiles = this.imageFiles.filter(item => item.file !== file.file);
    } else if (type === 'doc') {
      this.files = this.files.filter(item => item.file !== file.file);
    }
    this.cd.detectChanges();
    /// console.log('this.filename', this.filename, this.FileUploaded);
  }

  commnetdeleteFiles(event: Event, file, type) {
    event.stopPropagation();
    if (type === 'video') {
      this.commentVideoFiles = this.commentVideoFiles.filter(item => item.file !== file.file);
    } else if (type === 'image') {
      this.commentImageFiles = this.commentImageFiles.filter(item => item.file !== file.file);
    } else if (type === 'doc') {
      this.commentFiles = this.commentFiles.filter(item => item.file !== file.file);
    }
    this.cd.detectChanges();
    /// console.log('this.filename', this.filename, this.FileUploaded);
  }

  openShareModal() {
    $('#shareModal').modal('show');
    this.cd.detectChanges();
    // this.viewBuddies();
  }

  onClickGroup() {
    let passedValue = '';
    if (!this.topic_id) {
      this.toastrService.warning('Invalid Info');
      return false;
    }
    if (this.isViewMode) {
      passedValue = 'view'
    } else {
      passedValue = 'continue'
    }
    let navigationExtras: NavigationExtras = {
      queryParams: {
        'fromPage': passedValue,
      }
    };
    this.router.navigate(['/main-route/student/spotlight-groups/' + this.topic_id], navigationExtras);
  }

  getEmailsRemain(emailsArray: any) {
    if (emailsArray && emailsArray.length) {
      return emailsArray.map((user) => {
        return user.user_email ? user.user_email : user.user_gmail;
        // return Object.assign({}, {user_email: email});
      })
    }
  }

  updateUsersDom(presentUsers) {
    this.UserEmailStore = [];
    const emails = this.getEmailsRemain(presentUsers);

    emails.forEach(email => {
      this.UserEmailStore.push(email)
    });

    console.log("after removed", this.UserEmailStore);
  }

  onAdded(event: any) {
    let UserEmail = [event];
    let presentUsers = this.displayBuddies.filter(entry1 =>
      UserEmail.some(entry2 => entry1.user_email === entry2.user_email));
    if (this.presentUsers.length !== 0) {
      this.presentUsers.push(presentUsers[0]);
    } else {
      this.presentUsers = presentUsers;
    }
    console.log("Fire Added", this.presentUsers);

    this.updateUsersDom(this.presentUsers);
  }

  loadStudents(UserEmailStore) {
    const key = 'user_email';
    let presentUsers = this.displayBuddies.filter(entry1 =>
      UserEmailStore.some(entry2 => entry1.user_email === entry2));

    if (this.presentUsers.length !== 0) {
      this.copiedData = this.presentUsers;
      let combinedUsers = this.presentUsers.concat(presentUsers);

      combinedUsers = [...new Map(combinedUsers.map(item =>
        [item[key], item])).values()];

      this.presentUsers = [];
      combinedUsers.map(item => {
        this.presentUsers.push(item);
      })
    } else {
      this.presentUsers = presentUsers;
    }
    console.log("Fire loaded", this.presentUsers);
  }

  onItemRemoved(event: any) {
    let UserEmail = [event];
    this.copiedData = this.presentUsers;
    if (UserEmail[0].hasOwnProperty('display')) {
      this.presentUsers = this.copiedData.filter(entry1 =>
        !UserEmail.some(entry2 => entry1.user_email === entry2.user_email));
    } else {
      this.presentUsers = this.copiedData.filter(entry1 =>
        !UserEmail.some(entry2 => entry1.user_email === entry2));
    }

    const key = 'user_email';
    this.presentUsers = [...new Map(this.presentUsers.map(item =>
      [item[key], item])).values()];
    console.log("Fire removed", UserEmail, this.presentUsers);

    this.updateUsersDom(this.presentUsers);
  }

  viewBuddies() {
    this.isLoading = true;
    this.studentHelperService.viewAssignees(this.topic_id).subscribe(res => {
      if (res) {
        const emails = this.getUserEmails(res);
        this.populateAssignments(emails);
        console.log('viewAssignees result', res);
        this.cd.detectChanges();
        this.isLoading = false;
      }
    }, err => this.isLoading = false);
  }

  commentLike(selectedLike) {
    this.isLoading = true;
    let payload = {
      "rating_value": selectedLike,
      "topic_response": Number(this.topic_id),
      "user": this.st_details.user_id
    }

    this.studentHelperService.dotRatings(payload).subscribe(res => {
      this.isLoading = false;
      if (res) {
        this.getComments();
        //   this.GroupData = res;
        //  this.updateForm();
      }
    }, err => {
      this.isLoading = false;
    });
  }

  actionChallenge(challengeStatus) {
    this.isGroupsLoading = true;
    let payload = {
      "topic_assign_id": this.topic_assign_id,
      "assignment_status": challengeStatus
    }
    this.studentHelperService.actionChallenge(payload).subscribe(res => {
      if (res) {
        this.isGroupsLoading = false;
        console.log('res', res);
        this.topic_status = res.assignment_status;
        this.cd.detectChanges();
      }
    }, err => this.isGroupsLoading = false);
  }

  submitFeedback() {
    const { feedback_option } = this.submitFeedbackForm.value;
    this.isLoading = true;
    let payload = {
      "topic_assign_id": this.topic_assign_id,
      "assign_feedback_option": feedback_option
    }
    this.studentHelperService.actionChallenge(payload).subscribe(res => {
      if (res) {
        this.isLoading = false;
      }
    }, err => this.isLoading = false);
  }

  getFeedback() {
    this.isLoading = true;
    this.studentHelperService.feedbackGet(this.topic_assign_id).subscribe(res => {
      if (res) {
        this.submitFeedbackForm.patchValue({
          feedback_option: res.assign_feedback_option
        })
        this.isLoading = false;
      }
    }, err => this.isLoading = false);
  }


  shareInvite() {
    const { assignments } = this.creategroupForm.value;
    if (this.creategroupForm.invalid && this.inviteShow) {
      this.toastrService.warning('Please invite !');
      return false;
    } else {
      this.isLoading = true;
      if (this.inviteShow) {
        let assignees = assignments.map(element => {
          if (element.hasOwnProperty('display')) {
            return { 'user_email': element.display };
          } else if (!element.hasOwnProperty('user_email')) {
            return { 'user_email': element };
          }
          else {
            return element;
          }
        })
        let payload = {
          "topic_id": this.topic_id,
          "assignments": assignees
        }
        this.studentHelperService.shareInvites(payload).subscribe(res => {
          if (res) {
            this.isLoading = false;
            this.toastrService.success('Invited successfully !');
          }
        }, err => this.isLoading = false);
      } else {

        let payload = {
          "topic_id": this.topic_id
        }

        this.studentHelperService.autoAssignChallenge(payload).subscribe(res => {
          if (res) {
            this.isLoading = false;
            this.toastrService.success('AutoAssign success !')
          }
        }, err => this.isLoading = false);
      }


    }
  }

  cancelSubmit() {
    $('#submitChallengeModal').modal('hide');
    this.submitChallengeForm.reset();
    this.attachements = this.videoFiles = this.imageFiles = this.files = [];
  }

  cancelRate() {
    $('#reactModal').modal('hide');
  }

  editComment(data) {
    this.showEditTextBox = true;
    this.showEditLabel = false;
    this.currentIndex = data[1];
    this.reactForm.patchValue({
      comment_response: data[0].comment_notes
    });
    this.cd.detectChanges();
  }

  submitEditComment(resp) {
    const { comment_response } = this.reactForm.value;
    if (comment_response == null || comment_response == '') {
      this.toastrService.warning('Please write response to Update')
      return false;
    } else {
      this.isLoading = true;
      let payload = {
        topic_resp_comment_id: resp.topic_resp_comment_id,
        topic_response: resp.topic_response_id,
        comment_notes: comment_response
      }
      this.studentHelperService.updateResponse(payload).subscribe(res => {
        if (res) {
          this.isLoading = false;
          this.loadResponses(resp.topic_response_id);
          this.reactForm.reset();
          this.showEditTextBox = false;
          this.showEditLabel = true;
          this.cd.detectChanges();
        }
      }, err => this.isLoading = false);
    }
  }

  submitResponse(item) {
    const { rating_comments } = this.reactForm.value;
    if (rating_comments == '') {
      this.toastrService.warning('Please write response')
      return false;
    } else {
      this.isLoading = true;
      let payload = {
        user: this.st_details.user_id,
        topic_response: item.topic_response_id,
        comment_notes: rating_comments
      }
      this.studentHelperService.postResponse(payload).subscribe(res => {
        if (res) {
          this.isLoading = false;
          this.loadResponses(item.topic_response_id);
          this.reactForm.reset();
          this.cd.detectChanges();
        }
      }, err => this.isLoading = false);
    }
  }

  public loadResponses(topic_response_id) {
    this.isLoading = true;
    let payload = {
      topic_response_id: topic_response_id
    }
    this.studentHelperService.getResponses(payload).subscribe(res => {
      this.isLoading = false;
      this.viewRespList = res;
      this.cd.detectChanges();
    }, err => this.isLoading = false);
  }

  openCollapse(item, i) {
    const component = this;
    $('.collapse').each(function (index) {
      let targetColls = $(this);
      if ($(this).hasClass('show')) {
        $(this).collapse('toggle');
      }
      targetColls.on('show.bs.collapse', function () {
        if (i == index) {
          component.loadResponses(item.topic_response_id);
        }
      });
    });
  }

  toggleReactOptions(index) {
    this.showReactOptionsArray[index] = !this.showReactOptionsArray[index];
  }

  rateSubmission(eachSubmissionDetails: any, index: number, event) {
    const rating = event.target.value;
    this.isLoading = true;
    const payload = {
      topic_resp_rating_id: eachSubmissionDetails.topic_resp_rating_id || null,
      topic_response: eachSubmissionDetails.topic_response_id,
      rating_value: rating,
    };
    this.studentHelperService.rateSubmission(payload)
      .subscribe(response => {
        this.isLoading = false;
        this.submittedComments[index].topic_resp_rating_id = response.topic_resp_rating_id;
        this.cd.detectChanges();
      }, () => { });
  }

  reactOnSubmission(submissionDetails: any, submissionIndex: number, reaction: string) {
    this.isLoading = true;
    this.showReactOptionsArray[submissionIndex] = false;
    this.submittedComments[submissionIndex].rating_reaction = reaction;

    const payload = {
      topic_resp_rating_id: submissionDetails.topic_resp_rating_id || null,
      topic_response: submissionDetails.topic_response_id,
      rating_reaction: reaction
    };
    this.studentHelperService.reactOnSubmission(payload)
      .subscribe(response => {
        this.isLoading = false;
        this.doReactionChanges(submissionIndex, response.reactions);
        this.submittedComments[submissionIndex].topic_resp_rating_id = response.topic_resp_rating_id;
        this.cd.detectChanges();
      }, () => { });
  }

  submitFinalComment() {
    let TodayDate = this.datePipe.transform(this.myDate, 'yyyy-MM-dd hh:mm:ss');
    this.attachements = [...this.videoFiles, ...this.imageFiles, ...this.files];

    let responseDescription = this.submitChallengeForm.controls.response_description.value.trim();
    if (responseDescription !== null && responseDescription !== undefined) {
      responseDescription = responseDescription.trim();
    }

    if (!responseDescription || this.attachements.length === 0) {
      this.toastrService.warning('Please upload a file or write a description.');
      return false;
    } else {
      this.isLoading = true;
      let payload = {
        "response_description": responseDescription,
        "date_of_response": TodayDate,
        "topic_assign": this.topic_assign_id,
        'is_final_submit': 1,
        "attachments": this.attachements
      }

      this.studentHelperService.addComments(payload).subscribe(res => {
        if (res) {
          this.isLoading = false;
          this.toastrService.success('Challenge completed');
          this.getComments();
          this.cd.detectChanges();
          this.submitChallengeForm.reset();
          this.attachements = this.videoFiles = this.imageFiles = this.files = [];

          $('#submitCongrats').modal('show');
          $('#submitChallengeModal').modal('hide');
        }
      }, err => this.isLoading = false);

    }

  }


  saveComment() {
    let TodayDate = this.datePipe.transform(this.myDate, 'yyyy-MM-dd hh:mm:ss');
    this.attachements = [...this.commentVideoFiles, ...this.commentImageFiles, ...this.commentFiles];

    let commentText = this.commentForm.controls.response_description.value;
    if (commentText !== null && commentText !== undefined) {
      commentText = commentText.trim();
    }

    if (!commentText && this.attachements.length === 0) {
      this.toastrService.warning('Please write something or upload a file.');
      return false;
    } else {
      this.isLoading = true;
      let payload = {
        "response_description": commentText,
        "date_of_response": TodayDate,
        "topic_assign": this.topic_assign_id,
        "attachments": this.attachements
      };
      this.studentHelperService.addComments(payload).subscribe(res => {
        if (res) {
          this.isLoading = false;
          this.toastrService.success('Success');
          this.getComments();
          this.cd.detectChanges();
          this.commentForm.reset();
          this.attachements = this.commentVideoFiles = this.commentImageFiles = this.commentFiles = [];
        }
      }, err => this.isLoading = false);

    }
  }

  getComments() {
    this.isLoading = true;

    let commentsObservable: Observable<any>;
    if (this.topicDetails.topic_group_size === 1) {
      commentsObservable = this.studentHelperService
        .getSoloChallengeNotes(this.topicDetails.topic_assign_id);
    } else {
      commentsObservable = this.studentHelperService
        .getCommentRetrieveGroup(this.topicDetails.group_id);
    }

    commentsObservable.subscribe(res => {
      if (res) {
        this.commentsRetrieved = res;
        this.isLoading = false;
        this.finalComment = this.commentsRetrieved.filter(item => item.is_final_submit == '1');
        this.commentsRetrieved = this.commentsRetrieved.filter(item => item.is_final_submit == '0');
        console.log('comments', this.commentsRetrieved, this.finalComment)
        this.cd.detectChanges();
      }
    }, err => this.isLoading = false);
  }

  validUrl(link: string) {
    if (!link) { return false }
    return (link.indexOf('http://') === 0 || link.indexOf('https://') === 0);
  }

  openComments(challenge) {
    console.log('challenge', challenge);
    $('#commentModal').modal('show');
    this.userProfileUrl = `${environment.fileLocation}`;
    this.isLoading = true;
    this.studentHelperService.getCommentRetrieve(challenge.topic_id).subscribe(res => {
      if (res) {
        this.commentsRetrieved = res;
        this.isLoading = false;
        this.cd.detectChanges();
      }
    }, err => this.isLoading = false);
  }

  getRoles(payload, typeOf) {
    this.isLoading = true;
    this.studentHelperService.roles(payload).subscribe(res => {
      if (res) {
        this.rolesData = res;
        if (this.rolesData.length > 0) {
          this.rolesData.map(role => {
            if (role.group_role_id !== null) {
              let fa = <FormArray>this.confirmGroupForm.get('roles');
              fa.reset();
              fa.removeAt(0);
              const temp = this.fb.group({
                role_name: [role.role_name],
                role_assigned_to: [this.st_details.user_email],
                role_avatar: [role.role_img],
                role_id: [role.role_id]
              });
              fa.push(temp);
            }
          })
        }
        this.isLoading = false;
        this.cd.detectChanges();
      }
    }, err => this.isLoading = false);
  }

  closeCongrats() {
    $('#submitCongrats').modal('hide');
    location.reload();
  }

  closeWorkArea() {
    this.fromWorkAreaPage = false;
    $('#participateModal').modal('hide');
    $('#challengeModal').modal('show');
    // location.reload();
    this.groupMembersList = [];
    this.commentsRetrieved = [];
  }

  viewGroup() {
    $('#participateModal').modal('hide');
    $('#confirmGroup').modal('show');
    this.fromWorkAreaPage = true;

    let payload = {
      "topic_id": this.challengeId, "group_id": this.group_id
    }
    this.getRoles(payload, '');
    this.groupName = this.challGroupName;

    this.confirmGroupForm.patchValue({
      role: this.groupOwnerRole
    });
    this.assignRoleForm.patchValue({
      role: this.groupOwnerRole
    });
    this.groupNameForm.patchValue({
      groupName: this.challGroupName
    });

    this.UserEmailStore = [];
    this.actualGroupMemberList.forEach(element => {
      this.UserEmailStore.push({
        display_name: element.display_name,
        avatar_image_file: element.avatar_image_file,
        user_email: element.user_email ? element.user_email : element.user_gmail,
        role_id: element.role_id
      });
    });
    console.log('this...', this.UserEmailStore);
    this.assignments = this.UserEmailStore;

  }


  joinSoloChallenge(challenge) {
    let payload = {
      topic_id: this.topic_id
    };
    this.studentHelperService.JoinSoloChallenge(payload).subscribe(res => {
      if (res) {
        this.groupOwner = true;
        this.challenge.topic_id = res.topic_id;
        this.userName = res.user.display_name;
        this.class_details = res.user.class_details;
        this.school_name = res.user.school_name;
        this.cd.detectChanges();
        this.getTopicDetails(challenge);
        this.getComments();
        $('#participateModal').modal('show');
      }
    }, err => this.isLoading = false);
  }


  joinChallenge(challenge) {

    console.log('challenge', challenge);
    this.challenge = challenge;
    if (this.topic_group_size == 1) {
      this.loggedInUserDetails = this.commonService.getLoggedInUserDetails();
      if (!this.topic_assign_id) {
        this.joinSoloChallenge(challenge);
      }
      else {
        this.getTopicDetails(challenge);
        this.getComments();
        $('#participateModal').modal('show');
      }
    } else {
      if (this.group_id !== null && this.group_role_id !== null) {
        this.getGroupMembers();
        this.getTopicDetails(challenge);
        this.getComments();
        $('#participateModal').modal('show');
      } else if (this.group_id !== null && this.group_role_id === null) {
        $('#assignRole').modal('show');
        this.enableContinue = true;
        let payload = {
          "topic_id": this.challengeId, "group_id": this.group_id
        }
        this.getRoles(payload, 'participate');
      } else if (this.group_id === null && this.group_role_id === null) {
        this.createGroup();
      }
    }
    $('#challengeModal').modal('hide');

    this.confirmGroupForm.reset();
    this.groupNameForm.reset();
    this.assignRoleForm.reset();
    this.inviteBuddiesForm.reset();
    this.UserEmailStore = [];
    this.enableContinue = false;
    this.isExist = false;
    //  this.group_id = null;
  }

  continueChallenge() {
    if (this.group_id !== null && this.group_role_id === null) {
      $('#assignRole').modal('show');
      this.enableContinue = true;
      let payload = {
        "topic_id": this.topic_id, "group_id": this.group_id
      }
      this.getRoles(payload, '');
    } else if (this.group_id !== null && this.group_role_id !== null) {
      this.getGroupMembers();
      this.getComments();
      this.getTopicDetails(this.challenge);
      $('#participateModal').modal('show');
    } else {
      this.toastrService.info('Role not assigned');
    }
    $('#challengeModal').modal('hide');
    console.log('groupid', this.group_id)
  }

  openChallenge(challenge: any): any {
    const component = challenge.topic_group_size === 1 ? SoloChallengeModelComponent : GroupChallengeModelComponent;
    const modelRef = this.modalService.open(component, {
      centered: true,
      backdrop: 'static',
      size: 'xl',
     });
     modelRef.componentInstance.challenge = challenge;
     modelRef.componentInstance.passEntry.subscribe(res => {
        if (res) {
          const workareaRef = this.modalService.open(ChallengeWorkareaComponent, {
            centered: true,
            backdrop: 'static',
            size: 'xl',
            windowClass: 'modalChallengeStoryTelling'
           });
           workareaRef.componentInstance.challenge = res;
           workareaRef.componentInstance.passEntry.subscribe(res => {
             if (res) {
                this.openChallenge(res);
             }
           })
        }
     });
    // this.challenge = challenge;
    // $('#challengeModal').modal('show');
    // this.getTopicDetails(challenge);
    // this.getSubmittedCommnets(challenge);
    // if (this.challenge.group_id !== null) {
    //   setTimeout(() => {
    //     this.getGroupMembers();
    //   }, 1000);
    // }
  }

  openChallengeModel(): void {
    
  }

  rejectChallenge() {
    this.isLoading = true;
    this.studentHelperService.rejectChallenge(this.topic_assign_id).subscribe(res => {
      this.isLoading = false;
      this.cd.detectChanges();
      if (res) {
        $('#challengeModal').modal('hide');
        location.reload();
      }
    }, err => this.isLoading = false);
  }

  getSubmittedCommnets(challenge) {
    this.isLoading = true;
    let challengeResponsesObservable: Observable<any>;
    if (challenge.topic_group_size === 1) {
      challengeResponsesObservable = this.studentHelperService
        .getSoloChallengeResponses(challenge.topic_id);
    } else {
      challengeResponsesObservable = this.studentHelperService
        .groupMemById(challenge.topic_id);
    }

    challengeResponsesObservable.subscribe(res => {
      this.isLoading = false;
      if (res) {
        this.submittedComments = res;
        this.storeData = res;
        this.showReactOptionsArray = Array(9).fill(false);
        this.generatePaginationList(this.submittedComments);
        this.bindDataToTable();
        this.cd.detectChanges();
      }
    }, err => this.isLoading = false);
  }

  getTopicDetails(challenge) {
    this.isLoading = true;
    this.studentHelperService.topicDetailsById(challenge.topic_id).subscribe(res => {
      this.isLoading = false;
      if (res) {
        console.log('getTopicDetails resul', res);
        this.topicDetails = res;
        this.challengeId = this.topic_id = this.topicDetails.topic_id;
        this.group_id = this.topicDetails.group_id;
        this.group_role_id = this.topicDetails.group_role_id;
        this.topic_assign_id = this.topicDetails.topic_assign_id;
        this.topic_group_size = this.topicDetails.topic_group_size;
        this.currentChallenge = this.topicDetails;
        this.createdDateChallenge = this.topicDetails.topic ? this.topicDetails.topic.created_date : this.topicDetails.topic_created_date;
        this.ChallengeHolder = this.topicDetails.topic ? this.topicDetails.topic.created_by : this.topicDetails.topic_created_by;
        this.final_submitted = challenge.final_submitted;
        this.challengeName = this.topicDetails.topic_name;
        this.topic_description = this.topicDetails.topic_description ? this.topicDetails.topic_description : '';

        this.daysLeftForSubmission = this.commonService.getDateDifference(
          new Date(), this.topicDetails.topic_end_date, 'days'
        );

        if (res && res.attachments.length) {

          res.attachments.forEach(element => {
            const fileName = environment.fileLocation + element.attachment_file_path;
            if (element.attachment_title === 'challenge_document' && element.attachment_file_path !== '') {
              // this.createProfileForm.controls.topic_document.setValue(element.attachment_file_path);
              this.filePathName = element.attachment_file_path;
              this.documentLink = fileName;
            } else if (element.attachment_title === 'challenge_audio' && element.attachment_file_path !== '') {
              // this.createProfileForm.controls.topic_audio.setValue(element.attachment_file_path);
              this.AudioLink = this.sanitizer.bypassSecurityTrustResourceUrl(fileName);
              // this.AudioLink = fileName;
            } else if (element.attachment_title === 'challenge_image' && element.attachment_file_path !== '') {
              //  this.createProfileForm.controls.topic_image.setValue(element.attachment_file_path);
              this.ImageLink = this.sanitizer.bypassSecurityTrustResourceUrl(fileName);
            } else if (element.attachment_title === 'challenge_video' && element.attachment_file_path !== '') {
              // this.createProfileForm.controls.topic_video.setValue(element.attachment_file_path);
              // this.VideoLink = this.sanitizer.bypassSecurityTrustResourceUrl(fileName);
              this.VideoLink = fileName;
            }
          });
        } else {
          this.documentLink = '';
          this.AudioLink = '';
          this.ImageLink = '';
          this.VideoLink = '';
        }
        this.cd.detectChanges();
      }
    }, err => this.isLoading = false);
  }

  createGroup() {
    this.fromConfirmPage = false;
    let payload = {
      "topic_id": this.challengeId, "group_id": null
    }
    $('#challengeGroup').modal('hide');
    $('#confirmGroup').modal('show');
    this.getRoles(payload, 'create');
  }

  participate(group) {
    this.group_id = group.group_id;
    this.fromConfirmPage = false;
    let payload = {
      "topic_id": this.challengeId, "group_id": group.group_id
    }
    $('#challengeGroup').modal('hide');
    $('#assignRole').modal('show');
    this.enableContinue = true;
    this.getRoles(payload, 'participate');
  }

  cancelFromGroupName() {
    const { groupName } = this.groupNameForm.value;
    if (this.fromConfirmPage) {
      this.groupName = groupName;
      $('#confirmGroup').modal('show');
      $('#groupName').modal('hide');
    } else {
      $('#groupName').modal('hide');
      $('#assignRole').modal('show');
    }
  }

  groupNext() {
    const { groupName } = this.groupNameForm.value;
    if (!this.groupNameForm.valid) {
      this.toastrService.warning('Please provide Group Name')
      return false;
    } else {
      if (this.fromConfirmPage) {
        this.groupName = groupName;
        $('#confirmGroup').modal('show');
        $('#groupName').modal('hide');
      } else {
        // this.viewBuddies();
        $('#Invite-Buddies').modal('show');
        $('#groupName').modal('hide');
      }

    }
  }

  assignNext() {
    if (!this.assignRoleForm.valid) {
      this.toastrService.warning('Please Select Role')
      return false;
    } else {
      $('#assignRole').modal('hide');
      $('#groupName').modal('show');
    }
  }

  cancelFromAssignRole() {
    $('#assignRole').modal('hide');
    $('#challengeModal').modal('show');
  }

  invitesNext() {
    if (this.UserEmailStore.length < 1) {
      this.toastrService.warning('Please invite buddies');
    } else {
      this.assignments = this.UserEmailStore;
      if (this.fromWorkAreaPage) {
        $('#confirmGroup').modal('show');
        $('#Invite-Buddies').modal('hide');
      } else {
        console.log('this.assignes', this.assignments)
        $('#submitDateModal').modal('show');
        $('#Invite-Buddies').modal('hide');
      }

    }
  }

  cancelFromInvites() {
    if (this.fromWorkAreaPage) {
      $('#confirmGroup').modal('show');
      $('#Invite-Buddies').modal('hide');
    } else {
      $('#groupName').modal('show');
      $('#Invite-Buddies').modal('hide');
    }
  }

  submitDateNext() {
    const { groupName } = this.groupNameForm.value;
    const { role } = this.assignRoleForm.value;
    this.confirmGroupForm.patchValue({
      role: role
    });
    this.groupName = groupName;
    // this.checkGroupName(this.groupName);
    $('#confirmGroup').modal('show');
    $('#submitDateModal').modal('hide');
  }

  cancelFromSubmissionDate() {
    $('#Invite-Buddies').modal('show');
    $('#submitDateModal').modal('hide');
  }

  checkGroupName() {
    const { groupName } = this.groupNameForm.value;
    this.isLoading = true;
    let payload = {
      topic_id: this.challengeId,
      group_name: groupName
    }
    this.studentHelperService.checkGroup(payload).subscribe(res => {
      this.isLoading = false;
      if (res.success) {
        this.isExist = false;
        this.toastrService.success('Group name Verified');
      } else {
        this.isExist = true;
        this.toastrService.warning('Group alredy existed');
      }
    }, err => this.isLoading = false);
  }

  assignRoleContinue() {
    this.isLoading = true;
    let payload = {
      role: this.selectedRole.role_id,
      role_name: this.selectedRole.role_name,
      role_assigned_to: this.st_details.user_email,
      role_avatar: this.selectedRole.role_img,
      group: this.group_id,
      topic_id: this.challengeId
    }
    this.studentHelperService.postSelectedRole(payload).subscribe(res => {
      if (res) {
        this.isLoading = false;
        this.toastrService.success('Your role submitted');
        $('#assignRole').modal('hide');
        $('#participateModal').modal('show');
        this.getGroupMembers();
        this.getComments();
        this.getTopicDetails(this.challenge);
        this.cd.detectChanges();
        // this.getAttachments();
      }
    }, err => this.isLoading = false);
  }

  validateGroupCreationData() {
    if (!this.groupNameForm.valid) {
      this.toastrService.warning('Please provide Group Name');
      return false;
    }
    if (!this.confirmGroupForm.controls.role.valid) {
      this.toastrService.warning('Please Select Role');
      return false;
    }
    if (this.UserEmailStore.length < 1) {
      this.toastrService.warning('Please Invite Buddies');
      return false;
    }
    if (this.UserEmailStore.length > this.topicDetails.topic_group_size) {
      this.toastrService
        .warning(`Only ${this.topicDetails.topic_group_size} members are allowed including you.`);
      return false;
    }

    return true;
  }

  confirmGroup() {
    this.isFormSubmitted = true;
    if (!this.validateGroupCreationData()) {
      this.isFormSubmitted = false;
      return;
    }
    const { groupName } = this.groupNameForm.value;
    const { roles, role } = this.confirmGroupForm.value;
    let assigness = this.UserEmailStore.map(element => {
      return { 'user_email': element['user_email'] };
    });
    if (!this.fromWorkAreaPage) {
      assigness.push({
        'user_email': this.st_details.user_email
      })
    }

    this.confirmGroupForm.patchValue({
      group_name: groupName,
      topic_id: this.challengeId,
      assignments: assigness,
      roles: roles
    })

    if (!this.confirmGroupForm.valid) {
      this.isFormSubmitted = false;
      this.toastrService.warning('Please fill details');
      return false;
    } else {
      const { assignments } = this.confirmGroupForm.value;
      if (this.assignFlag === 'invite' && !this.fromWorkAreaPage) {
        if (assignments.length !== this.rolesData.length) {
          this.isFormSubmitted = false;
          this.toastrService.warning('Invite members same number of roles');
          return false;
        } else {
          this.confirmGroupForm.removeControl('role');
          const payload = this.confirmGroupForm.value;
          this.service.saveGroup(payload).subscribe(result => {
            this.isFormSubmitted = false;
            if (result) {
              this.group_id = result.group_id;
              this.topic_assign_id = result.topic_assign_id;
              this.fromWorkAreaPage = false;
              this.confirmGroupForm.addControl('role', new FormControl(''));
              this.toastrService.success('Group has been created Successfully ');
              $('#congratulationsModal').modal('show');
              $('#confirmGroup').modal('hide');
            }
          }, err => {
            if (err.error.message === 'Group already exist') {
              this.isFormSubmitted = false;
              this.toastrService.warning('Group name already exist !');
              this.isExist = true;
            }
          });
        }

      } else if (this.assignFlag === 'invite' && this.fromWorkAreaPage) {
        //update group invite
        if (assignments.length !== this.rolesData.length) {
          this.isFormSubmitted = false;
          this.toastrService.warning('Invite members same number of roles');
          return false;
        } else {
          this.confirmGroupForm.removeControl('role');
          const payload = this.confirmGroupForm.value;
          payload.group_id = this.group_id;
          this.service.updateGroup(payload).subscribe(result => {
            this.isFormSubmitted = false;
            if (result) {
              this.group_id = result.group_id;
              this.topic_assign_id = result.topic_assign_id;
              this.fromWorkAreaPage = false;
              this.confirmGroupForm.addControl('role', new FormControl(''));
              this.toastrService.success('Details are updated successfully');
              this.getGroupMembers();
              this.getComments();
              this.getTopicDetails(this.challenge);
              $('#participateModal').modal('show');
              $('#confirmGroup').modal('hide');
            }
          }, err => {
            if (err.error.message === 'Group already exist') {
              this.isFormSubmitted = false;
              this.toastrService.warning('Group name already exist !');
              this.isExist = true;
            }
          });
        }

      } else if (this.assignFlag === 'auto' && this.fromWorkAreaPage) {
        // update Group data auto assign
        let payload = {
          "topic_id": this.challengeId,
          "group_name": groupName,
          "roles": roles,
          "auto_assign": 1,
          assignments: assigness,
          group_id: this.group_id
        }
        console.log('payload', payload);
        this.service.updateGroup(payload).subscribe(result => {
          this.isFormSubmitted = false;
          if (result) {
            this.group_id = result.group_id;
            this.fromWorkAreaPage = false;
            this.toastrService.success('Details are updated successfully');
            this.getGroupMembers();
            this.getComments();
            this.getTopicDetails(this.challenge);
            $('#participateModal').modal('show');
            $('#confirmGroup').modal('hide');
          }
        }, err => {
          if (err.error.message === 'Group already exist') {
            this.isFormSubmitted = false;
            this.toastrService.warning('Group already exist !');
          }
        });
      }
      else {
        // save Group data auto assign
        let payload = {
          "topic_id": this.challengeId,
          "group_name": groupName,
          "roles": roles,
          "auto_assign": 1,
          assignments: assigness,
        }
        console.log('payload', payload);
        this.service.saveGroup(payload).subscribe(result => {
          this.isFormSubmitted = false;
          if (result) {
            this.group_id = result.group_id;
            this.fromWorkAreaPage = false;
            this.toastrService.success('Group Created Succussfully');
            $('#congratulationsModal').modal('show');
            $('#confirmGroup').modal('hide');
          }
        }, err => {
          if (err.error.message === 'Group already exist') {
            this.isFormSubmitted = false;
            this.toastrService.warning('Group already exist !');
          }
        });
      }

    }
  }

  cancelFromConfirmGroup() {
    if (this.fromWorkAreaPage) {
      $('#participateModal').modal('show');
    } else {
      $('#challengeModal').modal('show');
    }
    $('#confirmGroup').modal('hide');
    this.searchRes = [];
    this.searchName = '';
  }

  goHome() {
    $('#congratulationsModal').modal('hide');
  }

  participateChallenge() {
    this.getGroupMembers();
    this.getComments();
    this.getTopicDetails(this.challenge);
    //  this.getAttachments();
    $('#congratulationsModal').modal('hide');
    $('#participateModal').modal('show');
  }

  submitChallenge() {
    if (this.final_submitted !== 1) {
      if (this.allowSubmit || this.topic_group_size == 1) {
        $('#submitChallengeModal').modal('show');
        this.attachements = this.videoFiles = this.imageFiles = this.files = [];
      }
      else {
        this.toastrService.warning('Waiting for the group members to accept the challenge...');
      }
    } else {
      this.toastrService.info('Challenge Submitted');
    }
  }

  changeGroupName() {
    this.fromConfirmPage = true;
    $('#groupName').modal('show');
    $('#confirmGroup').modal('hide');
  }

  // changeMembers() {
  //   this.fromWorkAreaPage = true;
  //   $('#Invite-Buddies').modal('show');
  //   $('#confirmGroup').modal('hide');
  // }


  getGroupMembers() {
    this.isLoading = true;
    this.studentHelperService.groupMembers({ 'group_id': this.group_id }).subscribe(res => {
      this.isLoading = false;
      if (res) {
        this.groupMembersList = res;
        this.actualGroupMemberList = res;
        this.groupMembersList = this.groupMembersList.filter(item => item.role_name !== null);
        this.challGroupName = this.groupMembersList[0].group_name;
        let groupOwner = this.groupMembersList.filter(item => item.is_group_owner == true);
        this.groupOwner = groupOwner[0].is_group_owner;
        this.groupOwnerRole = groupOwner[0].role_name;
        this.groupOwnerRoleImg = groupOwner[0].role_avatar;
        this.cd.detectChanges();

        const groupOwnerObject = res.find(each => each.is_group_owner);
        if (groupOwnerObject) {
          this.groupOwnerId = groupOwnerObject.user_id;
        }
        let challAccepted = res.find(each => each.group_id == null || each.role_assigned_to == null);
        if (challAccepted !== null && challAccepted !== undefined) {
          this.allowSubmit = false;
        }
      }
    }, err => this.isLoading = false);
  }

  closeModal() {
    $('#challengeModal').modal('hide');
    // location.reload();
  }

  closeCommentModal() {
    this.commentsRetrieved = [];
    $('#commentModal').modal('hide');
  }

  onImgError(event) {
    event.target.src = 'assets/img/pic-1.png'
  }

  loadGroups(challengeId) {
    this.isGroupsLoading = true;
    this.service.getGroupsListbyChallenge({ 'topic_id': challengeId }).subscribe(res => {
      this.isGroupsLoading = false;
      if (res) {
        this.groupsList = res;
      }
    }, err => this.isGroupsLoading = false);

  }

  loadChallenges() {
    this.spotLightChallenges = [];

    this.studentHelperService.spotLightChallenges().subscribe(res => {
      if (res) {

        this.spotLightChallenges = res;
        this.spotLightChallenges = this._uhs.getImageOrVideoFromChallenges(this.spotLightChallenges);
        this.isLoading = true;
        this.cd.detectChanges();
        console.log('spotlight', this.spotLightChallenges);
        setTimeout(() => {
          this.spotlightChallengeSliders();
          this.isLoading = false;
          this.cd.detectChanges();
        }, 3000);
      }
    }, err => this.isLoading = false);
  }

  topChallenges() {
    this.isLoading = true;
    this.top10Challenges = [];
    let payload = {
      time_filter: this.dateRangeSelected
    }
    this.studentHelperService.getChallengesTop10(payload).subscribe(res => {
      if (res) {
        console.log('res top10', res);
        this.top10Challenges = res;
        if (this.top10Challenges.length > 0) {
          this.top10Challenges = this._uhs.getOnlyImageFromChallenges(this.top10Challenges);
        }
        // setTimeout(() => {
        //   this.top10ChallengeSliders();
        //   this.isLoading = false;
        //   this.cd.detectChanges();
        // }, 5000);
      }
    }, err => this.isLoading = false);
  }

  recentChallenges() {
    this.isLoading = true;
    this.recentChall = [];
    let payload = {
      time_filter: this.dateRangeSelected
    };
    this.studentHelperService.getChallengesRecent(payload).subscribe(res => {
      if (res) {
        console.log('res recent', res);
        this.recentChall = res;
        if (this.recentChall.length) {
          this.recentChall = this._uhs.getOnlyImageFromChallenges(this.recentChall);
        }
        // setTimeout(() => {
        //   this.recentChallengeSliders();
        //   this.isLoading = false;
        //   this.cd.detectChanges();
        // }, 5000);
      }
    }, err => this.isLoading = false);
  }

  top10Responses() {
    this.isLoading = true;
    this.submissionsChall = [];
    this.studentHelperService.getTop10ResponsesChallenges().subscribe(res => {
      this.isLoading = false;
      if (res) {
        this.submissionsChall = res;
        if (this.submissionsChall.length > 0) {
          this.submissionsChall = this._uhs.getOnlyImageFromChallenges(this.submissionsChall);
        }
        console.log('res top submissions', res);
        // this.ngAfterContentInit();
        // setTimeout(() => {
        //   this.topResponsesChallengeSliders();
        //   this.isLoading = false;
        //   this.cd.detectChanges();
        // }, 5000);
      }
    }, err => this.isLoading = false);
  }

  getcontinueChallenges() {
    this.isLoading = true;
    this.continueChall = [];
    let payload = {
      time_filter: this.dateRangeSelected
    };
    this.studentHelperService.getChallengesContinue(payload).subscribe(res => {
      if (res) {
        console.log('res top10', res);
        this.continueChall = res;
        if (this.continueChall.length) {
          this.continueChall = this._uhs.getOnlyImageFromChallenges(this.continueChall);
        }
        // setTimeout(() => {
        //   this.continueChallengeSliders();
        //   this.isLoading = false;
        //   this.cd.detectChanges();
        // }, 5000);
      }
    }, err => this.isLoading = false);
  }

  trendingChallenges() {
    this.isLoading = true;
    this.trending = [];
    let payload = {
      time_filter: this.dateRangeSelected
    };
    this.studentHelperService.getChallengeTrend(payload).subscribe(res => {
      if (res) {
        console.log('res trending', res);
        this.trending = res;
        if (this.trending.length > 0) {
          this.trending = this._uhs.getOnlyImageFromChallenges(this.trending);
        }
        // setTimeout(() => {
        //   this.trendingChallengeSliders();
        //   this.isLoading = false;
        //   this.cd.detectChanges();
        // }, 5000);
      }
    }, err => this.isLoading = false);
  }

  getCardChallengeResponses(challenge) {
    let challResObservable: any;
    challenge.topic_response = [];
    if (challenge.topic_group_size === 1) {
      challResObservable = this.studentHelperService
        .getSoloChallengeResponses(challenge.topic_id);
    } else {
      challResObservable = this.studentHelperService
        .groupMemById(challenge.topic_id);
    }

    challResObservable.subscribe(res => {
      if (res) {
        challenge.topic_response = res;
      }
    }, err => this.isLoading = false);
  }

  myChallenges() {
    this.isLoading = true;
    this.myChall = [];
    let payload = {
      time_filter: this.dateRangeSelected
    };
    this.studentHelperService.getChallengeMine(payload).subscribe(res => {
      if (res) {
        console.log('res My', res);
        this.myChall = res;
        if (this.myChall.length) {
          this.myChall = this._uhs.getOnlyImageFromChallenges(this.myChall);
        }
        // setTimeout(() => {
        //   this.myChallengeSliders();
        //   this.isLoading = false;
        //   this.cd.detectChanges();
        // }, 5000);
      }
    }, err => this.isLoading = false);
  }

  upcomingChallengesList(): void {
    this.isLoading = true;
    this.upcomingChallenge = [];
    let payload = {
      time_filter: this.dateRangeSelected
    };
    this.studentHelperService.getUpcomingChallenges(payload).subscribe(res => {
      this.isLoading = false;
      if (res) {
        this.upcomingChallenge = res;
        if (this.upcomingChallenge.length) {
          this.upcomingChallenge = this._uhs.getOnlyImageFromChallenges(this.upcomingChallenge);
        }
      }
    }, err => this.isLoading = false);
  }

  influencerChallengesList() {
    this.isLoading = true;
    this.influencerChallenges = [];
    this.studentHelperService.getInfluencerChallenges().subscribe(res => {
      this.isLoading = false;
      if (res) {
        this.influencerChallenges = res;
        if (this.influencerChallenges.length) {
          this.influencerChallenges = this._uhs.getOnlyImageFromChallenges(this.influencerChallenges);
          console.log(this.influencerChallenges);
        }
      }
    }, err => this.isLoading = false);
  }

  onDateRangeChanged(filterVal: any) {
    this.dateRangeSelected = filterVal;

    this.top10Responses();
    this.topChallenges();
    this.trendingChallenges();
    this.myChallenges();
    this.upcomingChallengesList();
    this.getcontinueChallenges();
    this.recentChallenges();
    this.influencerChallengesList();

  }

  ngAfterContentChecked() {
    $(".slider").not('.slick-initialized').slick()
    setTimeout(() => {
      $('.top-responses-slider').not('.slick-initialized').slick({
        slidesToShow: 4,
        infinite: 0,
        slidesToScroll: 1,
        responsive: [
          {
            breakpoint: 768,
            settings: {
              arrows: false,

              slidesToShow: 3
            }
          },
          {
            breakpoint: 480,
            settings: {
              arrows: false,

              slidesToShow: 1
            }
          }
        ]
      });
      $('.recent-challenge-slider').not('.slick-initialized').slick({
        // centerMode: true,
        // centerPadding: '90px',
        // slidesToShow: 4,

        slidesToShow: 4,
        infinite: 0,
        slidesToScroll: 1,
        responsive: [
          {
            breakpoint: 768,
            settings: {
              arrows: false,

              slidesToShow: 3
            }
          },
          {
            breakpoint: 480,
            settings: {
              arrows: false,

              slidesToShow: 1
            }
          }
        ]
      });
      $('.continue-slider').not('.slick-initialized').slick({
        slidesToShow: 4,
        infinite: 0,
        slidesToScroll: 1,
        responsive: [
          {
            breakpoint: 768,
            settings: {
              arrows: false,
              slidesToShow: 3
            }
          },
          {
            breakpoint: 480,
            settings: {
              arrows: false,
              slidesToShow: 1
            }
          }
        ]
      });
      $('.top-challenges-slider').not('.slick-initialized').slick({
        // centerMode: true,
        // centerPadding: '90px',
        // slidesToShow: 4,

        slidesToShow: 4,
        infinite: 0,
        slidesToScroll: 1,
        responsive: [
          {
            breakpoint: 768,
            settings: {
              arrows: false,

              slidesToShow: 3
            }
          },
          {
            breakpoint: 480,
            settings: {
              arrows: false,

              slidesToShow: 1
            }
          }
        ]
      });
      $('.my-challenges-slider').not('.slick-initialized').slick({
        slidesToShow: 4,
        infinite: 0,
        slidesToScroll: 1,
        responsive: [
          {
            breakpoint: 768,
            settings: {
              arrows: false,

              slidesToShow: 3
            }
          },
          {
            breakpoint: 480,
            settings: {
              arrows: false,

              slidesToShow: 1
            }
          }
        ]
      });
      $('.trending-now-slider').not('.slick-initialized').slick({
        slidesToShow: 4,
        infinite: 0,
        slidesToScroll: 1,
        responsive: [
          {
            breakpoint: 768,
            settings: {
              arrows: false,
              slidesToShow: 3
            }
          },
          {
            breakpoint: 480,
            settings: {
              arrows: false,
              slidesToShow: 1
            }
          }
        ]
      });
    }, 5000);
    this.isLoading = false;
    this.cd.detectChanges();
  }


  spotlightChallengeSliders() {
    // Testimonials Slider Script
    $('.daily-dot-slider').slick({
      dots: true,
      infinite: 0,
      speed: 500,
      arrows: true
    });
  }


  openModal(content, link) {
    this.file = link;
    if (link === this.VideoLink) {
      this.fileType = `video`;
      this.mediaType = 'video/mp4';
    } else if (link === this.AudioLink) {
      this.fileType = 'audio';
      this.mediaType = 'audio/mp3';
    } else {
      this.fileType = 'image';
    }
    this.modalService.open(content, { size: 'md' });
  }

  openModalSpot(content, link, type) {
    this.file = link;
    if (type === 'video') {
      this.fileType = `video`;
      this.mediaType = 'video/mp4';
    } else {
      this.fileType = 'image';
    }
    this.modalService.open(content, { size: 'md' });
  }

  searchSpotlightChallenges(): void {
    this.isLoading = true;
    if (this.searchKeyword) {
      const data = {
        search_type: this.searchType,
        keyword: this.searchKeyword
      };
      this._uhs.searchData = data;
      this.router.navigate(['/main-route/student/spotlight-search'], {state: {searchData: data}});
    } else {
      this.isLoading = false;
      this.toastrService.warning('Please enter valid input details', 'Search');
    }
  }

  loadLeaderboardDetails(): void {
    this.studentHelperService.getLeaderboardDetails().subscribe( res => {
      this.leaderboardUserList = res;
      this.topLeaderboardUser = res[0];
    });
  }

  openOrCloseLeaderBoardPopup() {
    this.toggleLeaderBoard = !this.toggleLeaderBoard;
  }

  doReactionChanges(index: any, reactions: any) {
    this.submittedComments[index].truth = reactions[0].truth;
    this.submittedComments[index].fun = reactions[0].fun;
    this.submittedComments[index].creative = reactions[0].creative;
  }
}
