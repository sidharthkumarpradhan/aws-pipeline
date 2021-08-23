import {Component, Input, OnInit} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {StudentHelperService} from '../../../modules/student-dashboard/student-helper.service';
import {HelperService} from '../../services/helper.service';

@Component({
  selector: 'app-my-challenges-popup',
  templateUrl: './my-challenges-popup.component.html',
  styleUrls: ['./my-challenges-popup.component.scss']
})
export class MyChallengesPopupComponent implements OnInit {

  @Input() data;
  baseImagePath = environment.fileLocation;
  badges: any;
  dotcoins: any;
  myChallenges: any[];
  isLoading = false;

  constructor(private activeModal: NgbActiveModal, private studentHelperService: StudentHelperService, private _uhs: HelperService) {
  }

  ngOnInit() {
    this.badges = this.data.badges;
    this.dotcoins = this.data.dotcoins;
    this.getParticipatedChallenges();
  }

  getParticipatedChallenges(): void {
    this.isLoading = true;
    this.myChallenges = [];
    const payload = {};
    this.studentHelperService.getChallengeMine(payload).subscribe(res => {
      this.isLoading = false;
      if (res) {
        this.myChallenges = res;
        if (this.myChallenges.length) {
          this.myChallenges = this._uhs.getOnlyImageFromChallenges(this.myChallenges);
        }
      }
    }, err => this.isLoading = false);
  }

  closeModal() {
    this.activeModal.close();
  }
}
