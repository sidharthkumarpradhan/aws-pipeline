import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html'
})
export class PrivacyPolicyComponent implements OnInit {

  constructor(
    private modal: NgbActiveModal
  ) { }

  ngOnInit() {
  }
  close(): void {
    this.modal.close();
  }

}
