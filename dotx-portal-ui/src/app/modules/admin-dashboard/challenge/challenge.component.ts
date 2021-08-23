import {GroupsComponent} from './groups/groups.component';
import {NavigationExtras, Router} from '@angular/router';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {NgbActiveModal, NgbModal, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';
import {DeleteComponent} from 'src/app/shared/component/delete/delete.component';
import {AdminHelperService} from '../admin-helper.service';
import {RECORDS_PER_PAGE, SUCCESS_MESSAGE} from 'src/app/shared/constant';
import {userResponse} from 'src/app/store/auth.selector';
import {Store} from '@ngrx/store';
import {AuthState} from '../../../store/auth.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-challenge',
  templateUrl: './challenge.component.html'
})
export class ChallengeComponent implements OnInit {
  @ViewChild(GroupsComponent, {static: false})
  private groupsComponent: GroupsComponent;

  ChallengesByMe: any = [];
  ChallengesByOthers: any = [];
  searchChallenge: string = '';
  dateFormatKeys = ['created_date'];
  pageSearch: number = 1;
  page2Search: number = 1;
  resultsPerPage = RECORDS_PER_PAGE;
  allChallenges: any;
  userName: any;


  isLoading: boolean;
  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    size: 'xl'
  };

  constructor(
    private router: Router,
    private service: AdminHelperService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    public activeModal: NgbActiveModal,
    private cdr: ChangeDetectorRef,
    private store: Store<AuthState>
  ) {
  }

  ngOnInit() {
    this.store.select(userResponse).subscribe(res => {
      if (res) {
        this.userName = res.username;
      }
    });
    this.loadChallenges();
  }

  ngAfterContentChecked() {
    this.cdr.detectChanges();
  }


  resetValues() {
    this.ChallengesByMe = [];
    this.ChallengesByOthers = [];
    this.pageSearch = 1;
    this.page2Search = 1;
  }

  loadChallenges() {
    this.resetValues();
    this.isLoading = true;
    this.service.getChallengesList().subscribe(res => {
      this.isLoading = false;
      if (res) {
        this.filterChallenges(res);
      }
    }, err => this.isLoading = false);
  }

  filterChallenges(data: any): void {
    this.searchChallenge = '';
    this.allChallenges = data;
    if (data && data.length) {
    this.ChallengesByMe = data.filter(item => item.created_by === this.userName);
    this.ChallengesByOthers = data.filter(item => item.created_by !== this.userName);
    }
  }

  onEdit(user: any): any  {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        'broadcast': user.topic_broadcast,
      }
    };
    if (!user['topic_id']) {
      this.toastrService.warning('Invalid Info');
      return false;
    }
    this.router.navigate(['/main-route/m/challenge/edit/' + user.topic_id],navigationExtras);
  }

  onView(user: any): any {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        'broadcast': user.topic_broadcast,
      }
    };
    if (!user['topic_id']) {
      this.toastrService.warning('Invalid Info');
      return false;
    }
    this.router.navigate(['main-route/m/challenge/view/' + user.topic_id],navigationExtras);

  }

  onDelete(topicId: any) {
    const deleteModelRef = this.modalService.open(DeleteComponent, { centered: true, backdrop: 'static', size: 'sm' });
    deleteModelRef.result.then((res) => {
      if (res) {
        this.deleteRecord(topicId);
      }
    }, (reason) => {
      if (reason) {
        this.deleteRecord(topicId);
      }
    });
  }

  deleteRecord(topicId: number): any {
    if (!topicId) {
      this.toastrService.warning('User details not available');
    }
    this.isLoading = true;
    this.service.deleteChallenge(topicId).subscribe(res => {
      this.isLoading = false;
      if (res) {
        this.toastrService.success(`Challenge ${SUCCESS_MESSAGE.RECORD_DELETED}`);
        this.loadChallenges();
        this.groupsComponent.loadGroups();
        // console.log(this.allChallenges);
        // const filterData = this.allChallenges.filter(item => item.topic_id !== topicId);
        // this.filterChallenges(filterData);
      }
    }, err => this.isLoading = false);
  }
}
