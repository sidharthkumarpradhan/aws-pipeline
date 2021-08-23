import { DatePipe } from '@angular/common';
import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { FileUploadComponent } from 'src/app/shared/component/file-upload/file-upload.component';
import { CommonApiService } from 'src/app/shared/services/common-api.service';
import { AuthState } from 'src/app/store/auth.model';
import { userInfo } from 'src/app/store/auth.selector';
import { environment } from 'src/environments/environment';
import { StudentHelperService } from '../../student-helper.service';

@Component({
  selector: 'app-challenge-workarea',
  templateUrl: './challenge-workarea.component.html',
  styleUrls: ['./challenge-workarea.component.scss']
})
export class ChallengeWorkareaComponent implements OnInit, OnDestroy {
  @Output() readonly passEntry: EventEmitter<any> = new EventEmitter();
  challenge: any;
  comments: any[] = [];
  actualCommentsRes: any[] =[];
  isLoading = false;
  file: any;
  fileType: string;
  mediaType: string;
  VideoLink: any;
  AudioLink: any;
  ImageLink: any;
  documentLink: any;
  filePathName: any;
  daysLeftForSubmission: any;
  subscriptions: Subscription[] = [];
  groupList: any[] = [];
  groupOwner: any;
  commentImageFiles = [];
  commentVideoFiles = [];
  commentFiles = [];
  baseImagePath = environment.fileLocation;

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
  finalComment = [];
  userInfo: any;
  constructor(private studentHelperService: StudentHelperService, private modalService: NgbModal,
    private commonService: CommonApiService, private store: Store<AuthState>,
    private toastrService: ToastrService, private activeModal: NgbActiveModal) {
  }

  ngOnInit() {
    this.subscriptions.push(this.store.select(userInfo).subscribe(userInfo => {
        if (userInfo) {
          this.userInfo = userInfo;
        }
    }));
    this.getChallengeComments();
    if (this.challenge.group_id) {
      this.getGroupMembers();
    }
    this.daysLeftForSubmission = this.commonService.getDateDifference(
      new Date(), this.challenge.topic_end_date, 'days'
    );
  }
   
  getChallengeComments(): void {
    this.isLoading = true;
    if (this.challenge.topic_group_size === 1) {
      this.studentHelperService
      .getSoloChallengeResponses(this.challenge.topic_id).subscribe(res => {
        this.isLoading = false;
        this.comments = res;
        this.finalComment = this.comments.filter(item => item.is_final_submit == '1');
        this.comments = this.comments.filter(item => item.is_final_submit == '0');
      }, () => this.isLoading = false);
    } else {
      this.studentHelperService
      .getCommentRetrieveGroup(this.challenge.group_id).subscribe(res => {
        this.isLoading = false;
        this.comments = res;
        this.finalComment = this.comments.filter(item => item.is_final_submit == '1');
        this.comments = this.comments.filter(item => item.is_final_submit == '0');
      }, () => this.isLoading = false);
    }
  }

  openModal(content: any, link: any, type: any): void {
    this.file = link;
    if (type === 'video') {
      this.fileType = `video`;
      this.mediaType = 'video/mp4';
    } else {
      this.fileType = 'image';
    }
    this.modalService.open(content, { size: 'md' });
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

  commnetdeleteFiles(event: Event, file, type) {
    event.stopPropagation();
    if (type === 'video') {
      this.commentVideoFiles = this.commentVideoFiles.filter(item => item.file !== file.file);
    } else if (type === 'image') {
      this.commentImageFiles = this.commentImageFiles.filter(item => item.file !== file.file);
    } else if (type === 'doc') {
      this.commentFiles = this.commentFiles.filter(item => item.file !== file.file);
    }
    /// console.log('this.filename', this.filename, this.FileUploaded);
  }

  getGroupMembers() {
    this.isLoading = true;
    this.studentHelperService.groupMembers({ 'group_id': this.challenge.group_id }).subscribe(res => {
      this.isLoading = false;
      if (res) {
        this.groupList = res;
        this.groupOwner = this.groupList.find(item => item.is_group_owner)
        // this.actualGroupMemberList = res;
        // this.groupMembersList = this.groupMembersList.filter(item => item.role_name !== null);
        // this.challGroupName = this.groupMembersList[0].group_name;
        // let groupOwner = this.groupMembersList.filter(item => item.is_group_owner == true);
        // this.groupOwner = groupOwner[0].is_group_owner;
        // this.groupOwnerRole = groupOwner[0].role_name;
        // this.groupOwnerRoleImg = groupOwner[0].role_avatar;

        // const groupOwnerObject = res.find(each => each.is_group_owner);
        // if (groupOwnerObject) {
        //   this.groupOwnerId = groupOwnerObject.user_id;
        // }
        // let challAccepted = res.find(each => each.group_id == null || each.role_assigned_to == null);
        // if (challAccepted !== null && challAccepted !== undefined) {
        //   this.allowSubmit = false;
        // }
      }
    }, err => this.isLoading = false);
  }

  viewGroup(): void {
    //TODO: Create Group Popup Needs to open
  }

  saveComment(comment: string) {
    let TodayDate = moment().format('YYYY-MM-DD hh:mm:ss');
    const attachment = [...this.commentVideoFiles, ...this.commentImageFiles, ...this.commentFiles];

    if (comment !== null && comment !== undefined) {
      comment = comment.trim();
    }

    if (!comment && attachment.length === 0) {
      this.toastrService.warning('Please write something or upload a file.');
      return false;
    } else {
      this.isLoading = true;
      let payload = {
        "response_description": comment,
        "date_of_response": TodayDate,
        "topic_assign": this.challenge.topic_id,
        "attachments": attachment
      };
      this.studentHelperService.addComments(payload).subscribe(res => {
        this.isLoading = false;
        if (res) {
          this.toastrService.success('Success');
          this.getChallengeComments();
          this.commentVideoFiles = this.commentImageFiles = this.commentFiles = [];
        }
      }, err => this.isLoading = false);

    }
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

  closeModal() {
    this.passEntry.next(false);
    this.activeModal.close();
  }

  backToChallenge(): void {
    this.passEntry.next(this.challenge);
    this.activeModal.close();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
