import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChangeDetectorRef, Component, Input, OnInit, ViewRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { DATE_FORMAT } from 'src/app/shared/constants/input.constants';

import { IDotUserSkills, DotUserSkills } from 'src/app/shared/model/dot-user-skills.model';
import { DotUserSkillsService } from './dot-user-skills.service';
import { IDotSkillDetails } from 'src/app/shared/model/dot-skill-details.model';
import { IDotUserDetails } from 'src/app/shared/model/dot-user-details.model';
import { DotUserDetailsService } from '../dot-user-details/dot-user-details.service';
import { FileUploadComponent } from 'src/app/shared/component/file-upload/file-upload.component';
import { StudentHelperService } from '../student-dashboard/student-helper.service';
import { environment } from 'src/environments/environment';
import { AuthState } from 'src/app/store/auth.model';
import { Store } from '@ngrx/store';
import { userInfo, userResponse } from 'src/app/store/auth.selector';

type SelectableEntity = IDotSkillDetails | IDotUserDetails;
// import { HooksUtilityService } from 'src/app/shared/hooks-utility.service';
export interface userSkill {
  user: number;
  skill: number;
  is_primary: number;
  skill_files: [];
  //  selected: Boolean;
}

@Component({
  selector: 'jhi-dot-user-skills-update',
  templateUrl: './dot-user-skills-update.component.html',
  styleUrls: ['./dot-user-skills.component.css'],
})

export class DotUserSkillsUpdateComponent implements OnInit {
  radioctrlName1: string = 'Ctrl1';
  radioctrlName2: string = 'Ctrl2';
  skilldetailsRetrieve: any;
  isCheckSkill: Boolean = false;
  defaultTooltip = 'Upload Image or Video';

  @Input() applyCssSkills: Boolean;
  @Input() skillsDashboard;
  isSaving = false;
  isCheck: Boolean = true;
  formHeading = 'Create';
  dotskilldetails: IDotSkillDetails[] = [];
  dotuserdetails: IDotUserDetails[] = [];
  TalentsShow: boolean;
  AttributeShow: boolean;
  isLoading: Boolean;
  skillsBulk: userSkill[] = [];
  copyBulk: any = [];
  skillsInfoDashboard: any;
  userId: any;
  getUserID: any;
  attachementFile: any;
  fileArrayRes = [];
  st_details: any;
  enableTextBox: Boolean = false;
  preferredOthers: Boolean = false;

  editForm = this.fb.group({
    userSkillId: [],
    isPrimary: [],
    skillAchievements: [null, [Validators.maxLength(2000)]],
    skillFile: [null, [Validators.maxLength(200)]],
    createdBy: [null, [Validators.maxLength(50)]],
    createdDate: [],
    lastmodifiedBy: [null, [Validators.maxLength(50)]],
    lastmodifiedDate: [],
    skillIdId: [null, Validators.required],
    userIdId: [null, Validators.required],
  });
  uploadFile: any;
  fileUrl: string;
  mediaType: string;
  mySkills: any;
  fileType: string;
  baseImagePath = environment.fileLocation;
  currentPage = 'Talents';


  constructor(
    private toastrService: ToastrService,
    // private hooksUtilityService: HooksUtilityService,
    protected dotUserSkillsService: DotUserSkillsService,
    protected dotUserDetailsService: DotUserDetailsService,
    private studentHelperService: StudentHelperService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private router: Router,
    private cd: ChangeDetectorRef,
    private store: Store<AuthState>
  ) {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params && params.page) {
        this.currentPage = params.page;
      }
    });
  }

  ngOnInit(): void {
    this.currentPage = 'Talents'; // Using Same Component For Talents and Favorites
    this.isCheck = true;
    this.isLoading = true;
    this.TalentsShow = true;
    this.skillsInfoDashboard = this.skillsDashboard;
    this.store.select(userResponse).subscribe(res => {
      if (res) {
        this.userId = res.id;
      }
    });
    this.store.select(userInfo).subscribe(res => {
      if (res) {
        this.st_details = res;
      }
    });
    this.loadData();

  }
  loadData(): void {
    this.isLoading = true;
    this.dotUserSkillsService.query(this.currentPage).subscribe((res: HttpResponse<IDotSkillDetails[]>) => {
      (this.dotskilldetails = res.body || []);
      setTimeout(()=>{                           
        this.isLoading = false;
   }, 4000);
      
    }, () =>  this.isLoading = false);
  }

  updateForm(dotUserSkills: IDotUserSkills): void {
    this.formHeading = 'Edit';
    this.editForm.patchValue({
      userSkillId: dotUserSkills.userSkillId,
      isPrimary: dotUserSkills.isPrimary,
      skillAchievements: dotUserSkills.skillAchievements,
      skillFile: dotUserSkills.skillFile,
      createdBy: dotUserSkills.createdBy,
      createdDate: dotUserSkills.createdDate ? dotUserSkills.createdDate : null,
      lastmodifiedBy: dotUserSkills.lastmodifiedBy,
      lastmodifiedDate: dotUserSkills.lastmodifiedDate ? dotUserSkills.lastmodifiedDate : null,
      skillIdId: dotUserSkills.skillIdId,
      userIdId: dotUserSkills.userIdId,
    });
    this.isLoading = false;
  }

  nextState(): void {
    if (this.currentPage === 'Talents') {
      this.currentPage = 'Favourites';
      this.loadData();
    } else {
      this.router.navigate(['main-route/skill/detail/aboutme']);
    }
  }
  toggleWithViewUpload(popover, data: any) {
    if (popover.isOpen()) {
      popover.close();
    } else {
      popover.open({ data });
    }
  }

  openDocument(content: any, fileUrl: any) {
    fileUrl.forEach(url => {
      this.fileUrl = this.baseImagePath + url.file;
      // this.fileType = fileType;
      const fileExtension = url.file.split('.').pop();
      if (fileExtension.match(/(jpg|jpeg|png|gif)$/i)) {
        this.fileType = 'image';
      }
      if (fileExtension === 'mp4') {
        this.mediaType = `video/mp4`;
        this.fileType = 'video';
      }
      window.open(
        this.fileUrl, '_blank'
      );
      // this.modalService.open(content, { size: 'md' });
    });

    // this.modalService.open(content, { size: 'md' });
  }

  checkSkill(skill: any, skillIndex: any, event: any, skillFileName: any) {
    const skillCheck = event.srcElement.checked;
    const filterData = this.skillsBulk.findIndex((item, i) => item.skill === skill.skillId) > -1;
    if (skillCheck && !filterData) {
      this.skillsBulk.push({
        user: this.userId,
        skill: Number(skill.skillId),
        is_primary: 1,
        skill_files: skillFileName ? skillFileName : []
      });
    } else if (skillFileName !== undefined && filterData) {
      this.skillsBulk.forEach(item => {
        if (item.skill === skill.skillId) {
          item.skill_files = skillFileName ? skillFileName : [];
        }
      });
    } else if (skillFileName !== undefined && !filterData) {
      this.skillsBulk.push({
        user: this.userId,
        skill: Number(skill.skillId),
        is_primary: 1,
        skill_files: skillFileName ? skillFileName : []
      });
      const element = <HTMLInputElement>document.getElementById(skill.skillId);
      const isChecked = element.checked = true;
    } else {
      this.skillsBulk = this.skillsBulk.filter(item => item.skill !== skill.skillId);
      this.cd.detectChanges();
    }
    this.cd.detectChanges();
    this.dotskilldetails[skillIndex]['skill_files'] = skillFileName ? skillFileName : [];
    this.getUserID = this.userId;
  }

  speicfyOthers() {
  }


  onUpload(skill, evt, skillIndex) {
    /* this.uploadFile = evt.target.files[0];
    const { type } = this.uploadFile;
    var logoFormData = new FormData();
    logoFormData.append('file',this.uploadFile);
    this.isLoading = true;
    this.dotUserSkillsService.uploadLogo(logoFormData).subscribe((resp) => {
      console.log('resp00000', resp);
    }) */
    const modalData = {
      headerName: 'Image or Video',
      fileType: 'image&video',
      fileCategory: 'skill',
      validationInfo: 'Max filesize limit 20MB'
    };

    const modalRef = this.modalService.open(FileUploadComponent, {
      centered: true,
      backdrop: 'static',
      size: 'lg',
      windowClass: 'file-modal'
    });
    modalRef.componentInstance.data = modalData;
    modalRef.result.then((res) => {
      console.log('res----------', res);
    }, (reason) => {
      if (reason && reason.length) {
        const fileName = reason[0].file;
        console.log('filename resp', fileName);
        this.attachementFile = fileName.filename;
        this.checkSkill(skill, skillIndex, evt, fileName.filename);
        // this.createProfileForm.controls.avatarImageFile.setValue(reason.filename);
        // this.userProfilePic = 'http://192.168.32.173:5080/v1/dot-user-details/images/avatar/'+reason.filename;
      }
    });
  }

  save(): any {
    if (this.skillsBulk.length === 0) {
      this.toastrService.warning('Please select Skills');
      this.isSaving = false;
      this.isLoading = false;
      return false;
    }
    this.isLoading = true;
    if (this.getUserID) {
      const payload = {
        user_id: Number(this.getUserID),
        skills: this.skillsBulk
      };
      this.subscribeToSaveResponse(this.dotUserSkillsService.update(payload));
    } else {
      this.subscribeToSaveResponse(this.dotUserSkillsService.create(this.skillsBulk));
    }
  }

  private createFromForm(): IDotUserSkills {
    return {
      ...new DotUserSkills(),
      userSkillId: this.editForm.get(['userSkillId'])!.value,
      isPrimary: this.editForm.get(['isPrimary'])!.value,
      skillAchievements: this.editForm.get(['skillAchievements'])!.value,
      skillFile: this.editForm.get(['skillFile'])!.value,
      createdBy: this.editForm.get(['createdBy'])!.value,
      createdDate: this.editForm.get(['createdDate'])!.value ? moment(this.editForm.get(['createdDate'])!.value, DATE_FORMAT) : undefined,
      lastmodifiedBy: this.editForm.get(['lastmodifiedBy'])!.value,
      lastmodifiedDate: this.editForm.get(['lastmodifiedDate'])!.value
        ? moment(this.editForm.get(['lastmodifiedDate'])!.value, DATE_FORMAT)
        : undefined,
      skillIdId: this.editForm.get(['skillIdId'])!.value,
      userIdId: this.editForm.get(['userIdId'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDotUserSkills>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    const msg = 'Updated';
    this.toastrService.success(`Skills ${msg} Successfully`);
    this.isLoading = false;
    this.cd.detectChanges();
    if (this.skillsInfoDashboard === 'Skills') {
      return false;
    } else {
      this.nextState();
    }
  }

  protected onSaveError(): void {
    this.isSaving = false;
    this.isLoading = false;
    this.toastrService.warning(`Skills updated Failed`);
  }

  onSkillChange(): void {
    this.TalentsShow = !this.TalentsShow;
  }

  trackById(index: number, item: SelectableEntity): any {
    return item.id;
  }

  skipTo(): void {
    if (this.currentPage === 'Talents') {
      this.currentPage = 'Favourites';
      this.loadData();
    } else {
      this.router.navigate(['main-route/skill/detail/aboutme']);
    }
  }

  backToQuiz() {
    if (this.currentPage === 'Talents') {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          path: 'createProfile',
          typeOf: 'personality',
          from: 'talents'
        }
      };
      this.router.navigate(['main-route/quiz/detail'], navigationExtras);
    } else {
       this.currentPage = 'Talents';
       this.loadData();
    }

  }
}
