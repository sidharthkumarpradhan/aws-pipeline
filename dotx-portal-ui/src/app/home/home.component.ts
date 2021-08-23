import {Component, OnDestroy} from '@angular/core';
import {CommunicationService} from '../default/communication.services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnDestroy {

  constructor(private communicationService: CommunicationService) {
    this.communicationService.hideCoverImage.next(false);
  }

  ngOnDestroy(): void {
    this.communicationService.hideCoverImage.next(true);
  }

}
