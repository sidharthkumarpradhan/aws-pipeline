import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { PrivacyPolicyComponent } from './../privacy-policy/privacy-policy.component';

@Component({
  selector: 'app-footer',
  template: `<footer>
  <img src="assets/img/footer-logo.png" alt="" />
  <p>The Dot Express © 2021 Privacy Policy</p>
</footer>`
})
export class FooterComponent implements OnInit {
  currentYear = new Date().getFullYear();
  constructor(
    private modalService: NgbModal,
  ) { }
  ngOnInit() { }

  showModal() {
    const ngbModalOptions: NgbModalOptions = {
      backdrop : 'static',
      keyboard : false,
      size: 'lg',
    };
    this.modalService.open(PrivacyPolicyComponent, ngbModalOptions);
  }


}
