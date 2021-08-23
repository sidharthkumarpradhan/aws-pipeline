import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DeleteComponent } from 'src/app/shared/component/delete/delete.component';
import { FileUploadComponent } from 'src/app/shared/component/file-upload/file-upload.component';
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from 'src/app/shared/constant';
import { HelperService } from 'src/app/shared/services/helper.service';
import { environment } from 'src/environments/environment';
import { AdminHelperService } from '../../admin-helper.service';
declare var $: any;

@Component({
  selector: 'app-dot-coins',
  templateUrl: './dot-coins.component.html'
})
export class DotCoinsComponent implements OnInit, AfterViewInit {
  dotCoinsPage: number = 1;
  searchdotCoins: string = '';
  isCoinsLoading: boolean;
  formLoading: boolean = false;
  dotCoins: any[] = [];
  listOfTopics: any[] = [];
  rewardsForm: FormGroup;
  listOfActions = ['Create', 'Share', 'Complete'];
  errorMessage: boolean;
  isEdit: boolean;
  rewardsSetupId: any;
  dotCoinsBadge: string = 'assets/img/badge-1-icon.png';
  defaultImage = 'assets/img/badge-1-icon.png';
  fileLocation = environment.fileLocation;

  constructor(
    private fb: FormBuilder,
    public _uhs: HelperService,
    private service: AdminHelperService,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef,
    private toastrService: ToastrService
  ) { }

  ngOnInit() {
    this.initateRewardsForm();
    this.loadRecords();
  }

  ngAfterViewInit() {
    this.getListOfTopics();
    this.cdr.detectChanges();
  }

  loadRecords() {
    this.isCoinsLoading = true;
    this.service.getRewardSetup().subscribe((res: IDotRewards[]) => {
      this.isCoinsLoading = false;
      if (res) {
        this.dotCoins = res;
        this.dotCoinsPage = 1;
      }
    }, err => this.isCoinsLoading = false);
  }

  initateRewardsForm() {
    this.rewardsForm = this.fb.group({
      reward_title: ['', [Validators.required]],
      reward_action: ['', [Validators.required]],
      reward_points: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      reward_badge: ['', [Validators.required]],
      topic: ['', [Validators.required]]
    });
  }

  onImgError(event){
    event.target.src = this.defaultImage;
   }

  uploadBadge() {
    const modalData = {
      headerName: 'Badge',
      fileType: 'image',
      fileCategory: 'dot_coin_badge'
    };

    const modalRef = this.modalService.open(FileUploadComponent, {
      centered: true,
      backdrop: 'static',
      size: 'lg',
      windowClass: 'file-modal'
    });
    modalRef.componentInstance.data = modalData;
    modalRef.result.then((res) => {
      if (res && res.length) {
        this.setFileName(res[0].file);
      }
    }, (reason) => {
      if (reason && reason.length) {
          this.setFileName(reason[0].file);
      }
    });
  }

  setFileName(filename: string): void {
    let filePath;
    if (filename !== this.defaultImage) {
      filePath = environment.fileLocation + filename;
      this.rewardsForm.controls.reward_badge.setValue(filename);
    }
    this.dotCoinsBadge = (filename === this.defaultImage) ?  filename : filePath;
  }

  getListOfTopics() {
    this.formLoading = true;
    this.service.getTopicsList().subscribe((res) => {
      this.formLoading = false;
      if (res) {
        this.listOfTopics = res;
      }
    }, err => this.formLoading = false);
  }

  createDotCoin(): void {
    this.rewardsSetupId = '';
    this.dotCoinsBadge = this.defaultImage;
    $('#addDotcoinModal').modal('show');
  }

  onEdit(data: any) {
    this.rewardsSetupId = data.reward_setup_id;
    this.dotCoinsBadge = this.defaultImage;
    this.updateForm(data);
    $('#addDotcoinModal').modal('show');
  }

  updateForm(data) {
    console.log(data);
    this.rewardsForm.patchValue({
      reward_title: data.reward_title,
      reward_action: data.reward_action,
      reward_points: data.reward_points,
      reward_badge: data.reward_badge,
      topic: data.topic_id
    });
    if (data && data.reward_badge) {
      this.setFileName(data.reward_badge);
    }
  }

  onDelete(itemId: any) {
    const deleteModelRef = this.modalService.open(DeleteComponent, { centered: true, backdrop: 'static', size: 'sm' });
    deleteModelRef.result.then((res) => {
      if (res) {this.deleteRecord(itemId); }
    }, (reason) => {
      if (reason) {this.deleteRecord(itemId); }
    });
  }

  deleteRecord(recordId: number): any {
    if (!recordId) {
      this.toastrService.warning('Dot coin detail not available');
    }
    const coinsData = this.dotCoins;
    this.dotCoins = coinsData.filter(item => item.reward_setup_id !== recordId);
    this.isCoinsLoading = true;
    this.service.deleteRewardSetup(recordId).subscribe(res => {
      if (res) {
        this.dotCoinsPage = 1;
        this.toastrService.success(`Dot coin ${SUCCESS_MESSAGE.RECORD_DELETED}`);
        this.searchdotCoins = '';
        this.isCoinsLoading = false;
      } else {
        this.isCoinsLoading = false;
        this.dotCoins = coinsData;
      }
    }, err => {
      this.isCoinsLoading = false;
      this.dotCoins = coinsData;
    });
  }

  saveDotCoin(event: Event): any {
    event.preventDefault();
    // event.stopPropagation();
    this.rewardsForm.markAsTouched();
    if (this.rewardsForm.valid) {
      this.formLoading = true;
      const payload = this.rewardsForm.value;
      console.log(payload);
      if (this.rewardsSetupId) {
        payload['reward_setup_id'] = this.rewardsSetupId;
        // update records
        this.service.updateRewardSetup(payload).subscribe(result => {
          if (result) {
            this.updateRecord(result);
            this.showSuccessMessage('UPDATE', result);
          }
        }, err => this.formLoading = false);

      } else {
        //save records
        this.service.saveRewardSetup(payload).subscribe(result => {
          if (result) {
            this.dotCoins.unshift(result);
            this.showSuccessMessage('SAVE', result);
          }
        }, err => this.formLoading = false);
      }
    } else {
      // this.errorMessage = true;
      this.toastrService.warning('Please enter all required fields');
     /*  setTimeout(() => {
        this.errorMessage = false;
      }, 5000); */
    }

  }

  updateRecord(record) {
    const Index = this.dotCoins.findIndex(item => item.reward_setup_id === this.rewardsSetupId);
    this.dotCoins[Index] = record;
  }

  showSuccessMessage(type: string, result): void {
    this.formLoading = false;
    if (type === 'UPDATE'){
      this.toastrService.success(ERROR_MESSAGE.RECORD_UPDATED);
    } else {
      this.toastrService.success(ERROR_MESSAGE.RECORD_ADDED);
    }
    $('#addDotcoinModal').modal('hide');
    this.dotCoinsPage = 1;
    this.rewardsForm.reset();
  }

  closeModal() {
    this.rewardsForm.reset();
    $('#addDotcoinModal').modal('hide');
  }
}


export interface IDotRewards {
  reward_setup_id?: number;
  reward_title: string;
  reward_action: string;
  reward_points: string;
  reward_badge: string;
  topic: string;
}
