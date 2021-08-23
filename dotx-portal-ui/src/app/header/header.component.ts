import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommunicationService } from '../default/communication.services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input()
  onboard: any;
  hideCoverImage: boolean;

  constructor(
    private route: Router,
    private communicationService: CommunicationService
  ) {
    this.communicationService.hideCoverImage.subscribe(value => {
      this.hideCoverImage = value;
    });
  }

  redirectHome() {
    this.enableLogin();
    this.route.navigate(['home']);
  }

  enableLogin() {
    this.communicationService.emitChange('home');
  }

  openLogin() {
    this.route.navigate(['auth/login']);
  }

  openJoinCode() {
    this.route.navigate(['auth/join-code']);
  }

}
