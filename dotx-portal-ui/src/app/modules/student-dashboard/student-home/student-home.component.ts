import { ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { HelperService } from 'src/app/shared/services/helper.service';
import { StudentHelperService } from '../student-helper.service';
import { DatePipe } from '@angular/common';
import { FileUploadComponent } from 'src/app/shared/component/file-upload/file-upload.component';
import { WorkLocationComponent } from '../work-location/work-location.component';
import { environment } from 'src/environments/environment';
import { AuthState } from 'src/app/store/auth.model';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { userResponse } from 'src/app/store/auth.selector';
declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-student-home',
  templateUrl: './student-home.component.html',
  styleUrls: ['./student-home.component.css'],
  providers: [DatePipe]
})
export class StudentHomeComponent implements OnInit, OnDestroy {
  userInfo: any;
  userId: any;
  subscrition: Subscription[] = [];
  isLoading: boolean;
  // quoteDetails: any;
  daily_dot_Quote_rec_id: any;
  daily_dot_Question_rec_id: any;
  daily_dot_Poll_rec_id: any;
  daily_dot_Journal_rec_id: any;
  DailyQuoteToday: any;
  DailyQuestionToday: any;
  DailyPollToday: any;
  DailyJournalToday: any;
  selectedQuestionResp: any;
  quesOption1: any;
  quesOption2: any;
  quesOption3: any;
  quesOption4: any;
  pollOption1: any;
  pollOption2: any;
  pollOption3: any;
  pollOption4: any;
  textBoxCountJournal = 0;
  active: any;
  validateAnswer: any;
  myDate = new Date();
  TodayDate: any;
  answersArr: any = [];
  isDayFirstLogin: string;
  gratitudeFile: any;
  isGoogle: any;
  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    size: 'lg'
  };

  quoteDetails: any = [
    {
      record_title: 'Daily Quote',
      daily_dot_rec_id: 1203,
      record_description: 'You may not control all the events that happen to you, but you can decide not to be reduced by them. -Maya Angelou'
    },
    // {
    //   record_title: "Daily Question",
    //   daily_dot_rec_id: 1204,
    //   record_description: "Hello question",
    //   option1: 'Good',
    //   option2: 'Bad',
    //   option3: 'Sad',
    //   option4: 'Cool'

    // },
    {
      record_title: 'Daily Poll',
      daily_dot_rec_id: 1205,
      record_description: 'Hello Poll',
      option1: 'Good Poll',
      option2: 'Bad Poll',
      option3: 'Sad Poll',
      option4: 'Cool Poll',
    }, {
      record_title: 'Daily Journal',
      daily_dot_rec_id: 1206,
      record_description: 'Hello Journal'
    }
  ];

  createJournalForm = this.fb.group({
    option1: ['', [Validators.required]],
    option2: ['', [Validators.required]],
    option3: ['', [Validators.required]],
    option4: ['', [Validators.required]]
  });

  constructor(private modalService: NgbModal,
              private cd: ChangeDetectorRef,
              private fb: FormBuilder,
              private datePipe: DatePipe,
              private toastrService: ToastrService,
              private route: Router,
              private studentHelperService: StudentHelperService,
              public activeModal: NgbActiveModal,
              public helperService: HelperService,
              private ngZone: NgZone,
              private activateRoute: ActivatedRoute,
              private store: Store<AuthState>) {

  }
  ngOnInit() {
    this.subscrition.push(
      this.store.select(userResponse).subscribe(userResp => {
        if (userResp) {
          this.userInfo = userResp;
          this.userId = this.userInfo;
          this.isDayFirstLogin = this.userInfo.day_first_login;
        }
      })
    );

    this.TodayDate = this.datePipe.transform(this.myDate, 'yyyy-MM-dd');
    this.openQuotesModal();
  }
  openWorkLocationModal() {
    const modalRef = this.modalService.open(WorkLocationComponent, { windowClass: 'clModal' });
    modalRef.result.then((res) => {
      this.openQuotesModal();
    }, (reason) => {
      if (reason) {
        this.openQuotesModal();
      }
    });
  }

  goToSpotlight() {
    this.ngZone.run(() => this.route.navigate(['/main-route/student/spotlight'])).then();
  }

  openQuotesModal() {
    if (this.isDayFirstLogin === '1') {
      this.dailyQuoteDetails();
    }
  }

  moveToQuestion() {
    for (let element of this.quoteDetails) {
      if (element.record_title == "Daily Question") {
        this.activeModal.close();
        $('#studentTodayQuestionModal').modal('show');
        $('#studentDailyQuoteModal').modal('hide');
        break;
      } else if (element.record_title == "Daily Poll") {
        this.activeModal.close();
        $('#dailyPollModal').modal('show');
        $('#studentTodayQuestionModal').modal('hide');
        break;
      } else if (element.record_title == "Daily Journal") {
        this.activeModal.close();
        $('#gratitudeJournalModal').modal('show');
        $('#dailyPollModal').modal('hide');
        break;
      } else {
        this.activeModal.close();
        $('#studentDailyQuoteModal').modal('hide');
      }
    }
  }

  moveToPoll() {
    for (let element of this.quoteDetails) {
      if (element.record_title == "Daily Poll") {
        this.activeModal.close();
        $('#dailyPollModal').modal('show');
        $('#studentTodayQuestionModal').modal('hide');
        break;
      } else if (element.record_title == "Daily Journal") {
        this.activeModal.close();
        $('#gratitudeJournalModal').modal('show');
        $('#dailyPollModal').modal('hide');
        break;
      }
    };
  }

  moveToJournal() {
    for (let element of this.quoteDetails) {
      if (element.record_title == "Daily Journal") {
        this.activeModal.close();
        $('#gratitudeJournalModal').modal('show');
        $('#dailyPollModal').modal('hide');
        break;
      }
    };
  }


  BindDailyQuestion(quoteDetails) {
    quoteDetails.forEach((element, i) => {
      if (element.record_title == "Daily Quote") {
        this.DailyQuoteToday = quoteDetails[i].record_description;
        this.daily_dot_Quote_rec_id = quoteDetails[i].daily_dot_rec_id;
        $('#studentDailyQuoteModal').modal('show');
      }
      if (element.record_title == "Daily Question") {
        this.DailyQuestionToday = quoteDetails[i].record_description;
        this.daily_dot_Question_rec_id = quoteDetails[i].daily_dot_rec_id;
        this.quesOption1 = quoteDetails[i].option1;
        this.quesOption2 = quoteDetails[i].option2;
        this.quesOption3 = quoteDetails[i].option3;
        this.quesOption4 = quoteDetails[i].option4;
      }
      if (element.record_title == "Daily Poll") {
        this.DailyPollToday = quoteDetails[i].record_description;
        this.daily_dot_Poll_rec_id = quoteDetails[i].daily_dot_rec_id;
        this.pollOption1 = quoteDetails[i].option1;
        this.pollOption2 = quoteDetails[i].option2;
        this.pollOption3 = quoteDetails[i].option3;
        this.pollOption4 = quoteDetails[i].option4;
      }
      if (element.record_title == "Daily Journal") {
        this.DailyJournalToday = quoteDetails[i].record_description;
        this.daily_dot_Journal_rec_id = quoteDetails[i].daily_dot_rec_id;
      }
    });
    // if (quoteDetails)
    //   this.DailyQuoteToday = quoteDetails[0].record_description;
    // this.DailyQuestionToday = quoteDetails[1].record_description;
    // this.DailyPollToday = quoteDetails[2].record_description;
    // this.DailyJournalToday = quoteDetails[3].record_description;

    sessionStorage.setItem('dailyDot', JSON.stringify(quoteDetails));
    this.isLoading = false;
  }

  dailyQuoteDetails() {
    this.isLoading = true;
    let userId = this.userId;
    let payload = {
      userId: userId,
      record_date: this.TodayDate
    }
    this.studentHelperService.getDailyQuotes(payload).subscribe((resp) => {
      console.log('..... daily Quote resp', resp);
      console.log('..... daily Quote static', this.quoteDetails);
      this.isLoading = false;
      this.quoteDetails = resp;
      if (this.quoteDetails.length > 0) {
        this.BindDailyQuestion(this.quoteDetails);
        sessionStorage.setItem('day_first_login', '0');
      } else {
        this.isLoading = false;
        this.toastrService.info('No quotes found');
      }

    }, () => {
      this.isLoading = false;
      console.log('error ......');
      this.toastrService.error('Unable to get dailyQuotes');
    })
  }

  submitQailyQuote() {
    this.isLoading = true;
    //  const { daily_dot_rec_id, record_response } = this.quoteDetails[0];
    let payload = {
      "daily_dot_rec_id": this.daily_dot_Quote_rec_id,
      "record_response": 'submitted'
    }
    // this.moveToQuestion();
    this.studentHelperService.postDailyQuote(payload).subscribe((resp) => {
      console.log('..... daily Quote resp', resp);
      // this.quoteDetails = resp;
      this.toastrService.success('Daily quote submitted !');
      this.moveToQuestion();
      // $('#studentTodayQuestionModal').modal('show');
      // $('#studentDailyQuoteModal').modal('hide');
      this.isLoading = false;
    }, () => {
      this.isLoading = false;
      console.log('error ......');
      this.toastrService.error('Unable to submit dailyQuote');
    })
  }

  submitQuestion() {
    this.isLoading = true;
    const { daily_dot_rec_id } = this.quoteDetails[1];
    if (this.validateAnswer == 'anectodeAnswer') {
      let payload = {
        "daily_dot_rec_id": daily_dot_rec_id,
        "record_response": this.selectedQuestionResp
      }
      // this.moveToPoll();
      this.studentHelperService.postDailyQuestion(payload).subscribe((resp) => {
        console.log('..... daily question resp', resp);
        // this.quoteDetails = resp;
        this.isLoading = false;
        this.toastrService.success('Daily Question submitted !');
        this.moveToPoll();
        // $('#dailyPollModal').modal('show');
        // $('#studentTodayQuestionModal').modal('hide');
      }, () => {
        this.isLoading = false;
        console.log('error ......');
        this.toastrService.error('Unable to update question');
      })
    }
    else {
      this.isLoading = false;
      this.toastrService.warning('Please select answer');
      return false;
    }
  }

  submitPoll() {
    this.isLoading = true;
    const { daily_dot_rec_id } = this.quoteDetails[2];
    if (this.validateAnswer == 'pollAnswer') {
      let payload = {
        "daily_dot_rec_id": daily_dot_rec_id,
        "record_response": this.selectedQuestionResp
      }
      // this.moveToJournal();
      this.studentHelperService.postDailyQuestion(payload).subscribe((resp) => {
        console.log('..... daily question resp', resp);
        // this.quoteDetails = resp;
        this.isLoading = false;
        this.toastrService.success('Daily Poll submitted !');
        this.moveToJournal();
        // $('#gratitudeJournalModal').modal('show');
        // $('#dailyPollModal').modal('hide');
      }, () => {
        this.isLoading = false;
        console.log('error ......');
        this.toastrService.error('Unable to update Poll');
      })
    }
    else {
      this.isLoading = false;
      this.toastrService.warning('Please select answer');
      return false;
    }
  }

  submitJournal() {
    const { option1, option2, option3, option4 } = this.createJournalForm.value;
    if (this.createJournalForm.get('option1').valid || this.createJournalForm.get('option2').valid || this.createJournalForm.get('option3').valid || this.createJournalForm.get('option4').valid) {

      this.isLoading = true;
      const { daily_dot_rec_id } = this.quoteDetails[3];
      let payload = {
        "daily_dot_rec_id": daily_dot_rec_id,
        "record_response": 'sumbitted',
        "option1": option1 ? option1 : null,
        "option2": option2 ? option2 : null,
        "option3": option3 ? option3 : null,
        "option4": option4 ? option4 : null,
        file_upload_path: this.gratitudeFile
      }
      this.studentHelperService.postDailyJournal(payload).subscribe((resp) => {
        console.log('..... daily question Journal', resp);
        // this.quoteDetails = resp;
        this.isLoading = false;
        this.toastrService.success('Daily Journal submitted !');
        $('#gratitudeJournalModal').modal('hide');
      }, () => {
        this.isLoading = false;
        console.log('error ......');
        this.toastrService.error('Unable to update Journal');
      })
    }
    else {
      this.toastrService.warning('Please answer atleast one');
      return false;
    }
  }

  onSelect(data, answer) {
    console.log(data, answer);
    this.validateAnswer = answer;
    this.selectedQuestionResp = data;
    this.active = data;
  }

  openDocument() {
    let filePath = environment.fileLocation + this.gratitudeFile;
    // event.stopPropagation();
    // this.filePath = fileUrl;
    window.open(
      filePath,
      '_blank'
    );
  }

  openAvatarModal() {
    const modalData = {
      headerName: 'File',
      fileType: 'image'
    };

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
        this.gratitudeFile = reason[0].file;
      }
    });
  }

  addAnswer() {
    this.answersArr.push(this.textBoxCountJournal + 1);
    this.cd.detectChanges();
  }

  submitmarkAsTouched() {
    Object.values(this.createJournalForm.controls).forEach((control: any) => {
      control.markAsTouched();
    });
  }

  ngOnDestroy(): void {
    if (this.subscrition.length) {
      this.subscrition.forEach(sub => sub.unsubscribe());
    }
  }
}
