import { PlatformLocation } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { StudentHelperService } from '../student-helper.service';

@Component({
  selector: 'app-work-location',
  templateUrl: './work-location.component.html',
  styleUrls: ['./work-location.component.scss']
})
export class WorkLocationComponent implements OnInit {
  // login_location: string = '';
  isFormLoading: boolean;
  isLoading: Boolean;

  constructor(
    private toastrService: ToastrService,
    private studentHelperService: StudentHelperService,
    private location: PlatformLocation,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
    this.location.onPopState(() => this.closeModal());
  }

  submitLocation(resValue) {
    this.isLoading = true;
    if (!resValue) {
      this.toastrService.warning('Choose any one from home or school');
      return false;
    }
    this.isFormLoading = true;
    const historyId = sessionStorage.getItem('loginHistoryId');
    const payload = { login_hist_id: historyId, login_location: resValue }
    this.studentHelperService.submitWorkLocation(payload).subscribe((resp) => {
      sessionStorage.setItem('work_location_entered', "1");
      this.isLoading = true;
      this.closeModal()
      // location.reload();
    }, err => {
      this.closeModal();
      this.isLoading = true;
      // location.reload();
    });
  }

  closeModal(): void {
    this.isFormLoading = false;
    this.activeModal.close();
  }

}
