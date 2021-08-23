import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {AdminHelperService} from '../../admin-helper.service';
import {ToastrService} from 'ngx-toastr';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AdminResetPasswordComponent} from '../reset-password/reset-password.component';
import { Subscription } from 'rxjs';
import { AuthState } from 'src/app/store/auth.model';
import { Store } from '@ngrx/store';
import { userResponse } from 'src/app/store/auth.selector';
import { AuthLogout } from 'src/app/store/auth.action';
import { JoinCodesModelComponent } from '../../join-codes-model/join-codes-model.component';

@Component({
  selector: 'admin-header',
  templateUrl: './admin-header.component.html'
})
export class AdminHeaderComponent implements OnInit, OnDestroy {
  displayName = 'Admin';
  subscriptions: Subscription[] = [];
  isLoading = false;

  constructor(public router: Router, private adminHelperService: AdminHelperService,
              private toastrService: ToastrService, private modalService: NgbModal,
              private store: Store<AuthState>) { }


  ngOnInit() {
    this.subscriptions.push(
      this.store.select(userResponse).subscribe(userResp => {
        if (userResp && userResp.display_name) {
          this.displayName = userResp.display_name;
        }
      })
    );
  }

  logout(): void {
    sessionStorage.clear();
    this.store.dispatch(new AuthLogout());
    this.router.navigate(['/home']);
  }

  generateJoinCodes() {
  this.modalService.open(JoinCodesModelComponent, {
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
      windowClass: 'modal-holder custom-modal edit-student-dashboard',
      centered: true
    });
  }

  ngOnDestroy(): void {
    if (this.subscriptions.length) {
      this.subscriptions.forEach(sub => sub.unsubscribe());
    }
  }

  gotoResetPassword() {
    this.openResetPassword();
  }

  openResetPassword(): void {
    const modalRef = this.modalService.open(AdminResetPasswordComponent, {
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
      windowClass: 'modal-holder custom-modal edit-student-dashboard',
      centered: true
    });
    modalRef.result.then((res) => {
      if (res) {
        modalRef.close('close');
      }
    }, (reason) => {
      if (reason) {
      }
    });
  }
}
