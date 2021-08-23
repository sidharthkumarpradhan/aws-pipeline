import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ERROR_MESSAGE } from 'src/app/shared/constant';
import { HelperService } from 'src/app/shared/services/helper.service';
import { forkJoin } from 'rxjs';
import { AdminHelperService } from 'src/app/modules/admin-dashboard/admin-helper.service';
import { FileUploadComponent } from 'src/app/shared/component/file-upload/file-upload.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StudentHelperService } from '../../student-helper.service';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { Store } from '@ngrx/store';
import { AuthState } from 'src/app/store/auth.model';
import { userInfo } from 'src/app/store/auth.selector';
declare var $: any;
declare var jQuery: any;
@Component({
  selector: 'app-student-groups-edit',
  templateUrl: './student-groups-edit.component.html',
  styleUrls: ['./student-groups-edit.component.css'],
  providers: [DatePipe]
})
export class StudentGroupsEditComponent implements OnInit {

  GroupData: any = [];
  buddiesList: any = [];
  challengesList: any = [];
  isViewMode: boolean = false;
  isLoading: boolean;
  isFormSubmitted: boolean;
  groupId: any;
  groupInfo: any;
  challenges: any;
  groupType: any;
  // rolesForGroup: any;
  assignments: any;
  // topicId: number;
  copiedData: any
  presentUsers: Array<object> = [];
  checkedIndex: any;
  isLoader2: boolean;
  comments: string;
  count: number;
  isCheck: string;
  UserEmailStore: Array<object> = [];
  commentInfo: Array<object> = [];
  submitted: Boolean = false;
  public id = 0;
  wordCount: any;
  roleText: any;
  challengeId: any;
  userName: any;
  searchValue: any;
  searchName: any;
  searchPayload: any;
  st_details: any;
  searchRes: any;
  inviteShow: boolean;
  isCheckInvite: Boolean = true;
  logggedUserEmail: any;
  myDate = new Date();
  commentsRetrieved: any;
  filename: any;
  assignmenedUser: any;
  editGroup: Boolean = false;
  roleIndex: any;
  isRoleMode: Boolean = false;
  defaultAll: Boolean = false;
  displayBuddies: any;
  FileUploaded: Boolean = false;
  fromPage: any;
  @ViewChild('text', { static: false }) text: ElementRef;
  words: any;
  filePathLocation: any;
  wordCounter() {
    //alert(this.text.nativeElement.value)
    this.wordCount = this.text ? this.text.nativeElement.value : 0;
    this.words = this.wordCount ? this.wordCount.length : 0;
  }


  /**
   * Tag input
   */
  // validators = [this.must_be_email];
  // errorMessages = {
  //   'must_be_email': 'Please be sure to use a valid email format'
  // };
  // must_be_email(control: FormControl) {
  //   // var EMAIL_REGEXP = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/i;
  //   // if (control.value.length != "" && !EMAIL_REGEXP.test(control.value)) {
  //   //   return { "must_be_email": true };
  //   // }

  //   if (control.value.length != "") {
  //     return { "must_be_email": true };
  //   }
  //   return null;
  // }

  creategroupForm = this.fb.group({
    group_name: [null, [Validators.required]],
    topic_id: [null, [Validators.required]],
    assignments: [null, [Validators.required]],
    roles: this.fb.array([this.fb.group({
      role_name: [''],
      role_assigned_to: [''],
      group_role_id: ['']
    })])
  });

  commentForm = this.fb.group({
    response_description: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]]
  });


  dropdownSettings = {
    singleSelection: true,
    idField: 'topic_id',
    textField: 'topic_name',
    allowSearchFilter: true,
    closeDropDownOnSelection: true
  };

  constructor(
    public _uhs: HelperService,
    private fb: FormBuilder,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private service: AdminHelperService,
    private toastrService: ToastrService,
    private cd: ChangeDetectorRef,
    private studentHelperService: StudentHelperService,
    private modalService: NgbModal,
    private datePipe: DatePipe,
    private store: Store<AuthState>
  ) { }

  ngOnInit() {
    this.store.select(userInfo).subscribe(res => {
      if (res) {
        this.st_details = res;
      }
    });

    this.count = 0;
    this.inviteShow = true;
    this.filePathLocation = environment.fileLocation;
    this.userName = sessionStorage.getItem('display_name');
    const challengeType = this.activateRoute.snapshot.params['type'];
    this.groupId = this.activateRoute.snapshot.params['id'];

    this.activateRoute.queryParams.subscribe(params => {
      console.log('params', params);
      this.challengeId = params.challengeId;
      this.isViewMode = params.fromPage;
      this.fromPage = params.fromPage;
      console.log(this.fromPage, 'this.fromPage');
      this.cd.detectChanges();
    });

    this.creategroupForm.patchValue({
      topic_id: Number(this.challengeId) ? Number(this.challengeId) : ''
    })
    this.isViewMode = challengeType === 'view';
    if (this.isViewMode) {
      this.getGroupDetails();
    }

    if (challengeType === 'edit') {
      this.groupType = 'Edit';
      this.roleText = 'Edit';
      this.editGroup = true;
      //  this.UserEmailStore.push(this.logggedUserEmail);
    } else if (challengeType === 'view') {
      this.groupType = 'View';
      this.creategroupForm.controls.topic_id.disable();
      this.roleText = 'Select';
      this.getComments();
      // this.creategroupForm.removeControl('')
    } else {
      this.groupType = 'Create';
      this.roleText = 'Create';
      this.logggedUserEmail = this.st_details.user_email ? this.st_details.user_email : this.st_details.user_gmail
      this.populateAssignments([this.logggedUserEmail]);
      this.UserEmailStore.push(this.logggedUserEmail);
    }

    this.loadData(challengeType);
    console.log(this.isViewMode, 'this.isViewMode');

  }

  receiveComment($event) {
    this.comments = $event;
    this.count = this.comments.length;
    console.log(this.comments.length);
  }


  recieveCount($event) {
    this.comments = $event;
    this.count = this.comments.length;
  }

  openDocument(event: any, fileUrl: string) {
    let filePath = environment.fileLocation + fileUrl;
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

  backToChallenge() {
    if (this.UserEmailStore.length > 4) {
      this.toastrService.warning('You can not invite more than 4 Students');
      return false;
    } else {
      $('#buddiesSearchModal4').modal('hide');
    }
  }

  saveEmails() {
    if (this.UserEmailStore.length > 4) {
      this.toastrService.warning('You can not invite more than 4 Students');
      return false;
    } else {
      $('#buddiesSearchModal4').modal('hide');
      this.creategroupForm.patchValue({
        assignments: this.UserEmailStore
      })
      this.searchName = this.searchName;

      this.loadStudents(this.UserEmailStore);
    }
  }

  searchBy(selectionValue) {
    this.cd.detectChanges();
    this.searchValue = selectionValue;
  }

  onChange(): void {
    this.inviteShow = !this.inviteShow;
  }

  onChangeValue(value) {
    this.searchName = value;
  }

  checkUser(user, event) {
    let userChek = event.srcElement.checked;
    if (userChek) {
      this.UserEmailStore.push(user.user_email);
    } else {
      this.UserEmailStore = this.UserEmailStore.filter(item => item !== user.user_email)
    }
    console.log('useremails', this.UserEmailStore);
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

  updateUsersDom(presentUsers) {
    this.UserEmailStore = [];
    const emails = this.getEmailsRemain(presentUsers);

    emails.forEach(email => {
      this.UserEmailStore.push(email)
    });

    console.log("after removed", this.UserEmailStore);
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
        "school_name": this.searchName
      }
    } else if (this.searchValue === 'class') {
      this.isCheck = this.searchValue;
      this.searchPayload = {
        "class_details": this.searchName
      }
    } else if (this.searchValue === 'name') {
      this.isCheck = this.searchValue;
      this.searchPayload = {
        "display_name": this.searchName
      }
    } else if (this.searchValue === 'skill') {
      this.isCheck = this.searchValue;
      this.searchPayload = {
        "skill": this.searchName
      }
    } else if (this.searchValue === 'age') {
      this.isCheck = this.searchValue;
      this.searchPayload = {
        "age": this.searchName
      }
    }

    this.studentHelperService.searchByValue(this.searchPayload).subscribe((resp) => {
      console.log('..... search result', resp);
      resp = resp.filter((item) => item.user_id !== this.st_details.user_id);
      this.searchRes = resp;
      if (this.searchRes.length > 0) {
        $('#buddiesSearchModal4').modal('show');
        // $('#shareModal').modal('hide');
        // $('#challengeModal').modal('hide');
      }
      // this.searchRes.push({
      //   'isCheck': this.isCheck,
      //   'searchName': this.searchName
      // });
      // this.onSearchPicked.emit(this.searchRes);

      let PresentInData = resp.filter(entry1 =>
        this.UserEmailStore.some(entry2 => entry1.user_email === entry2));

      PresentInData.map(item => {
        item['selected'] = true
      });
      console.log('PresentInData', PresentInData)
      this.isLoading = false;

    }, () => {
      this.isLoading = false;
      console.log('error ......');
      this.toastrService.error('Unable to get ');
    })
  }

  addRoleField(): void {
    const temp = this.fb.group({
      role_name: [''],
      role_assigned_to: [''],
      group_role_id: ['']
    });
    const fa = <FormArray>this.creategroupForm.get('roles');
    fa.push(temp);
  }

  deleteRole(i: number): void {
    const fa = <FormArray>this.creategroupForm.get('roles');
    fa.removeAt(i);
    this.creategroupForm.markAsDirty();
  }

  loadData(type) {
    const reqArray = [];
    this.isLoader2 = true;
    if (type === 'create') { // create Group
      // this.addRoleField();

      forkJoin([
        this.service.getBuddiesList(),
        this.service.getChallengesList()
      ]).subscribe(results => {
        this.isLoader2 = false;
        if (results && results.length) {
          this.buddiesList = this.displayBuddiesList(results[0]);
          this.challenges = results[1];
        }
      }, err => this.isLoader2 = false);
    }
    else {
      const groupId = this.groupId;
      reqArray.push(this.service.getRoles({ groupId }));
      reqArray.push(this.service.assignmentsGroup({ groupId }));

      if (type === 'view') { // View Group
        reqArray.push(this.service.getGroupData(this.groupId));
        forkJoin(reqArray).subscribe(result => {
          this.isLoader2 = false;
          console.log('result', result[1]);
          this.getUserAssginementId(result[1]);
          const emails = this.getUserEmails(result[1]);
          this.populateAssignments(emails);
          this.populateRoles(result[0]);
          this.GroupData = result[2];
          this.GroupData['emails'] = emails;
          this.updateForm();
        }, err => this.isLoader2 = false);

      } else { // edit group
        reqArray.push(this.service.getBuddiesList());
        reqArray.push(this.service.getChallengesList());
        reqArray.push(this.service.getGroupData(this.groupId));
        forkJoin(reqArray).subscribe(result => {
          this.isLoader2 = false;
          console.log('result2', result[2]);
          const emails = this.getUserEmails(result[1]);
          this.buddiesList = this.displayBuddiesList(result[2]);
          this.challenges = result[3];
          this.populateAssignments(emails);
          this.populateRoles(result[0]);
          if (result[4]) {
            this.GroupData = result[4];
            this.GroupData['emails'] = emails;

            this.updateForm();
          } else {
            this.router.navigate(['/main-route/student/spotlight-groups/' + this.challengeId]);
          }
        }, err => this.isLoader2 = false);
      }
    }
  }

  getUserAssginementId(result) {
    this.assignmenedUser = result.filter(item => item.user_id == this.st_details.user_id);
    console.log('assigned user', this.assignmenedUser);
  }

  displayBuddiesList(result) {
    this.displayBuddies = result;
    if (result && result.length) {
      result = result.filter(item => item.user_id !== this.st_details.user_id);
      //  return result.map(({ user_email, user_gmail }) => user_email ? user_email : user_gmail);
      return result.map(({ display_name }) => display_name);
    } else {
      return null;
    }
  }

  onChangeRole(roleIndex) {
    const { roles } = this.creategroupForm.value;
    console.log('.roles', roles);
    this.roleIndex = roleIndex;
  }

  populateAssignments(emailsList: any): void {
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

  populateRoles(roles) {
    const { role } = this.creategroupForm.value;
    const fa = <FormArray>this.creategroupForm.get('roles');
    fa.removeAt(0);
    if (roles && roles.length) {
      roles.forEach((element) => {
        const { role_name, role_assigned_to, group_role_id } = element;
        const temp = this.fb.group({
          role_name: [role_name],
          role_assigned_to: [role_assigned_to],
          group_role_id: [group_role_id]
        });
        fa.push(temp);

      });
    }
    if (this.isViewMode) {
      let formValue = fa.value;
      formValue.forEach((element, i) => {
        if ((element.role_assigned_to !== null)) {
          if ((element.role_assigned_to !== '')) {
            if (element.role_assigned_to == this.st_details.user_id) {
              this.isRoleMode = true;
              this.defaultAll = true;
              this.checkedIndex = i;
              fa.disable();
              return false;
            } else {
              if (!this.defaultAll) {
                fa.controls[i]['controls'].role_assigned_to.disable();
                fa.controls[i]['controls'].role_name.disable();
                this.checkedIndex = i;
              }
            }
          }
        }
      });
    }

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

  deleteFile(event: Event) {
    event.stopPropagation();
    this.filename = '';
    this.FileUploaded = false;
    console.log('this.filename', this.filename, this.FileUploaded);
  }

  saveComment() {
    let TodayDate = this.datePipe.transform(this.myDate, 'yyyy-MM-dd hh:mm:ss');
    if (this.commentForm.invalid) {
      return false;
    } else {
      this.isLoading = true;
      let payload = {
        "response_description": this.commentForm.controls['response_description'].value,
        "date_of_response": TodayDate,
        "topic_assign": this.assignmenedUser[0].topic_assign_id,
        "attachment_file_path": this.filename
      }
      this.studentHelperService.addComments(payload).subscribe(res => {
        if (res) {
          this.isLoading = false;
          this.getComments();
          this.cd.detectChanges();
          this.commentForm.reset();
          this.FileUploaded = false;
          this.filename = '';
        }
      }, err => this.isLoading = false);

    }
  }

  getComments() {
    this.isLoading = true;
    this.studentHelperService.getCommentRetrieveGroup(this.groupId).subscribe(res => {
      if (res) {
        this.commentsRetrieved = res;
        this.isLoading = false
        this.cd.detectChanges();
      }
    }, err => this.isLoading = false);
  }

  getGroupDetails() {
    this.isLoading = true;
    this.service.getGroupData(this.groupId).subscribe(res => {
      this.isLoading = false;
      if (res) {
        this.GroupData = res;
        this.updateForm();
      } else {
        this.router.navigate(['/main-route/student/spotlight-groups/' + this.challengeId]);
      }
    }, err => {
      this.isLoading = false;
      this.router.navigate(['/main-route/student/spotlight-groups/' + this.challengeId]);
    });
  }

  commentLike(selectedLike) {
    this.isLoading = true;
    let payload = {
      "rating_value": selectedLike,
      "topic_response": Number(this.challengeId),
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

  updateForm(): void {
    const userData = this.GroupData;
    if (this.isViewMode) {
      this.creategroupForm.patchValue({
        group_name: userData.group_name,
        topic_id: userData.topic.topic_name,
        assignments: userData.emails
      });
    } else {
      const itemText = this.challenges.filter(item => item.topic_id == userData.topic_id);
      const selectedItems = [{ topic_id: userData.topic_id, topic_name: itemText[0].topic_name }];
      this.creategroupForm.patchValue({
        group_name: userData.group_name,
        topic_id: selectedItems,
        assignments: userData.emails
      });
    }
  }

  getUserEmails(emailsArray: any) {
    if (emailsArray && emailsArray.length) {
      return emailsArray.map(({ topic_assign_id, user }) => {
        return user.user_email ? user.user_email : user.user_gmail;

        // return {
        //   'topic_assign_id': topic_assign_id,
        //   'user_email': user.user_email ? user.user_email : user.user_gmail
        // };
        // return Object.assign({}, {user_email: email});
      })
    }
  }

  getEmailsRemain(emailsArray: any) {
    if (emailsArray && emailsArray.length) {
      return emailsArray.map((user) => {
        return user.user_email ? user.user_email : user.user_gmail;
        // return Object.assign({}, {user_email: email});
      })
    }
  }

  backToGroups() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        'fromPage': this.fromPage
      }
    };
    this.router.navigate(['/main-route/student/spotlight-groups/' + this.challengeId], navigationExtras);
  }

  onImgError(event) {
    event.target.src = 'assets/img/pic-1.png'
  }

  /* getBuddiesList() {
    this.isLoading = true;
    this.service.getBuddiesList().subscribe(res => {
      this.isLoading = false;
      if (res) {
        this.buddiesList = res.map ( ({user_email, user_gmail}) =>  user_email ? user_email : user_gmail)
      }
    }, err => this.isLoading = false);
  } */

  get roleFields() {
    return this.creategroupForm.get('roles') as FormArray;
  }

  submitmarkAsTouched() {
    Object.values(this.creategroupForm.controls).forEach((control: any) => {
      control.markAsTouched();
    });
  }


  saveGroup() {
    if (this.creategroupForm.valid) {
      this.isFormSubmitted = true;
      const groupFormData = this.creategroupForm.getRawValue();
      if (groupFormData['assignments'] && groupFormData['assignments'].length) {
        const assignmentsList = [...groupFormData['assignments']];
        if (assignmentsList && assignmentsList.length) {
          groupFormData['assignments'] = assignmentsList.map(element => {
            if (element.hasOwnProperty('display')) {
              return { 'user_email': element.display };
            } else if (!element.hasOwnProperty('user_email')) {
              return { 'user_email': element };
            }
            else {
              return element;
            }
          });
        }
      }
      console.log(groupFormData['topic_id']);
      let challengeId = Number(this.challengeId);
      if (Array.isArray(groupFormData['topic_id'])) {
        groupFormData['topic_id'] = challengeId;
      } else {
        groupFormData['topic_id'] = challengeId;
      }


      if (this.groupId) {
        if (this.groupType == 'View') {
          // update roles Group data
          groupFormData['group_id'] = +this.groupId;
          delete groupFormData['assignments'];
          groupFormData.roles.forEach((element, i) => {
            if (i == this.roleIndex) {
              groupFormData['roles'][i]['role_assigned_to'] = this.st_details.user_id;
            }
          });
          console.log('groupFormData', groupFormData);
          this.service.updateGroup(groupFormData).subscribe(result => {
            this.isFormSubmitted = false;
            if (result) {
              this.toastrService.success(ERROR_MESSAGE.RECORD_UPDATED);
              this.router.navigate(['/main-route/student/spotlight-groups/' + this.challengeId]);
            }
          }, err => this.isFormSubmitted = false);
        } else {
          // update Group data
          groupFormData['group_id'] = +this.groupId;
          groupFormData.roles.forEach((element, i) => {
            if (i == this.roleIndex) {
              groupFormData['roles'][i]['role_assigned_to'] = this.st_details.user_id;
            }
          });
          console.log('groupFormData', groupFormData);
          this.service.updateGroup(groupFormData).subscribe(result => {
            this.isFormSubmitted = false;
            if (result) {
              this.toastrService.success(ERROR_MESSAGE.RECORD_UPDATED);
              this.router.navigate(['/main-route/student/spotlight-groups/' + this.challengeId]);
            }
          }, err => this.isFormSubmitted = false);
        }

      } else {
        if (this.inviteShow) {
          // save Group data invite buddies
          groupFormData['group_description'] = null;

          this.service.saveGroup(groupFormData).subscribe(result => {
            this.isFormSubmitted = false;
            if (result) {
              this.toastrService.success(ERROR_MESSAGE.RECORD_ADDED);
              this.router.navigate(['/main-route/student/spotlight-groups/' + this.challengeId]);
            }
          }, err => this.isFormSubmitted = false);
        } else {
          // save Group data auto assign
          let payload = {
            "topic_id": groupFormData.topic_id,
            "group_name": groupFormData.group_name,
            "roles": groupFormData.roles,
            "auto_assign": 1
          }
          console.log('payload', payload);
          this.service.saveGroup(payload).subscribe(result => {
            this.isFormSubmitted = false;
            if (result) {
              this.toastrService.success(ERROR_MESSAGE.RECORD_ADDED);
              this.router.navigate(['/main-route/student/spotlight-groups/' + this.challengeId]);
            }
          }, err => this.isFormSubmitted = false);
        }

      }
    } else {
      this.toastrService.warning(ERROR_MESSAGE.FIELDS_REQUIRED);
      this.submitmarkAsTouched();
      return false;
    }
  }

}
