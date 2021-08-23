import {Component, OnInit} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-send-message-popup',
  templateUrl: './send-message-popup.component.html',
  styleUrls: ['./send-message-popup.component.scss']
})
export class SendMessagePopupComponent implements OnInit {

  data;
  userData: any;
  filePathLocation = environment.fileLocation;
  emailAddress: any;

  constructor(private activeModal: NgbActiveModal) {
  }

  ngOnInit() {
    this.userData = this.data;
  }

  sendMessage(value, check1, check2) {
    console.log(value + ' ' + check1 + ' ' + check2);
  }

  close() {
    this.activeModal.close();
  }
}
