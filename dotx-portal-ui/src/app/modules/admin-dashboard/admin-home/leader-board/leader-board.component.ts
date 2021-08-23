import { Component, OnInit } from '@angular/core';
import { AdminHelperService } from '../../admin-helper.service';
import { environment } from './../../../../../environments/environment';

@Component({
  selector: 'app-leader-board',
  templateUrl: './leader-board.component.html'
})
export class LeaderBoardComponent implements OnInit {
  leaderBoards: any[] = [];
  leaderPage = 1;
  searchLeaderBoards = '';
  isLoading: boolean;
  fileLocation = environment.fileLocation;

  constructor(
    private service: AdminHelperService,
  ) { }

  ngOnInit() {
    // this.loadRecords();
  }

  loadRecords() {
    this.isLoading = true;
    this.service.getLeaderBoardsList().subscribe((res) => {
      this.isLoading = false;
      if (res) {
        this.leaderBoards = res;
      }
    }, err => this.isLoading = false);
  }

  onImgError(event: any): void {
    event.target.src = 'assets/img/pic-1.png';
   }

}
