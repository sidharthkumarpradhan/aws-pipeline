import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DeleteComponent } from 'src/app/shared/component/delete/delete.component';
import { AdminHelperService } from '../../admin-helper.service';
import { RECORDS_PER_PAGE, SUCCESS_MESSAGE } from 'src/app/shared/constant';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html'
})
export class GroupsComponent implements OnInit {
  groupsList: any = [];
  isGroupsLoading: boolean;
  searchGroup: string = '';
  dateFormatKeys = ['lastmodified_date'];
  groupPage: number = 1;
  resultsPerPage: number = RECORDS_PER_PAGE;

  constructor(
    private router: Router,
    private service: AdminHelperService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    public activeModal: NgbActiveModal,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadGroups();
  }

  ngAfterContentChecked() {
    this.cdr.detectChanges();
  }

  loadGroups() {
   // this.isGroupsLoading = true;
    this.service.getGroupsList().subscribe(res => {
      this.isGroupsLoading = false;
      if (res) {
        this.groupsList = res;
      }
    }, err => this.isGroupsLoading = false);

  }

  onEdit(id: any) {
    if (!id) {
      this.toastrService.warning('Invalid Info');
      return false;
    }
    this.router.navigate(['/main-route/m/group/edit/' + id]);
  }

  onView(group: any): any {
    if (!group['topic_id']) {
      this.toastrService.warning('Invalid Info');
      return false;
    }
    this.router.navigate(['/main-route/m/group/view/' + group.group_id]);

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
