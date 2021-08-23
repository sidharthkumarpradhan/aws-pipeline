import { DatePipe } from '@angular/common';
import { AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Color } from 'ng2-charts';
import { ToastrService } from 'ngx-toastr';
import { filter } from 'rxjs/operators';
import { take } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { FileUploadComponent } from 'src/app/shared/component/file-upload/file-upload.component';
import { HelperService } from 'src/app/shared/services/helper.service';
import { AuthState } from 'src/app/store/auth.model';
import { userInfo, userResponse } from 'src/app/store/auth.selector';
import { environment } from 'src/environments/environment';
import { StudentHelperService } from '../student-helper.service';

declare var jQuery: any;
declare var $: any;


@Component({
  selector: 'app-daily-dot-home',
  templateUrl: './daily-dot-home.component.html',
  styleUrls: ['./daily-dot-home.component.css'],
  providers: [DatePipe],
  //changeDetection: ChangeDetectionStrategy.OnPush,
})


export class DailyDotHomeComponent implements OnInit {

  isLoading: boolean;
  userId: any;
  quoteDetails: any = [];
  DailyQuoteToday: any;
  DailyQuestionToday: any;
  DailyPollToday: any;
  DailyJournalToday: any;
  selectedQuestionResp: any;
  dailyObj: any;
  daily_dot_id: any;
  questions: any;
  polls: any;
  journals: any;
  fromEdit: any = false;
  DailyDots: any;
  active: any;
  answersArr: any = [];
  textBoxCountJournal: number = 0;
  validateAnswer: any;
  daily_dot_rec_id: any;
  myDate = new Date();
  TodayDate: any;
  streaks: any;
  Quote: any;
  Anectode: any;
  Poll: any;
  Gratitude: any;
  gratitudeFile: any;

  createJournalForm = this.fb.group({
    option1: ['', [Validators.required]],
    option2: ['', [Validators.required]],
    option3: ['', [Validators.required]],
    option4: ['', [Validators.required]]
  });

  cssClasses = ['nothing-to-do-box', 'time-flying-box', 'relation-box', 'energy-box']

  public doughnutChartLabels1 = ['Poll P1', 'Poll P2'];
  public doughnutChartLabels2 = ['Feeling F1', 'Feeling F2'];
  public doughnutChartLabels3 = ['Anecdote A1', 'Anecdote A2'];
  public doughnutChartLabels4 = ['Gratitude G1', 'Gratitude G2'];
  public doughnutChartData1 = [9, 3];
  public doughnutChartData2 = [1, 15];
  public doughnutChartData3 = [32, 12];
  public doughnutChartData4 = [7, 24];
  public doughnutChartType = 'doughnut';
  public pieChartType = 'pie';
  public doughnutChartLegend: boolean = false;
  colors1: Color[] = [
    {
      backgroundColor: [
        '#2c82be',
        '#dbecf8',
      ]
    }
  ];
  colors2: Color[] = [
    {
      backgroundColor: [
        '#032857',
        '#dbecf8',
      ]
    }
  ];
  colors4: Color[] = [
    {
      backgroundColor: [
        '#2c82be',
        '#dbecf8',
      ]
    }
  ];

  constructor(private cd: ChangeDetectorRef, private fb: FormBuilder, private modalService: NgbModal,
              private toastrService: ToastrService, private route: Router, private studentHelperService: StudentHelperService,
              public activeModal: NgbActiveModal, public _uhs: HelperService, private datePipe: DatePipe,
              private store: Store<AuthState>) { }



  ngOnInit(): void {
    this.TodayDate = this.datePipe.transform(this.myDate, 'yyyy-MM-dd');
    this.store.select(userResponse).subscribe(res => {
      if (res) {
        this.userId = res.id;
      }
    });

    this.dailyQuoteDetails();
    this.getStreaks();
    this.getRetrieveQuestions();
    this.getRetrievePolls();
    this.getRetrieveJournals();
    console.log('file', this.gratitudeFile)

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
      this.isLoading = false;
      this.quoteDetails = resp;
      this.BindDailyQuestion();

    }, () => {
      this.isLoading = false;
      console.log('error ......');
      this.toastrService.error('Unable to get dailyQuotes');
    })
  }

  getStreaks() {
    this.isLoading = true;

    this.studentHelperService.getStreaks().subscribe((resp) => {
      console.log('..... Streaks resp', resp);
      this.isLoading = false;
      this.Quote = resp[0]['1'];
      this.Anectode = resp[1]['2'];
      this.Poll = resp[2]['3'];
      this.Gratitude = resp[3]['4'];
    }, () => {
      this.isLoading = false;
      console.log('error ......');
      this.toastrService.error('Unable to get Streaks');
    })
  }


  BindDailyQuestion() {
    this.dailyObj = this.quoteDetails;
    //  this.quoteDetails = this.quoteDetails;
    if (this.dailyObj.length > 0) {
      this.DailyDots = this.dailyObj.filter(item => item.record_response == null);
      this.DailyQuoteToday = this.dailyObj[0].record_description;
      this.DailyQuestionToday = this.dailyObj[1].record_description;
      this.DailyPollToday = this.dailyObj[2].record_description;
      this.DailyJournalToday = this.dailyObj[3].record_description;
      setTimeout(() => {
        // Testimonials Slider Script
        jQuery('.daily-dot-slider').slick({
          dots: true,
          infinite: 0,
          speed: 500,
          arrows: false
        });
      }, 1000);
    }

    // this.isLoading = false;
  }

  callSwitchModal(daily_dot_id, daily_dot_rec_id) {
    switch (daily_dot_id) {

      case 1:
        $('#studentDailyQuoteModal').modal('show');
        if (this.dailyObj.length > 0) {
          this.daily_dot_rec_id = this.dailyObj[0].daily_dot_rec_id;
          this.daily_dot_id = this.dailyObj[0].daily_dot_id;
          this.selectedQuestionResp = this.dailyObj[0].record_description;
        }
        break;
      case 2:
        $('#studentTodayQuestionModal').modal('show');
        if (this.dailyObj.length > 0) {
          this.daily_dot_rec_id = this.dailyObj[1].daily_dot_rec_id;
          this.daily_dot_id = this.dailyObj[1].daily_dot_id;
        }
        //  this.selectedQuestionResp = this.dailyObj[1].record_description;
        break;
      case 3:
        $('#dailyPollModal').modal('show');
        if (this.dailyObj.length > 0) {
          this.daily_dot_id = this.dailyObj[2].daily_dot_id;
          this.daily_dot_rec_id = this.dailyObj[2].daily_dot_rec_id;

        }
        this.cd.detectChanges();
        break;
      case 4:
        $('#gratitudeJournalModal').modal('show');
        if (this.dailyObj.length > 0) {
          this.daily_dot_rec_id = this.dailyObj[3].daily_dot_rec_id;
          this.daily_dot_id = this.dailyObj[3].daily_dot_id;
        }
        break;
      default:
        console.log("No such exists!");
        break;
    }
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


  onClickContinue(item) {
    console.log('item click', item);
    this.fromEdit = false;
    let { daily_dot_id, daily_dot_rec_id } = item;
    this.callSwitchModal(daily_dot_id, daily_dot_rec_id);

  }

  onSelect(data, answer) {
    console.log(data, 'feel');
    this.selectedQuestionResp = data;
    this.validateAnswer = answer;
    this.active = data;
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
        // this.createProfileForm.controls.avatarImageFile.setValue(reason.filename);
        // this.userProfilePic = environment.fileLocation+reason.filename;
      }
    });
  }

  submitQailyQuote() {
    this.isLoading = true;
    const { daily_dot_rec_id, record_response } = this.quoteDetails[0];
    let payload = {
      "daily_dot_rec_id": daily_dot_rec_id,
      "record_response": record_response
    }
    this.studentHelperService.postDailyQuote(payload).subscribe((resp) => {
      console.log('..... daily Quote resp', resp);
      // this.quoteDetails = resp;
      this.toastrService.success('Daily quote submitted !');
      this.isLoading = false;
      location.reload();
      if (!this.fromEdit) {
        this.nextState(this.daily_dot_id + 1);
      }

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
      this.studentHelperService.postDailyQuestion(payload).subscribe((resp) => {
        console.log('..... daily question resp', resp);
        // this.quoteDetails = resp;
        this.isLoading = false;
        this.toastrService.success('Daily Question submitted !');
        $('#studentTodayQuestionModal').modal('hide');
        location.reload();
        this.cd.detectChanges();
        if (!this.fromEdit) {
          this.nextState(this.daily_dot_id + 1);
        }
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
      this.studentHelperService.postDailyQuestion(payload).subscribe((resp) => {
        console.log('..... daily question resp', resp);
        // this.quoteDetails = resp;
        this.isLoading = false;
        this.toastrService.success('Daily Poll submitted !');
        $('#dailyPollModal').modal('hide');
        location.reload();
        this.cd.detectChanges();
        if (!this.fromEdit) {
          this.nextState(this.daily_dot_id + 1);
        }
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
      this.isLoading = true;
      this.studentHelperService.postDailyJournal(payload).subscribe((resp) => {
        console.log('..... daily question Journal', resp);
        const quoteDetails = resp;
        this.isLoading = false;
        this.toastrService.success('Daily Journal submitted !');
        $('#gratitudeJournalModal').modal('hide');
        location.reload();
        this.cd.detectChanges();
      }, () => {
        this.isLoading = false;
        console.log('error ......');
        this.toastrService.error('Unable to update Journal');
      })
    }
    else {
      this.toastrService.warning('Please answer atleast one');
      this.isLoading = false;
      return false;
    }
  }

  // submit(journal) {
  //  this.isLoading = true;
  //  let payload;
  //  const { option1,option2,option3,option4} = this.createJournalForm.value;
  //   if(journal == 'Journal'){
  //      payload = {
  //           daily_dot_rec_id: this.daily_dot_rec_id, 
  //           record_response:"sumbitted",
  //           'option1' : option1 ? option1 : null,
  //           'option2' : option2 ? option2 : null,
  //            option3: option3 ? option3 : null,
  //            option4: option4 ? option4 : null
  //         }
  //   }else {
  //      payload = {
  //       "daily_dot_rec_id": this.daily_dot_rec_id,
  //       "record_response":  this.selectedQuestionResp
  //     }
  //   }

  //   this.studentHelperService.postDailyQuestion(payload).subscribe((resp) => {
  //     this.isLoading = false;
  //     this.cd.detectChanges();
  //      console.log('..... resp',resp);
  //     const quoteDetails = resp;
  //      this.toastrService.success('Success !');
  //      if(!this.fromEdit){
  //       this.nextState(this.daily_dot_id + 1);
  //      }
  //    }, () => {
  //       this.isLoading = false;
  //       console.log('error ......');
  //       this.toastrService.error('Fail');
  //    })
  // }

  nextState(num): void {
    let arrInd = this.quoteDetails[num - 1].daily_dot_id;
    let isValid = this.quoteDetails.findIndex(item => item.daily_dot_id !== arrInd) > -1;
    if (isValid && arrInd < 5) {
      this.callSwitchModal(arrInd, null);
    } else if (arrInd < 5) {
      this.nextState(arrInd);
    }
    this.cd.detectChanges();
  }

  getRetrieveQuestions() {
    this.isLoading = true;
    let payload = {
      user_id: this.userId,
      daily_dot_id: 2
    }
    this.studentHelperService.retrieveQuestions(payload).subscribe((resp) => {
      this.questions = resp;
      setTimeout(() => {
        this.callanecdoteSliders();
      }, 1000);
      this.cd.detectChanges();
      console.log('..... all questions', this.questions);
      this.isLoading = false;
    }, () => {
      this.isLoading = false;
      console.log('error ......');
      this.toastrService.error('Unable to get polls');
    })
  }

  getRetrievePolls() {
    this.isLoading = true;
    let payload = {
      user_id: this.userId,
      daily_dot_id: 3
    }
    this.studentHelperService.retrievePolls(payload).subscribe((resp) => {
      this.polls = resp;
      setTimeout(() => {
        this.callPollSliders();
        console.log('..... all polls', this.polls);
        this.isLoading = false;

      }, 1000);

    }, () => {
      this.isLoading = false;
      console.log('error ......');
      this.toastrService.error('Unable to get polls');
    })
  }

  getRetrieveJournals() {
    this.isLoading = true;
    let payload = {
      user_id: this.userId,
      daily_dot_id: 4
    }
    this.studentHelperService.retrieveJournals(payload).subscribe((resp) => {
      this.journals = resp;
      setTimeout(() => {
        this.callJournalSliders();
      }, 1000);
      this.cd.detectChanges();
      console.log('..... all jounrnals', this.journals);
      this.isLoading = false;
    }, () => {
      this.isLoading = false;
      console.log('error ......');
      this.toastrService.error('Unable to get journals');
    })
  }


  onClickEdit(item) {

    this.fromEdit = true;
    type NumberArray = Array<{ id: number, text: string }>;
    const arr: NumberArray = [];
    this.quoteDetails = arr;
    console.log('item', item, this.quoteDetails);
    if (item.daily_dot_id == 1) {
      this.quoteDetails[0] = item;
      this.DailyQuoteToday = item.record_description;
    } else if (item.daily_dot_id == 2) {
      this.quoteDetails[1] = item;
      this.DailyQuestionToday = item.record_description;
      this.active = item.record_response;
    } else if (item.daily_dot_id == 3) {
      this.quoteDetails[2] = item;
      this.DailyPollToday = item.record_description;
    }
    else if (item.daily_dot_id == 4) {
      this.quoteDetails[3] = item;
      this.DailyJournalToday = item.record_description;
      this.createJournalForm.patchValue({
        option1: item.option1,
        option2: item.option2,
        option3: item.option3,
        option4: item.option4,
      });

    }
    // this.cd.detectChanges();
    this.callSwitchModal(item.daily_dot_id, item.daily_dot_rec_id);
  }

  addAnswer() {
    this.answersArr.push(this.textBoxCountJournal + 1);
    this.cd.detectChanges();
  }

  // ngAfterContentInit() {
  //   this.studentHelperService.loadScript('https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js')
  //     .pipe(
  //       map(_ => 'jQuery is loaded'),
  //       filter(jquery => !!jquery),
  //       take(1),
  //       // switchMap(_ => this.studentHelperService.loadScript('https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.9.0/slick.min.js')),
  //     )
  //     .subscribe(_ => {
  //       $('.daily-poll-slider').slick({


  //         centerMode: true,
  //         centerPadding: '90px',
  //         slidesToShow: 4,
  //         autoScroll: true,
  //         infinite: true,
  //         responsive: [
  //           {
  //             breakpoint: 1024,
  //             settings: {
  //               slidesToShow: 3,
  //               slidesToScroll: 1,
  //               infinite: true,
  //               dots: true,
  //             },
  //           },
  //           {
  //             breakpoint: 600,
  //             settings: {
  //               slidesToShow: 2,
  //               slidesToScroll: 1,
  //             },
  //           },
  //           {
  //             breakpoint: 480,
  //             settings: {
  //               slidesToShow: 1,
  //               slidesToScroll: 1,
  //             },
  //           },
  //         ]
  //       });

  //     });
  // }


  callPollSliders() {
    jQuery('.daily-poll-slider').slick({

      slidesToShow: 4,
      infinite: 0,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            arrows: false,
            // centerMode: true,
            centerPadding: '40px',
            slidesToShow: 4
          }
        },
        {
          breakpoint: 480,
          settings: {
            arrows: false,
            // centerMode: true,
            centerPadding: '40px',
            slidesToShow: 1
          }
        }
      ]
    });
  }

  callJournalSliders() {

    // Daily Gratitude Slider Script 
    jQuery('.daily-gratitude-slider').slick({
      slidesToShow: 4,
      infinite: 0,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            arrows: false,
            // centerMode: true,
            centerPadding: '40px',
            slidesToShow: 3
          }
        },
        {
          breakpoint: 480,
          settings: {
            arrows: false,
            // centerMode: true,
            centerPadding: '40px',
            slidesToShow: 1
          }
        }
      ]
    });

  }

  callanecdoteSliders() {
    // Daily Gratitude Slider Script 
    $('.daily-anecdote-slider').slick({
      // centerMode: true,
      // centerPadding: '90px',
      // slidesToShow: 4,
      slidesToShow: 4,
      infinite: 0,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            arrows: false,
            // centerMode: true,
            centerPadding: '40px',
            slidesToShow: 3
          }
        },
        {
          breakpoint: 480,
          settings: {
            arrows: false,
            // centerMode: true,
            centerPadding: '40px',
            slidesToShow: 1
          }
        }
      ]
    });
  }

}
