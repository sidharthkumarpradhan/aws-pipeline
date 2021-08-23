import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import {StudentHelperService} from '../../student-helper.service';

@Component({
  selector: 'app-group-challenge-model',
  templateUrl: './group-challenge-model.component.html',
  styleUrls: ['./group-challenge-model.component.scss']
})
export class GroupChallengeModelComponent implements OnInit {

  challenge: any;

  constructor(private activeModal: NgbActiveModal, private studentHelperService: StudentHelperService) {
  }

  ngOnInit() {
    this.getChallengeDetails(this.challenge.topic_id);
  }

  closeModal() {
    this.activeModal.close();
  }

  getChallengeDetails(topicId): void {
    this.studentHelperService.topicDetailsById(topicId).subscribe(res => {
      if (res) {
        this.challenge = res;
        this.challenge.topic_end_date = moment(this.challenge.topic_end_date).format('ll');
      }
    });
  }
}
