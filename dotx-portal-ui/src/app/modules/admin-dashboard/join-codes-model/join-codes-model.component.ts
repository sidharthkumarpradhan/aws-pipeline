import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AdminHelperService } from '../admin-helper.service';

@Component({
  selector: 'app-join-codes-model',
  templateUrl: './join-codes-model.component.html',
  styleUrls: ['./join-codes-model.component.scss']
})
export class JoinCodesModelComponent implements OnInit {
  size = [5, 10, 15, 20, 25];
  constructor(private activeModal: NgbActiveModal,
              private adminHelperService: AdminHelperService,
              private toastrService: ToastrService) { }

  ngOnInit() {
  }

  closeModal(): void {
     this.activeModal.close();
  }

  generateJoinCodes(count: any): void {
    const data = { count: Number(count) };
    this.toastrService.success('Joincodes will be shared to your registered email');
    this.adminHelperService.generateJoinCodes(data).subscribe(() => {
    });
    this.activeModal.close();
  }

}
