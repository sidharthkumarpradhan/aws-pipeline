import { StudentHelperService } from 'src/app/modules/student-dashboard/student-helper.service';
import { ChangeDetectorRef, Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FileUploadComponent } from 'src/app/shared/component/file-upload/file-upload.component';
import { IDotSkillDetails } from 'src/app/shared/model/dot-skill-details.model';
import { IDotUserDetails } from 'src/app/shared/model/dot-user-details.model';
import { environment } from 'src/environments/environment';
import { DotUserSkillsService } from '../../dot-user-skills/dot-user-skills.service';
import { AuthState } from 'src/app/store/auth.model';
import { Store } from '@ngrx/store';
import { userInfo } from 'src/app/store/auth.selector';

export interface StudentSkill {
  user: number;
  skill: number;
  is_primary: number;
  skill_files: any;
}
@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['skills.component.scss']
})
export class SkillsComponent implements OnInit, OnDestroy {

  radioctrlName1 = 'Ctrl1';
  radioctrlName2 = 'Ctrl2';
  skilldetailsRetrieve: any;
  isCheckSkill = false;
  defaultTooltip = 'Upload Image or Video';
  @Input() applyCssSkills: boolean;
  @Input() skillsList: any[];
  @Input() userSkills;
  @Output() skillsUpdated = new EventEmitter<string>();
  isSaving = false;
  isCheck = true;
  formHeading = 'Create';
  dotskilldetails: IDotSkillDetails[] = [];
  dotuserdetails: IDotUserDetails[] = [];
  TalentsShow: boolean;
  // AttributeShow: boolean;
  isLoading: boolean;
  skillsBulk: StudentSkill[] = [];
  userId: any;
  uploadFile: any;
  fileType: string;
  fileUrl: string;
  mediaType: string;
  mySkills: any;
  baseImagePath = environment.fileLocation;
  isFormSubmitted: boolean;
  enableTextBox: Boolean = false;
  preferredOthers: Boolean = false;

  editForm = this.fb.group({
    user_skill_id: [],
    is_primary: [],
    skill_achievements: [null, [Validators.maxLength(2000)]],
    skill_files: [null, [Validators.maxLength(200)]],
    skill_id: [null, Validators.required],
    user_id: [null, Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    protected dotUserSkillsService: DotUserSkillsService,
    private studentHelperService: StudentHelperService,
    private cd: ChangeDetectorRef,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private store: Store<AuthState>
  ) { }

  ngOnInit() {
    this.store.select(userInfo).subscribe(res => {
      if (res) {
        this.userId = res.user_id ? res.user_id : res.userId;
      }
    });

    this.isCheck = true;
    this.isLoading = true;
    this.TalentsShow = true;
    this.getUserSkills();
  }

  getUserSkills() {
    const payload = { user_id: this.userId };
    this.studentHelperService.getStudentSkillSet(payload).subscribe((res) => {
      if (res && res.length) {
        this.mySkills = res; // this.extractSkills(res, 'skill');
        const skillIds = this.extractSkills(res, 'skill_id');
        this.setSkills(skillIds);
      }
    });
  }

  setSkills(skillIds) {
    this.skillsList.forEach((element, index) => {
      let isChecked = false;
      // const filterData = optionsRes.findIndex((item) => item.response === element.option) > -1;
      //  const othersData = skillIds.filter((item) => item.response !== element.option);
      if (skillIds && skillIds.length && skillIds.indexOf(element.skill_id) > -1) {
        isChecked = true;
        const skillFile = this.findMySkillFile(element.skill_id);
        this.skillsBulk.push(this.addNewSkill(element.skill_id, skillFile));
        this.skillsList[index].skill_file = skillFile;
      }
      element['selected'] = isChecked;
      // if (othersData.length > 0) {
      //   isChecked = true;
      //   this.enableTextBox = true;
      //   //   const skillFile = this.findMySkillFile(element);
      //   this.skillsBulk.push(this.addNewSkill('Others'));
      //   if (element.option === 'Others') {
      //     element['selected'] = isChecked;
      //   }
      //   this.editForm.patchValue({
      //     others: othersData[0].response
      //   })
      // }
      this.cd.detectChanges();
    });
  }

  speicfyOthers() {
    let { others } = this.editForm.value;
    // this.optionsBulk.forEach(ele => {
    //   if (ele.quiz_response == 'Others') {
    //     ele.quiz_response = others
    //   }
    // });
    // console.log('bulk', this.optionsBulk)
  }

  findMySkillFile(skillId) {
    const index = this.mySkills.findIndex(item => item.skill_id === skillId);
    return this.mySkills[index].skill_file;

  }

  toggleWithViewUpload(popover, data: any) {
    if (popover.isOpen()) {
      popover.close();
    } else {
      popover.open({ data });
    }
  }

  extractSkills(arr, prop) {
    const extractedValue = arr.map(item => item[prop]);
    return extractedValue;
  }

  addNewSkill(skillId: number, filename: string = '') {
    return {
      user: +this.userId,
      skill: +skillId,
      is_primary: 1,
      skill_files: filename
    };
  }

  checkSkill(skill, skillObj, event, skillFileName = '') {
    const skillCheck = event.srcElement.checked;
    // if (skill.skill_name === 'Others' && skillCheck) {
    //   this.enableTextBox = true;
    //   this.preferredOthers = true;
    // } else if (!skillCheck && skill.skill_name  === 'Others') {
    //   this.enableTextBox = false;
    //   this.preferredOthers = false;
    // }
    if (skillCheck) {
      this.skillsBulk.push(this.addNewSkill(skill.skill_id, skillFileName));
    } else if (this.skillsBulk.length) {
      this.skillsBulk = this.skillsBulk.filter(item => item.skill !== skill.skill_id);
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

  }

  onUpload(skill, index: number) {
    const modalData = {
      headerName: 'Image or Video',
      fileType: 'image&video',
      fileCategory: 'skill',
      validationInfo: 'Max filesize limit 20MB'
    };
    const skillInfo = skill;

    const modalRef = this.modalService.open(FileUploadComponent, {
      centered: true,
      backdrop: 'static',
      size: 'lg',
      windowClass: 'file-modal'
    });
    modalRef.componentInstance.data = modalData;
    modalRef.result.then((res) => {
      console.log(res);
    }, (reason) => {
      if (reason && reason.length) {
        const fileName = reason[0].file;
        this.updateSkillFile(skill, fileName, index);
      }
    });
  }

  updateSkillFile(skill, filename: string, index: number): void {
    const skillIndex = this.skillsBulk.findIndex(item => item.skill === skill.skill_id);
    this.skillsBulk[skillIndex].skill_files = filename;
    this.skillsList[index].skill_file = filename;
    this.cd.detectChanges();
  }

  save(): any {
    console.log(this.skillsBulk);
    if (!this.skillsBulk.length) {
      this.toastrService.warning('Please select Skills');
      return false;
    }
    this.isFormSubmitted = true;
    const payload = {
      user_id: Number(this.userId),
      skills: this.skillsBulk
    };
    this.studentHelperService.updateSkills(payload).subscribe(res => {
      if (res) {
        this.skillsUpdated.emit(res);
      }
      this.toastrService.success('Skills updated successfully');
      this.isFormSubmitted = false;
      this.cd.detectChanges();
    }, err => {
      this.isFormSubmitted = false;
      this.cd.detectChanges();
    });
  }

  onSkillChange(): void {
    this.TalentsShow = !this.TalentsShow;
  }

  ngOnDestroy() {
    this.cd.detach();
  }
}
