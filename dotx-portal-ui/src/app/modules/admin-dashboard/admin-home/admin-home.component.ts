import { ChangeDetectorRef, Input, OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DeleteComponent } from 'src/app/shared/component/delete/delete.component';
import { HelperService } from 'src/app/shared/services/helper.service';
import { AdminHelperService } from '../admin-helper.service';
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from 'src/app/shared/constant';
import { CustomValidator } from 'src/app/shared/validators/customValidator';
import { Subscription } from 'rxjs';
import { AuthState } from 'src/app/store/auth.model';
import { Store } from '@ngrx/store';
import { userInfo, userResponse } from 'src/app/store/auth.selector';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html'
})
export class AdminHomeComponent implements OnInit, OnDestroy {
  usersList?: IUser[] = [];
  isLoading: boolean;
  searchParam = '';
  dateFormatKeys = [];
  page = 1;
  ngbModalOptions: NgbModalOptions = {
    backdrop : 'static',
    keyboard : false,
    windowClass: 'admin-s-modal'
  };
  userName = '';
  subscriptions: Subscription[] = [];
  constructor(
    private service: AdminHelperService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    public activeModal: NgbActiveModal,
    private cdr: ChangeDetectorRef,
    private store: Store<AuthState>
  ) { }



  ngOnInit() {
    this.subscriptions.push(
      this.store.select(userResponse).subscribe(res => {
        if (res) {
          this.userName = res.username;
        }
      })
    );
    this.loadRecords();
  }

  ngOnDestroy(): void {
    if (this.subscriptions.length) {
      this.subscriptions.forEach(sub => sub.unsubscribe());
    }
 }

  loadRecords() {
    this.isLoading = true;
    this.service.getAdminUsers().subscribe((res: IUser[]) => {
      this.isLoading = false;
      if (res) {
        this.usersList = res;
        this.page = 1;
      }
    }, err => this.isLoading = false);
  }

  onImgError(event) {
    event.target.src = 'assets/img/pic-1.png';
   }

  createUser(): void {
    const modalData = {
      headerName: 'Create User',
      userInfo: ''
    };

    const modalRef = this.modalService.open(NgbdModal1Content, this.ngbModalOptions);
    modalRef.componentInstance.data = modalData;
    modalRef.result.then((res) => {
      if (res) {this.reloadRecords();}
    }, (reason) => {
      if (reason) {
        this.reloadRecords();
      }
    });
  }

  onView(user: any) {
    const data = {
      headerName: 'User Details',
      userInfo: user
    };
    const modalRef = this.modalService.open(NgbdModal1Content, this.ngbModalOptions);
    modalRef.componentInstance.data = data;
  }

  onEdit(user: any) {
    const data = {
      headerName: 'Edit User',
      userInfo: user
    };
    const modalRef = this.modalService.open(NgbdModal1Content, this.ngbModalOptions);
    modalRef.componentInstance.data = data;
    modalRef.result.then((res) => {
      if (res) {this.reloadRecords();}
    }, (reason) => {
      if (reason) {
        this.reloadRecords();
      }
    });
  }

  reloadRecords() {
    this.searchParam = '';
    this.loadRecords();
  }

  onDelte(userID: any) {
    const deleteModelRef = this.modalService.open(DeleteComponent, { centered: true, backdrop: 'static', size: 'sm' });
    deleteModelRef.result.then((res) => {
      if (res) {this.deleteRecord(userID); }
    }, (reason) => {
      if (reason) {this.deleteRecord(userID); }
    });
  }

  deleteRecord(userID: number): any {
    if (!userID) {
      this.toastrService.warning('User details not available');
    }
    const userData = this.usersList;
    this.usersList = userData.filter(item => item.user_id !== userID);
    this.isLoading = true;
    this.service.delete(userID).subscribe(res => {
      if (res) {
        this.page = 1;
        this.toastrService.success(`User ${SUCCESS_MESSAGE.RECORD_DELETED}`);
        this.searchParam = '';
        this.isLoading = false;
      } else {
        this.isLoading = false;
        this.usersList = userData;
      }
    }, err => {
      this.isLoading = false;
      this.usersList = userData;
    });
  }
}
@Component({
  template: `
    <div class="modal-header">
      <h5 class="modal-title">{{ headerName }} </h5>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss(false)">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <form [formGroup]="createProfileForm" (ngSubmit)="submitCreateProfile()">
    <div class="modal-body">
    <div class="form-group">
      <label>Full Name<span class="text-danger" *ngIf="!isViewMode">*</span></label>
      <input type="text" class="form-control" maxlength="50" formControlName="displayName" [readonly]="isViewMode"
       placeholder="Enter Full Name" [ngClass]="{'error-field': _uhs.isValidField(createProfileForm?.controls.displayName)}">
       <app-control-messages [control]="createProfileForm?.controls.displayName" labelName="Full name">
      </app-control-messages>
    </div>
    <div class="form-group">
      <label>Email Id<span class="text-danger" maxlength="100" *ngIf="!isViewMode">*</span></label>
      <input type="email" class="form-control"  formControlName="userEmail"  [readonly]="isViewMode || userInfo"
       placeholder="Enter Email id"  [ngClass]="{'error-field': _uhs.isValidField(createProfileForm?.controls.userEmail)}">
       <app-control-messages [control]="createProfileForm?.controls.userEmail" labelName="Email">
      </app-control-messages>
      </div>
    <div class="form-group">
      <label>Contact Number<span class="text-danger" *ngIf="!isViewMode">*</span></label>
      <input type="tel" class="form-control" formControlName="userPhoneNum" maxlength="10" minlength="10" [readonly]="isViewMode"
       placeholder="+ 91 " [ngClass]="{'error-field': _uhs.isValidField(createProfileForm?.controls.userPhoneNum)}">
       <app-control-messages [control]="createProfileForm?.controls.userPhoneNum" labelName="Contact number">
      </app-control-messages>
   </div>
   <input type="hidden" formControlName="userType" value="admin" />
   </div>
   <div class="modal-footer">
   <img src="assets/img/inline_spinner.svg" *ngIf="isLoading" />
   <button type="button" class="btn btn-outline-secondary" (click)="activeModal.close(false)" [disabled]="isLoading">Close</button>
   <button type="submit" class="btn btn-dark" *ngIf="!isViewMode" [disabled]="isLoading"> {{userInfo ? 'Update' : 'Save'}}</button>
   </div>
   </form>
  `
})
export class NgbdModal1Content implements OnInit {
  @Input() data;
  isLoading: boolean;
  headerName: string;
  userInfo: any;
  isViewMode: boolean;
  userId: any;
  createProfileForm = this.fb.group({
    displayName: [null, [Validators.required]],
    userPhoneNum: [null, [Validators.required, CustomValidator.AllowNumericOnly]],
    userEmail: ['', [Validators.required, CustomValidator.ValidateEmail]],
    userType: ['admin']
  });

  constructor(public activeModal: NgbActiveModal,
              public _uhs: HelperService,
              private fb: FormBuilder,
              private service: AdminHelperService,
              private toastrService: ToastrService,
              private store: Store<AuthState>) {
    }

    ngOnInit() {
      this.store.select(userResponse).subscribe(res => {
        if (res) {
          this.userId = res.id;
        }
      });
      this.headerName = this.data.headerName;
      this.userInfo = this.data.userInfo;
      this.isViewMode = (this.headerName === 'User Details') ? true : false;
      if (this.userInfo) {
        this.updateForm(this.userInfo, this.userId);
      }
    }

    updateForm(userInfo: any , userId): void {
      this.createProfileForm.patchValue({
        displayName: userInfo.display_name,
        userEmail: userInfo.user_email,
        userPhoneNum: userInfo.user_phone_num
      });
    }

  submitCreateProfile(): any {
    const {displayName, userEmail, userPhoneNum} = this.createProfileForm.value;
    const payload = {
      displayName: displayName,
      userEmail: userEmail,
      userPhoneNum: userPhoneNum,
      user_id: this.userInfo.user_id
    };
    if (!this.userInfo && !this.userInfo.user_id) {
      payload['userType'] = 'admin';
    }
    if (this.createProfileForm.valid) {
      this.isLoading = true;
      if (this.userInfo) {
        // update records
        this.service.updateUserRecords(payload).subscribe(result => {
          if (result) {
            this.showSuccessMessage('UPDATE', result);
          }
        }, err => this.isLoading = false);

      } else {
        //save records
        this.service.saveRecord(payload).subscribe(result => {
          if (result) {
            this.showSuccessMessage('SAVE', result);
          }
        }, err => this.isLoading = false);
      }
    } else {
      this.toastrService.warning(ERROR_MESSAGE.FIELDS_REQUIRED);
      return false;
    }
  }

  showSuccessMessage(type: string, result): void {
    if (type === 'UPDATE') {
      this.toastrService.success(ERROR_MESSAGE.RECORD_UPDATED);
    } else {
      this.toastrService.success(ERROR_MESSAGE.USER_CREATED);
    }
    this.activeModal.dismiss(result);
  }



}
export class IUser {
  displayName: string;
  user_phone_num: string;
  user_email: string;
  user_id?: number;
}
