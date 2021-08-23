import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FileUploadComponent } from 'src/app/shared/component/file-upload/file-upload.component';
import { environment } from 'src/environments/environment';
import { StudentHelperService } from '../student-helper.service';

@Component({
  selector: 'app-talents-favourites',
  templateUrl: './talents-favourites.component.html',
  styleUrls: ['./talents-favourites.component.scss']
})
export class TalentsFavouritesComponent implements OnInit {
  @Input() page: any;
  @Input() userData: any;
  talents: any = [];
  isLoading = true;
  options: any[] = [];

  
  constructor(private studentHelperService: StudentHelperService,
              private toastrService: ToastrService,
              private modalService: NgbModal) { }

  ngOnInit() {
    this.getTalents();
  }
  getTalents(): void {
    this.isLoading = true;
    this.studentHelperService.getUserSkills(this.page).subscribe(res => {
      this.isLoading = false
      if (res && res.length) {
         this.talents = res;
         this.talents.forEach(element => {
           element['selected'] = element.is_selected ? true : false;
           if (element.attachments && element.attachments.length) {
            element['skill_files'] = element.attachments;
            element.skill_files.forEach(element => {
              const filename = environment.fileLocation + element.file;
              let fileExtension = element.file.split('.').pop();
              if (fileExtension.match(/(jpg|jpeg|png|gif)$/i)) {
                fileExtension = 'image';
              }
              element['filePath'] = filename;
              element['fileType'] = fileExtension;
            });
           } else {
            element['skill_files'] = [];
           }
           

         });
      }
    }, () => this.isLoading = false);
  }

  save(): void {
   const requestPayload = {
    user_id: this.userData.user_id,
    skill_category: this.page,
    skills: this.buildRequestPayload()
   }
   this.isLoading = true;
   this.studentHelperService.updateSkills(requestPayload).subscribe(() => {
      this.isLoading = false;
      this.getTalents();
      this.toastrService.success(this.page + ' Updated Successfully!')
   },() => {
     this.isLoading = false;
     this.toastrService.error('Unable to Update ' +this.page)
   });
   
  }
  buildRequestPayload(): any {
    const skills = [];
    this.talents.forEach(talent => {
      if (talent.selected) {
        const requestObj = {
          user: this.userData.user_id,
          skill: talent.skill_id,
          is_primary: 1,
          skill_files: talent.skill_files
        };
        skills.push(requestObj);
      }
    });
    return skills;
  }

  openUploadModel(skillId: number): void {
    const modalData = {
      headerName: 'Skill',
      fileType: 'image&video',
      fileCategory: 'skill'
    };
    const modalRef = this.modalService.open(FileUploadComponent, {
      centered: true,
      backdrop: 'static',
      size: 'lg'
    });
    modalRef.componentInstance.data = modalData;
    modalRef.result.then((reason) => {
      if (reason) {
      }
    }, (reason) => {
      if (reason) {
        if (reason && reason.length) {
          reason.forEach(res => {
            const fileObj = {};
            let fileExtension = res.file.split('.').pop();
            if (fileExtension.match(/(jpg|jpeg|png|gif)$/i)) {
              fileExtension = 'image';
            }
            fileObj['filePath'] = environment.fileLocation + res.file;
            fileObj['fileType'] = fileExtension;
            fileObj['file']= res.file;
            fileObj['display_name']= res.name;
            this.talents.find(talent => talent.skill_id === skillId).skill_files.push(fileObj);
          });
        }
      }
    });
  }


}
