import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import {StudentHelperService} from '../../student-helper.service';

@Component({
  selector: 'app-solo-challenge-model',
  templateUrl: './solo-challenge-model.component.html',
  styleUrls: ['./solo-challenge-model.component.scss']
})
export class SoloChallengeModelComponent implements OnInit {
  
  @Output() readonly passEntry: EventEmitter<any> = new EventEmitter();
  challenge: any;
  isLoading = false;
  constructor(private activeModal: NgbActiveModal, private studentHelperService: StudentHelperService) {
  }

  ngOnInit() {
    this.getChallengeDetails(this.challenge.topic_id);
  }

  continueChallenge(): void {
    this.passEntry.next(this.challenge);
    this.activeModal.close();
  }

  acceptChallenge(): void {
    const payload = {
      topic_id: this.challenge.topic_id
    };
    this.studentHelperService.JoinSoloChallenge(payload).subscribe(res => {
      this.challenge.topic_assign_id = res.topic_assign_id;
      this.passEntry.next(this.challenge);
      this.activeModal.close();
    });
  }

  viewOtherResponse(): void {

  }

  getChallengeDetails(topicId): void {
    this.isLoading = true;
    this.studentHelperService.topicDetailsById(topicId).subscribe(res => {
      this.isLoading = false;
      if (res) {
        this.challenge = res;
        this.challenge.topic_end_date = moment(this.challenge.topic_end_date).format('ll');
      }
    }, () => this.isLoading = false);
  }

  closeModal() {
    this.passEntry.next(null);
    this.activeModal.close();
  }
}
