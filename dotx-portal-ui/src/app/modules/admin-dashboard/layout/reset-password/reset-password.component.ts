import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {AdminHelperService} from '../../admin-helper.service';

@Component({
  selector: 'app-admin-reset-password',
  templateUrl: './reset-password.component.html'
})
export class AdminResetPasswordComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal, private adminHelperService: AdminHelperService) {}

  ngOnInit(): void {
    this.adminHelperService.isAdminResetPassword.subscribe( res => {
      if (res) {
        this.activeModal.close();
      }
    });
  }

  closeModal() {
    this.activeModal.close();
  }
}
