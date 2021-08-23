import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudentHelperService } from '../student-helper.service';
import * as _ from 'lodash';

declare var $: any;
@Component({
  selector: 'app-quest-map-detail',
  templateUrl: './quest-map-detail.component.html',
  styleUrls: ['./quest-map-detail.component.scss']
})
export class QuestMapDetailComponent implements OnInit {
  questId: string;
  isQuestLoading: boolean;
  sortedData: any[];
  topic_name = '';
  topic_description = '';

  constructor(
    private activateRoute: ActivatedRoute,
    private studentHelperService: StudentHelperService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.questId = atob(this.activateRoute.snapshot.params.id);
    this.getQuestDetails(this.questId);
  }

  openQuest(type) {
    if (!this.sortedData || !this.sortedData.length) {
      return false;
    }
    if (type < 3) {
      $('.position-' + type).addClass('d-none');
      $('.position-' + (type + 1)).removeClass('d-none');
    }
    const mName = this.sortedData[type].topic_type;
    this.challengeType(mName, type);
  }

  challengeType(typeName: string, position): void {
    if (typeName === 'Challenge') {
      /* this.topic_name = this.sortedData[position]['topic_name'];
      this.topic_description = this.sortedData[position]['topic_description']; */
      // const modalRef = this.modalService.open(content, { size: 'xl' });
      // modalRef.componentInstance.challengeData = {this.topic_name,};

      $('#challengeModal').modal('show');
    } else if (typeName === 'Quiz') {
      $('#quizModal').modal('show');
    } else if (typeName === 'Lesson') {
      $('#challengeModal').modal('show');
    } else if (typeName === 'Video') {
      $('#influencerVideoModal').modal('show');
    }
  }

  getQuestDetails(quest): void {
    this.studentHelperService.questDetails(quest).subscribe(res => {
      if (res) {
        this.isQuestLoading = false;
        console.log('quest details');
        if (res && res.length) {
          this.sortedData = _.sortBy(res, 'topic_seq');
        }
      }
    }, err => this.isQuestLoading = false);
  }

  startQuest() {
    $('#introductionModal').modal('show');
  }

}
