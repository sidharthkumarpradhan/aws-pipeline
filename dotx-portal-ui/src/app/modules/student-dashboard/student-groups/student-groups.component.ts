import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DeleteComponent } from 'src/app/shared/component/delete/delete.component';
import { RECORDS_PER_PAGE, SUCCESS_MESSAGE } from 'src/app/shared/constant';
import { AdminHelperService } from '../../admin-dashboard/admin-helper.service';

@Component({
  selector: 'app-student-groups',
  templateUrl: './student-groups.component.html',
  styleUrls: ['./student-groups.component.css']
})
export class StudentGroupsComponent implements OnInit {

  groupsList: any = [];
  isGroupsLoading: boolean;
  searchGroup: string = '';
  dateFormatKeys = ['lastmodified_date'];
  groupPage: number = 1;
  resultsPerPage: number = RECORDS_PER_PAGE;
  challengeId: any;
  navigationExtras: any;
  isViewMode: any;
  fromPage: any;

  constructor(
    private router: Router,
    private service: AdminHelperService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    public activeModal: NgbActiveModal,
    private cdr: ChangeDetectorRef,
    private activateRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    const challengeType = this.activateRoute.snapshot.params['type'];
    this.challengeId = this.activateRoute.snapshot.params['id'];
    this.loadGroups();

    this.activateRoute.queryParams.subscribe(params => {
      console.log('params', params);
      this.isViewMode = params.fromPage;
      this.fromPage = params.fromPage;
      this.cdr.detectChanges();
    });
    let navigationExtras: NavigationExtras = {
      queryParams: {
        'challengeId': this.challengeId,
        'fromPage': this.isViewMode,
        'viewMode': this.fromPage
      }
    };
    this.navigationExtras = navigationExtras;

  }

  ngAfterContentChecked() {
    this.cdr.detectChanges();
  }

  loadGroups() {
    this.isGroupsLoading = true;
    this.service.getGroupsListbyChallenge({ 'topic_id': this.challengeId }).subscribe(res => {
      this.isGroupsLoading = false;
      if (res) {
        this.groupsList = res;
      }
    }, err => this.isGroupsLoading = false);

  }

  createGroup() {
    if (!this.challengeId) {
      this.toastrService.warning('Invalid Info');
      return false;
    }

    this.router.navigate(['/main-route/student/edit-groups/create'], this.navigationExtras);
  }

  onEdit(id: any) {
    if (!id) {
      this.toastrService.warning('Invalid Info');
      return false;
    }

    this.router.navigate(['/main-route/student/edit-groups/edit/' + id], this.navigationExtras);
  }

  onDiscuss(group: any): any {
    if (!group['topic_id']) {
      this.toastrService.warning('Invalid Info');
      return false;
    }
    this.router.navigate(['/main-route/student/edit-groups/view/' + group.group_id], this.navigationExtras);

  }

  onDelte(groupId: any) {
    const deleteModelRef = this.modalService.open(DeleteComponent, { centered: true, backdrop: 'static', size: 'sm' });
    deleteModelRef.result.then((res) => {
      if (res) {
        this.deleteRecord(groupId);
      }
    }, (reason) => {
      if (reason) {
        this.deleteRecord(groupId);
      }
    });
  }

  deleteRecord(groupID: number): any {
    if (!groupID) {
      this.toastrService.warning('Group details not available');
    }
    this.service.deleteGroup(groupID).subscribe(res => {
      this.isGroupsLoading = false;
      if (res) {
        this.toastrService.success(`Group ${SUCCESS_MESSAGE.RECORD_DELETED}`);
        this.loadGroups();
      }
    }, err => this.isGroupsLoading = false);
  }

}
