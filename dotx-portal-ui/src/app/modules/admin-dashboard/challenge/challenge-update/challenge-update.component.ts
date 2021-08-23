import {environment} from 'src/environments/environment';
import {FileUploadComponent} from './../../../../shared/component/file-upload/file-upload.component';

import {ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, ValidatorFn, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';
import {ERROR_MESSAGE, SUCCESS_MESSAGE} from 'src/app/shared/constant';
import {HelperService} from 'src/app/shared/services/helper.service';
import {AdminHelperService} from '../../admin-helper.service';
import {AuthState} from 'src/app/store/auth.model';
import {Store} from '@ngrx/store';
import {userInfo} from 'src/app/store/auth.selector';

@Component({
  selector: 'app-challenge-update',
  templateUrl: './challenge-update.component.html',
  styles: [`.delete_mediafile {
    position: absolute;
    top: -5px;
    right: -20px;
    border: 1px solid #ccc;
    border-radius: 50%
  }

  .delete_mediafile span {
    width: 19px;
    height: 19px;
    padding-top: 0px;
  }`]
})

export class ChallengeUpdateComponent implements OnInit {

  @Input() data;
  @ViewChild('searchInput', { static: false }) searchInput: ElementRef;
  // @ViewChild(content, { static: false })
  isLoading: boolean;
  isUrlLoading: boolean;
  fileUrl: string;
  fileType: string;
  mediaType: string;
  formSubmitted = false
  headerName: string;
  userInfo: any;
  isViewMode: boolean = false;
  challengeId: any;
  assignments: any;
  selectedInvite: any = 'Broadcast';
  finalPayload: any;
  broadcast_showHide: boolean;
  select_showHide: boolean;
  broadcast: any;
  restrictSubmit: boolean;
  challengeBadge = 'assets/img/upload-avatar.png';
  selectedType: string;
  documentLink: string;
  ImageLink: string;
  AudioLink: string;
  VideoLink: string;
  filePath: string;
  file: string;
  userId: any;
  challengeData: any;
  disableField: Boolean = false;
  roleImage: any;
  spotlightStartMin: any;
  spotlightEndMin: any;
  setPublishMaxDate: any;
  enableRoles: Boolean = true;
  isdiableMode: Boolean = false;
  rolesSize: Number;
  roleImages: any = [];
  buddiesList: any = [];
  tagsList: any = [];
  roleImage_: any;
  roleImage_one: any;
  roleImage_two: any;
  roleImage_three: any;
  defaultRoleImage = 'assets/img/role-img.png';
  isShow: Boolean = false;
  baseImagePath = environment.fileLocation;
  createProfileForm = this.fb.group({
    topic_name: [null, [Validators.required]],
    topic_description: [null, [Validators.required]],
    topic_earning_title: ['', [Validators.required]],
    topic_earning_badge: [''],
    topic_image: [''],
    topic_video: [''],
    topic_audio: [''],
    topic_document: [''],
    topic_dot_coins: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
    participation_dot_coins: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
    assignments: [null,],
    roles: this.fb.array([]),
    tags: [''],
    topic_broadcast: ['1', [Validators.required]],
    is_spotlight: [0,],
    is_influencer_challenge: [0,],
    influencer_name: [''],
    published_date: [null],
    topic_status: [''],
    topic_group_size: ['', [Validators.required, Validators.min(1), Validators.max(4), Validators.pattern('^[0-9]*$')]],
    topic_start_date: ['', [Validators.required]],
    topic_end_date: ['', [Validators.required]],
    topic_level: ['', [Validators.required]]
    //CustomeDateValidators.fromToDate('topic_start_date', 'topic_end_date','Start date must be greater than enddate')
  });

  /**
   * Tag input
   */
  validators = [this.must_be_email];
  errorMessages = {
    'must_be_email': 'Please be sure to use a valid email format'
  };
  must_be_email(control: FormControl) {
    var EMAIL_REGEXP = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/i;
    if (control.value.length != "" && !EMAIL_REGEXP.test(control.value)) {
      return { "must_be_email": true };
    }
    return null;
  }

  constructor(
    public activeModal: NgbActiveModal,
    public _uhs: HelperService,
    private fb: FormBuilder,
    private router: Router,
    private cd: ChangeDetectorRef,
    private modalService: NgbModal,
    private activateRoute: ActivatedRoute,
    private service: AdminHelperService,
    private toastrService: ToastrService,
    private store: Store<AuthState>
  ) { }

  ngOnInit() {
    this.store.select(userInfo).subscribe(res => {
      if (res) {
        this.userId = res.user_id;
      }
    });
    const challengeType = this.activateRoute.snapshot.params['type'];
    const broadcast = this.activateRoute.snapshot.queryParams['broadcast'];
    this.challengeId = this.activateRoute.snapshot.params['id'];
    this.isViewMode = challengeType === 'view';
    this.spotlightStartMin = this.getSpotlighFormattedStartMinDate();
    //this.spotlightEndMin=this.getSpotlighFormattedEndMinDate();
    console.log('start date', this.spotlightStartMin);
    console.log(this.spotlightEndMin);
    // this.disableField = challengeType === 'view';
    this.broadcast = broadcast;

    if (this.challengeId) {
      this.getChallengeDetails();
      this.getAttachments();
    }

    if (this.broadcast == '0') {
      this.changeSelect('selectBuddies');
      this.getAssignments();
    } else {
      this.changeBroadCast('Broadcast');

    }

    if (this.challengeId && this.broadcast == '1') {
      this.disableField = true;
    }

    if (!this.isViewMode) {
      this.getBuddiesList();
    }
  }
  SetEnddate(event) {
    this.spotlightEndMin = this.getSpotlighFormattedEndMinDate(event, 1);
    this.setPublishMaxDate = this.getSpotlighFormattedEndMinDate(event, 0);
  }

  getAttachments() {
    const topic_id = this.challengeId
    this.service.getChallengeMediaFiles({ topic_id }).subscribe((res: any) => {
      if (res && res.length) {
        res.forEach(element => {
          const fileName = environment.fileLocation + element.attachment_file_path;
          if (element.attachment_title === 'challenge_document' && element.attachment_file_path !== '') {
            this.createProfileForm.controls.topic_document.setValue(element.attachment_file_path);
            this.documentLink = fileName;
          } else if (element.attachment_title === 'challenge_audio' && element.attachment_file_path !== '') {
            this.createProfileForm.controls.topic_audio.setValue(element.attachment_file_path);
            this.AudioLink = fileName;
          } else if (element.attachment_title === 'challenge_image' && element.attachment_file_path !== '') {
            this.createProfileForm.controls.topic_image.setValue(element.attachment_file_path);
            this.ImageLink = fileName;
          } else if (element.attachment_title === 'challenge_video' && element.attachment_file_path !== '') {
            this.createProfileForm.controls.topic_video.setValue(element.attachment_file_path);
            this.VideoLink = fileName;
          }
        });
      }
    })
  }

  getSpotlighFormattedStartMinDate() {
    const current = new Date();
    return {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate()
    };
  }

  getSpotlighFormattedEndMinDate(event, plusDays) {
    var current = new Date(event.year, event.month - 1, event.day);
    var nextday = new Date(current);
    nextday.setDate(current.getDate() + plusDays);
    return {
      year: nextday.getFullYear(),
      month: nextday.getMonth() + 1,
      day: nextday.getDate()
    };
  }

  getChallengeDetails(): void {
    this.isLoading = true;
    this.service.TopicDetailsById(this.challengeId).subscribe(res => {
      this.isLoading = false;
      if (res) {
        this.challengeData = res;
        this.updateForm();
        this.populateRoles(res.roles);
        this.populateTags(res.tags);
        // if (this.broadcast == 1) {
        //   this.changeSelect('selectBuddies');
        //   this.disableField = true;
        // } else {
        //   this.changeSelect('selectBuddies');
        //   this.getAssignments();
        // }

      } else {
        this.router.navigate(['/main-route/m/challenge']);
      }
    }, err => {
      this.isLoading = false;
      this.router.navigate(['/main-route/m/challenge']);
    });
  }

  populateTags(tags) {

    this.tagsList = tags;
    this.cd.detectChanges();
  }

  populateRoles(roles) {
    const fa = <FormArray>this.createProfileForm.get('roles');
    fa.removeAt(0);
    if (roles && roles.length) {
      this.isShow = true;
      roles.forEach((element, index) => {
        const { role_name, role_img, role_id } = element;
        const temp = this.fb.group({
          role_id: [role_id],
          role_name: [role_name],
          role_img: [role_img],
        });
        fa.push(temp);
        this.rolesSize = roles.length;

        if (index == 0) {
          this.roleImage_ = `${environment.fileLocation}${element.role_img}`;
        } else if (index == 1) {
          this.roleImage_one = `${environment.fileLocation}${element.role_img}`;
        } else if (index == 2) {
          this.roleImage_two = `${environment.fileLocation}${element.role_img}`;
        } else if (index == 3) {
          this.roleImage_three = `${environment.fileLocation}${element.role_img}`;
        }
      });
    }
  }

  scroll(className: string): void {
    const elementList = document.querySelectorAll(className);
    const element = elementList[0] as HTMLElement;
    element.scrollIntoView({ behavior: 'smooth' });
  }

  submitmarkAsTouched(): void {
    Object.values(this.createProfileForm.controls).forEach((control: any) => {
      control.markAsTouched();
    });
  }

  addRoleField(): void {
    const temp = this.fb.group({
      role_name: [''],
      role_img: [''],
      role_id: ['']
    });
    const fa = <FormArray>this.createProfileForm.get('roles');
    fa.push(temp);
  }

  deleteRole(i: number): void {
    const fa = <FormArray>this.createProfileForm.get('roles');
    fa.removeAt(i);
    this.createProfileForm.markAsDirty();
    console.log(fa.value.length)
  }

  get roleFields() {
    return this.createProfileForm.get('roles') as FormArray;
  }

  onChangeSize() {
    let { topic_group_size, roles } = this.createProfileForm.value;
    if (topic_group_size === '1') {
      this.enableRoles = false;
      this.isShow = false;
      roles = [];
    } else {
      this.isShow = true;
      this.enableRoles = true;
      if (topic_group_size === '2') {
        this.rolesSize = 2;
      } else if (topic_group_size === '3') {
        this.rolesSize = 3;
      } else if (topic_group_size === '4') {
        this.rolesSize = 4;
      }
    }
  }

  openAvatarModal(roleIndex) {
    const modalData = {
      headerName: 'Role Image',
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
        const file = reason[0].file;
        this.roleImage = (this.validUrl(file)) ? file.name : `${environment.fileLocation}${file}`;

        let { roles } = this.createProfileForm.value;
        roles.forEach((role, index) => {
          if (roleIndex == index) {
            if (roleIndex == 0) {
              role.role_img = file;
              this.roleImage_ = this.roleImage;
            } else if (roleIndex == 1) {
              role.role_img = file;
              this.roleImage_one = this.roleImage;
            } else if (roleIndex == 2) {
              role.role_img = file;
              this.roleImage_two = this.roleImage;
            } else if (roleIndex == 3) {
              role.role_img = file;
              this.roleImage_three = this.roleImage;
            }
          }
        });
        this.cd.detectChanges();
        console.log('url roleImage', this.roleImage, this.createProfileForm.value);
      }
    });
  }

  onImgError(event) {
    event.target.src = this.defaultRoleImage;
  }

  validUrl(link: string) {
    if (!link) { return false }
    return (link.indexOf('http://') === 0 || link.indexOf('https://') === 0);
  }

  getBuddiesList(): void {
    this.isLoading = true;
    this.service.getBuddiesList().subscribe(res => {
      this.isLoading = false;
      if (res) {
        res = res.filter(item => item.user_id !== this.userId);
        this.buddiesList = res.map(({ user_email, user_gmail, user_id }) => {
          const mail = user_email ? user_email : user_gmail;
          return { user_id: user_id, user_email: mail };
        });
      }
    }, err => this.isLoading = false);

  }

  getAssignments() {
    if (this.challengeId) {
      this.challengeId = +this.challengeId;
      this.service.assignmentsChallenge(this.challengeId).subscribe(res => {
        this.isLoading = false;
        this.assignments = res;
        this.updateAssignments(this.assignments);
      }, err => this.isLoading = false);
    }
  }

  updateAssignments(assignments: any): void {
    let arrUserEmail = [];
    if (assignments !== undefined) {
      assignments.forEach(element => {
        arrUserEmail.push(element.user.user_gmail ? element.user.user_gmail : element.user.user_email)
      });
      this.createProfileForm.patchValue({
        assignments: arrUserEmail
      });
    }

  }

  updateForm(): void {
    const userData = this.challengeData;
    console.log(userData);
    let today = new Date().toISOString().slice(0, 10);
    // userData = JSON.parse(userData);
    this.createProfileForm.patchValue({
      topic_name: userData.topic_name,
      topic_description: userData.topic_description,
      topic_earning_title: userData.topic_earning_title,
      topic_earning_badge: userData.topic_earning_badge,
      topic_dot_coins: userData.topic_dot_coins,
      participation_dot_coins: userData.participation_dot_coins,
      assignments: userData.assignments,
      topic_broadcast: userData.topic_broadcast,
      is_spotlight: userData.is_spotlight,
      is_influencer_challenge: userData.is_influencer_challenge,
      influencer_name: userData.influencer_name,
      topic_group_size: userData.topic_group_size,
      topic_start_date: this._uhs.getFormattedDateForAdminChall(userData.topic_start_date),
      topic_end_date: this._uhs.getFormattedDateForAdminChall(userData.topic_end_date),
      published_date: this._uhs.getFormattedDateForAdminChall(userData.published_date),
      topic_status: userData.topic_status,
      topic_level: userData.topic_level
    });

    if (userData.topic_start_date.slice(0, 10) < today) {
      this.isdiableMode = true;
      this.spotlightStartMin = this._uhs.getFormattedDateForAdminChall(userData.topic_start_date);
    }
    if (userData.topic_broadcast === null) {
      this.createProfileForm.controls['topic_broadcast'].setValue('1');
    }
    if (userData.topic_earning_badge) {
      this.challengeBadge = `${environment.fileLocation}${userData.topic_earning_badge}`
    }
  }

  removeTag(tag) {
    this.tagsList = this.tagsList.filter(item => item['tag'] !== tag.tag);
  }

  addTag() {
    let { tags } = this.createProfileForm.value;
    if (tags !== '') {
      this.tagsList.push({
        tag: tags
      });
    }
    this.searchInput.nativeElement.value = '';
  }

  changeBroadCast(valueSelect) {
    this.broadcast_showHide = true;
    this.select_showHide = false;
    this.createProfileForm.controls['topic_broadcast'].setValue('1');
  }

  changeSelect(valueSelect) {
    this.select_showHide = true;
    this.broadcast_showHide = false;
    // console.log(valueSelect);
    this.createProfileForm.controls['topic_broadcast'].setValue('0');

    this.selectedInvite = valueSelect;
  }

  validateEmail(assignments) {
    let arrUserEmail = [];
    if (assignments !== null) {
      assignments.forEach(element => {
        arrUserEmail.push({
          user_email: element.user_email ? element.user_email : element.display
        })
      });
      const regularExpression = /^[a-zA-Z0-9.!#$%&"*+/=?^_`{|}~-]+[^@]{3,}@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      // const regularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      arrUserEmail.forEach(ele => {
        if (regularExpression.test(ele.user_email)) {
          this.restrictSubmit = false;
          return true;
        } else {
          this.restrictSubmit = true;
          return false;
        }
      });
    }
  }

  saveChallenge(event: Event): any {
    let { topic_group_size, roles, tags } = this.createProfileForm.value;
    event.preventDefault();
    event.stopPropagation();

    topic_group_size = Number(topic_group_size);
    tags = this.tagsList;

    if (topic_group_size !== roles.length && topic_group_size !== 1) {
      this.toastrService.warning('Group size does not match number of roles');
      return false;
    }
    else {
      if (!this.createProfileForm.valid && roles.length > 0) {
        roles.forEach(role => {
          if (role.role_img == '' || role.role_name == '') {
            this.toastrService.warning('Please enter role image or role name');
          }
        });
        this.toastrService.warning('Please fill details');
      } else {
        if (this.createProfileForm.valid) {
          const challengeFormData = this.createProfileForm.value;
          const defaultPublishDate = new Date(challengeFormData.topic_start_date.year, challengeFormData.topic_start_date.month, challengeFormData.topic_start_date.day);
          challengeFormData.topic_start_date = this._uhs.getFormattedDateToBind(challengeFormData.topic_start_date);
          challengeFormData.topic_end_date = this._uhs.getFormattedDateToBind(challengeFormData.topic_end_date);
          challengeFormData.published_date = this._uhs.getFormattedDateToBind(challengeFormData.published_date ? challengeFormData.published_date : this._uhs.getFormattedDateForAdminChall(defaultPublishDate.setDate(defaultPublishDate.getDate() - 10)));
          challengeFormData.topic_status = challengeFormData.topic_status ? challengeFormData.topic_status : 'Open';

          if (topic_group_size === '1') {
            challengeFormData.roles = [];
          }

          if (challengeFormData['topic_broadcast'] === '0' || challengeFormData['topic_broadcast'] === 0) {
            if (challengeFormData['assignments'] && challengeFormData['assignments'].length) {
              const assignmentsList = [...challengeFormData['assignments']];
              const emaillist = assignmentsList.map(element => {
                if (element.hasOwnProperty('display')) {

                  const item = { 'user_email': element.display };
                  var newItem = Object.assign({}, item);
                  return newItem;
                  return { 'user_email': element.display };
                } else if (!element.hasOwnProperty('user_email')) {
                  return { 'user_email': element };
                }
                else {
                  return element;
                }
              });
              // this.createProfileForm.controls['assignments'].setValue(emaillist);
              challengeFormData['assignments'] = emaillist;
            } else {
              this.toastrService.warning('Please enter select buddies');
              return false;
            }
          }
          else {
            delete challengeFormData['assignments'];
          }
          console.log(challengeFormData);
          this.submitData(challengeFormData);

        } else {
          this.toastrService.warning(ERROR_MESSAGE.FIELDS_REQUIRED);
          return false;
        }
      }

    }


  }

  submitData(formData: Challenge): void {
    let { topic_group_size, topic_broadcast, is_spotlight, is_influencer_challenge, topic_dot_coins, participation_dot_coins, tags } = this.createProfileForm.value;
    this.formSubmitted = true;
    formData.topic_group_size = Number(topic_group_size);
    formData.topic_broadcast = Number(topic_broadcast);
    formData.topic_dot_coins = Number(topic_dot_coins);
    formData.participation_dot_coins = Number(participation_dot_coins);
    formData.is_spotlight = Number(is_spotlight);
    formData.is_influencer_challenge = Number(is_influencer_challenge);
    formData.tags = this.tagsList;
    if (this.challengeId) {
      formData['topic_id'] = +this.challengeId;
      if (this.broadcast == 1) {
        delete formData['assignments'];
        delete formData['topic_broadcast'];
      }
      // update challenge data
      this.service.updateChallenge(formData).subscribe(result => {
        this.formSubmitted = false
        if (result) {
          this.toastrService.success(SUCCESS_MESSAGE.RECORD_UPDATED);
          this.router.navigate(['/main-route/m/challenge']);
        }
      }, err => this.formSubmitted = false);
    } else {
      // save challenge data
      console.log(formData);
      this.service.saveChallengeData(formData).subscribe(result => {
        this.formSubmitted = false
        if (result) {
          this.toastrService.success(SUCCESS_MESSAGE.RECORD_ADDED);
          this.router.navigate(['/main-route/m/challenge']);
        }
      }, err => this.formSubmitted = false);
    }
  }


  submitChallenge(event: Event): any {
    event.preventDefault();
    event.stopPropagation();
    let topic_broadcast = 1;
    const { topic_description, topic_name, topic_earning_title,
      topic_earning_badge, topic_image, topic_video, topic_audio, topic_document,
      topic_dot_coins, assignments, is_spotlight, topic_group_size, topic_start_date, topic_end_date } = this.createProfileForm.value;
    console.log("Profile Form: " + this.createProfileForm.value);
    if (this.selectedInvite === 'selectBuddies') {
      this.validateEmail(assignments);
      if (assignments && assignments.length) {
        assignments.forEach(element => {
          if (element.hasOwnProperty('display')) {
            return element['user_email'] = element.display;
          } else {
            return assignments;
          }
        });
      }
      topic_broadcast = 0;
    }




    if (this.restrictSubmit) {
      this.toastrService.warning('Please enter Valid email');

    } else {
      if (this.createProfileForm.valid) {
        this.formSubmitted = true;

        this.finalPayload = {
          topic_earning_badge, topic_image, topic_video, topic_audio, topic_document,
          topic_description: topic_description,
          topic_dot_coins: topic_dot_coins,
          topic_earning_title: topic_earning_title,
          topic_name: topic_name,
          topic_id: Number(this.challengeId),
          assignments: assignments,
          is_spotlight: is_spotlight,
          topic_group_size: topic_group_size,
          topic_start_date: topic_start_date,
          topic_end_date: topic_end_date,
        }

        let dataPayload = {
          topic_earning_badge, topic_image, topic_video, topic_audio, topic_document,
          topic_description: topic_description,
          topic_dot_coins: topic_dot_coins,
          topic_earning_title: topic_earning_title,
          topic_name: topic_name,
          topic_id: Number(this.challengeId),
          topic_broadcast: topic_broadcast,
          is_spotlight: is_spotlight,
          topic_group_size: topic_group_size,
          topic_start_date: topic_start_date,
          topic_end_date: topic_end_date,
        }
        if (this.selectedInvite === 'Broadcast') {
          this.finalPayload = dataPayload;
        }
        if (this.challengeId) {
          // update challenge data
          this.service.updateChallenge(this.finalPayload).subscribe(result => {
            this.formSubmitted = false
            if (result) {
              this.toastrService.success(SUCCESS_MESSAGE.RECORD_UPDATED);
              this.router.navigate(['/main-route/m/challenge']);
            }
          }, err => this.formSubmitted = false);
        } else {
          // save challenge data
          this.service.saveChallengeData(this.finalPayload).subscribe(result => {
            this.formSubmitted = false
            if (result) {
              this.toastrService.success(SUCCESS_MESSAGE.RECORD_ADDED);
              this.router.navigate(['/main-route/m/challenge']);
            }
          }, err => this.formSubmitted = false);
        }
      } else {
        this.toastrService.warning(ERROR_MESSAGE.FIELDS_REQUIRED);
        // this.submitmarkAsTouched();
        return false;
      }
    }
  }

  openDocument(content: any, fileUrl: string, fileType: string) {
    // event.stopPropagation();
    /* this.filePath = fileUrl;
    window.open(
      fileUrl,
      '_blank'
    ); */
    let size = 'md';
    this.fileUrl = fileUrl;
    this.fileType = fileType;
    const fileExtension = fileUrl.split('.').pop();
    if (fileType === 'video') {
      this.mediaType = `video/${fileExtension}`;
    } else if (fileType === 'audio') {
      this.mediaType = `audio/${fileExtension}`;
    } else if (fileType === 'document') {
      size = 'xl';
      if (fileExtension === 'doc' || fileExtension === 'docx') {
        this.isUrlLoading = true;
        window.open(this.fileUrl, '_blank');
        return false;
      }
    }
    this.modalService.open(content, { size: size });
  }

  deleteFile(event: Event, type: string) {
    event.stopPropagation();
    if (type === 'challenge_document') {
      this.createProfileForm.controls.topic_document.setValue('');
      this.documentLink = '';
    } else if (type === 'challenge_audio') {
      this.createProfileForm.controls.topic_audio.setValue('');
      this.AudioLink = '';
    } else if (type === 'challenge_image') {
      this.createProfileForm.controls.topic_image.setValue('');
      this.ImageLink = '';
    } else if (type === 'challenge_video') {
      this.createProfileForm.controls.topic_video.setValue('');
      this.VideoLink = '';
    }

  }

  uploadDocument(type: string, title: string, fileCategory: any) {
    this.selectedType = title;
    const modalData = {
      headerName: title,
      fileType: type,
      fileCategory: fileCategory
    };

    const modalRef = this.modalService.open(FileUploadComponent, {
      centered: true,
      backdrop: 'static',
      size: 'lg',
      windowClass: 'file-modal'
    });
    modalRef.componentInstance.data = modalData;
    modalRef.result.then((res) => {
      if (res) {
        this.setFileName(res);
      }
      console.log(res);

    }, (reason) => {
      if (reason) {
        console.log(reason);
        if (reason) {
          this.setFileName(reason);
        }
      }
    });
  }

  setFileName(res: any): void {
    if (res && res.length) {
      this.filePath = environment.fileLocation + res[0].file;
      if (this.selectedType === 'Badge') {
        this.createProfileForm.controls.topic_earning_badge.setValue(res[0].file);
        this.challengeBadge = this.filePath
      } else if (this.selectedType === 'Document') {
        this.createProfileForm.controls.topic_document.setValue(res[0].file);
        this.documentLink = this.filePath
      } else if (this.selectedType === 'Image') {
        this.createProfileForm.controls.topic_image.setValue(res[0].file);
        this.ImageLink = this.filePath
      } else if (this.selectedType === 'Audio') {
        this.createProfileForm.controls.topic_audio.setValue(res[0].file);
        this.AudioLink = this.filePath
      } else if (this.selectedType === 'Video') {
        this.createProfileForm.controls.topic_video.setValue(res[0].file);
        this.VideoLink = this.filePath
      }
    }
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

  onChangeEvent() {
    this.createProfileForm.get('is_influencer_challenge').value ?
      this.createProfileForm.get('is_spotlight').setValue(1) :
      this.createProfileForm.get('is_spotlight').setValue(0)
  }
  onReady(editor: any): void {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }
}


export class Challenge {
  topic_earning_badge?: string
  topic_image?: string
  topic_video?: string
  topic_audio?: string
  topic_document?: string
  topic_description: string
  topic_dot_coins: number
  participation_dot_coins: number
  topic_earning_title: string
  topic_name: string
  topic_id?: number
  topic_broadcast: number
  assignments?: Assignments[]
  is_spotlight: number
  is_influencer_challenge: number
  influencer_name: string
  topic_group_size: number
  topic_start_date: string
  topic_end_date: string
  published_date: string
  topic_status: string
  tags: any[];
  topic_level: string;
}

export class Assignments {
  user_emai: string
}
export class CustomeDateValidators {
  static fromToDate(topic_start_date: string, topic_end_date: string, errorName: string = 'fromToDate'): ValidatorFn {
    return (formGroup: AbstractControl): { [key: string]: boolean } | null => {
      const fromDate = formGroup.get(topic_start_date).value;
      const toDate = formGroup.get(topic_end_date).value;
      alert(fromDate);
      alert(toDate);

      // Ausing the fromDate and toDate are numbers. In not convert them first after null check
      if ((fromDate !== null && toDate !== null) && fromDate > toDate) {
        return { [errorName]: true };
      }
      return null;
    };
  }


}
