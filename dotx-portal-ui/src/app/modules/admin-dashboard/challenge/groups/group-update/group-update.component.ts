import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ERROR_MESSAGE } from 'src/app/shared/constant';
import { HelperService } from 'src/app/shared/services/helper.service';
import { AdminHelperService } from '../../../admin-helper.service';
import { forkJoin } from 'rxjs';
import { AuthState } from 'src/app/store/auth.model';
import { Store } from '@ngrx/store';
import { userInfo, userResponse } from 'src/app/store/auth.selector';

@Component({
  selector: 'app-group-update',
  templateUrl: './group-update.component.html'
})
export class GroupUpdateComponent implements OnInit {
  GroupData: any = [];
  buddiesList: any = [];
  challengesList: any = [];
  isViewMode: boolean = false;
  isLoading: boolean;
  isFormSubmitted: boolean;
  groupId: any;
  groupInfo: any;
  challenges: any;
  groupType: any;
  userId: any;
  // rolesForGroup: any;
  assignments: any;
  // topicId: number;
  isLoader2: boolean;

  /**
   * Tag input 
   */
  validators = [this.must_be_email];
  errorMessages = {
    'must_be_email': 'Please be sure to use a valid email format'
  };
  must_be_email(control: FormControl) {
    var EMAIL_REGEXP = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/i;
    if (control.value.length != "" && !EMAIL_REGEXP.test(control.value)) {
      return { "must_be_email": true };
    }
    return null;
  }

  creategroupForm = this.fb.group({
    group_name: [null, [Validators.required]],
    topic_id: [null, [Validators.required]],
    assignments: [null, [Validators.required]],
    roles: this.fb.array([this.fb.group({
      role_name: ['']
    })])
  });

  dropdownSettings = {
    singleSelection: true,
    idField: 'topic_id',
    textField: 'topic_name',
    allowSearchFilter: true,
    closeDropDownOnSelection: true
  };

  constructor(
    public _uhs: HelperService,
    private fb: FormBuilder,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private service: AdminHelperService,
    private toastrService: ToastrService,
    private cd: ChangeDetectorRef,
    private store: Store<AuthState>
  ) { }

  ngOnInit() {
    this.store.select(userResponse).subscribe(res => {
      if (res) {
        this.userId = res.id;
      }
    });
    const challengeType = this.activateRoute.snapshot.params['type'];
    this.groupId = this.activateRoute.snapshot.params['id'];
    this.isViewMode = challengeType === 'view';
    if (this.isViewMode) {
      this.getGroupDetails();
    }

    if (challengeType === 'edit') {
      this.groupType = 'Edit';
    } else if (challengeType === 'view') {
      this.groupType = 'View';
      this.creategroupForm.controls.topic_id.disable();
    } else {
      this.groupType = 'Create';
    }

    this.loadData(challengeType);

  }
  onItemSelect(item: any) {
    console.log(item.topic_id);
  }

  addRoleField(): void {
    const temp = this.fb.group({
      role_name: ['']
    });
    const fa = <FormArray>this.creategroupForm.get('roles');
    fa.push(temp);
  }

  deleteRole(i: number): void {
    const fa = <FormArray>this.creategroupForm.get('roles');
    fa.removeAt(i);
    this.creategroupForm.markAsDirty();
  }

  loadData(type) {
    const reqArray = [];
    this.isLoader2 = true;
    if (type === 'create') { // create Group
      // this.addRoleField();

      forkJoin([
        this.service.getBuddiesList(),
        this.service.getChallengesList()
      ]).subscribe(results => {
        this.isLoader2 = false;
        if (results && results.length) {
          this.buddiesList = this.displayBuddiesList(results[0]);
          this.challenges = results[1];
        }
      }, err => this.isLoader2 = false);
    }
    else {
      const groupId = this.groupId;
      reqArray.push(this.service.getRoles({ groupId }));
      reqArray.push(this.service.assignmentsGroup({ groupId }));
      if (type === 'view') { // View Group
        forkJoin(reqArray).subscribe(result => {
          this.isLoader2 = false;
          const emails = this.getUserEmails(result[1]);
          this.populateAssignments(emails);
          this.populateRoles(result[0]);
        }, err => this.isLoader2 = false);

      } else { // edit group
        reqArray.push(this.service.getBuddiesList());
        reqArray.push(this.service.getChallengesList());
        reqArray.push(this.service.getGroupData(this.groupId));
        forkJoin(reqArray).subscribe(result => {
          this.isLoader2 = false;
          const emails = this.getUserEmails(result[1]);
          this.buddiesList = this.displayBuddiesList(result[2]);
          this.challenges = result[3];
          // this.populateAssignments(emails);
          this.populateRoles(result[0]);
          if (result[4]) {
            this.GroupData = result[4];
            this.GroupData['emails'] = emails;

            this.updateForm();
          } else {
            this.router.navigate(['/main-route/m/challenge']);
          }
        }, err => this.isLoader2 = false);
      }
    }
  }

  displayBuddiesList(result) {
    if (result && result.length) {
      result = result.filter(item => item.user_id !== this.userId);
      return result.map(({ user_email, user_gmail }) => user_email ? user_email : user_gmail);
    } else {
      return null;
    }
  }

  populateAssignments(emailsList: any): void {
    this.creategroupForm.patchValue({
      assignments: emailsList
    });
  }

  populateRoles(roles) {
    const fa = <FormArray>this.creategroupForm.get('roles');
    fa.removeAt(0);
    if (roles && roles.length) {
      roles.forEach((element) => {
        const { role_name } = element;
        const temp = this.fb.group({
          role_name: [role_name],
        });
        fa.push(temp);
      });
    }
  }

  getGroupDetails() {
    this.isLoading = true;
    this.service.getGroupData(this.groupId).subscribe(res => {
      this.isLoading = false;
      if (res) {
        this.GroupData = res;
        this.updateForm();
      } else {
        this.router.navigate(['/main-route/m/challenge']);
      }
    }, err => {
      this.isLoading = false;
      this.router.navigate(['/main-route/m/challenge']);
    });
  }

  updateForm(): void {
    const userData = this.GroupData;
    if (this.isViewMode) {
      this.creategroupForm.patchValue({
        group_name: userData.group_name,
        topic_id: userData.topic.topic_name,
        assignments: userData.emails
      });
    } else {
      const itemText = this.challenges.filter(item => item.topic_id == userData.topic_id);
      const selectedItems = [{ topic_id: userData.topic_id, topic_name: itemText[0].topic_name }];
      this.creategroupForm.patchValue({
        group_name: userData.group_name,
        topic_id: selectedItems,
        assignments: userData.emails
      });
    }
  }

  getUserEmails(emailsArray: any): void {
    if (emailsArray && emailsArray.length) {
      return emailsArray.map(({ user }) => {
        return user.user_email ? user.user_email : user.user_gmail;
        // return Object.assign({}, {user_email: email});
      })
    }
  }

  /* getBuddiesList() {
    this.isLoading = true;
    this.service.getBuddiesList().subscribe(res => {
      this.isLoading = false;
      if (res) {
        this.buddiesList = res.map ( ({user_email, user_gmail}) =>  user_email ? user_email : user_gmail)
      }
    }, err => this.isLoading = false);
  } */

  get roleFields() {
    return this.creategroupForm.get('roles') as FormArray;
  }

  submitmarkAsTouched() {
    Object.values(this.creategroupForm.controls).forEach((control: any) => {
      control.markAsTouched();
    });
  }

  saveGroup() {
    if (this.creategroupForm.valid) {
      this.isFormSubmitted = true;
      const groupFormData = this.creategroupForm.value;
      if (groupFormData['assignments'] && groupFormData['assignments'].length) {
        const assignmentsList = [...groupFormData['assignments']];
        if (assignmentsList && assignmentsList.length) {
          groupFormData['assignments'] = assignmentsList.map(element => {
            if (element.hasOwnProperty('display')) {
              return { 'user_email': element.display };
            } else if (!element.hasOwnProperty('user_email')) {
              return { 'user_email': element };
            }
            else {
              return element;
            }
          });
        }
      }
      console.log(groupFormData['topic_id']);
      if (Array.isArray(groupFormData['topic_id'])) {
        groupFormData['topic_id'] = +groupFormData['topic_id'][0]['topic_id'];
      } else {
        groupFormData['topic_id'] = +groupFormData['topic_id'];
      }


      if (this.groupId) {
        // update Group data
        groupFormData['group_id'] = +this.groupId;
        this.service.updateGroup(groupFormData).subscribe(result => {
          this.isFormSubmitted = false;
          if (result) {
            this.toastrService.success(ERROR_MESSAGE.RECORD_UPDATED);
            this.router.navigate(['/main-route/m/challenge']);
          }
        }, err => this.isFormSubmitted = false);
      } else {
        // save Group data
        groupFormData['group_description'] = null;
        this.service.saveGroup(groupFormData).subscribe(result => {
          this.isFormSubmitted = false;
          if (result) {
            this.toastrService.success(ERROR_MESSAGE.RECORD_ADDED);
            this.router.navigate(['/main-route/m/challenge']);
          }
        }, err => this.isFormSubmitted = false);
      }
    } else {
      this.toastrService.warning(ERROR_MESSAGE.FIELDS_REQUIRED);
      this.submitmarkAsTouched();
      return false;
    }
  }
}
