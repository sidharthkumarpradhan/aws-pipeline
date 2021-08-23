import {Component, OnInit} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {StudentHelperService} from '../student-helper.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-search-spotlight-challenges',
  templateUrl: './search-spotlight-challenges.component.html',
  styleUrls: ['./search-spotlight-challenges.component.scss']
})
export class SearchSpotlightChallengesComponent implements OnInit {

  baseImagePath = environment.fileLocation;
  searchResult: any[];
  searchKeyword: string;
  searchType: string = 'topic_name';
  searchData: any = {};
  keyword: string;

  constructor(private studentHelperService: StudentHelperService, private router: Router) {
    const data = this.router.getCurrentNavigation().extras.state.searchData;
    if (data) {
      this.searchData = data;
    }
  }

  ngOnInit() {
    if (this.searchData) {
      this.searchType = this.searchData.search_type;
      this.searchKeyword = this.searchData.keyword;
      this.doSearch();
    }
  }

  doSearch() {
    const data = {
      search_type: this.searchType,
      keyword: this.searchKeyword
    };
    this.callSearchService(data);
  }

  callSearchService(payload) {
    this.keyword = payload.keyword;
    this.studentHelperService.searchChallenges(payload).subscribe(res => {
        this.searchResult = res;
      }
    );
  }

  clearFilters() {
    this.searchKeyword = '';
    // this.searchResult = [];
  }

  gotoChallenge(challenge: any) {
  }
}
