import { ChangeDetectorRef, Component, Input, NgZone, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { DATE_FORMAT } from 'src/app/shared/constants/input.constants';

import { IDotPersonalityQuiz, DotPersonalityQuiz } from 'src/app/shared/model/dot-personality-quiz.model';
import { DotPersonalityQuizService } from '../dot-personality-quiz/dot-personality-quiz.service';
import { StudentHelperService } from '../student-dashboard/student-helper.service';
import { AuthState } from 'src/app/store/auth.model';
import { Store } from '@ngrx/store';
import { userInfo, userResponse } from 'src/app/store/auth.selector';
import { HelperService } from 'src/app/shared/services/helper.service';

@Component({
  selector: 'app-dot-on-boarding-quiz',
  templateUrl: './dot-on-boarding-quiz.component.html',
  styleUrls: ['./dot-on-boarding-quiz.component.css']
})
export class DotOnBoardingQuizComponent implements OnInit {

  @Input() applyCssQuiz: boolean;
  @Input() quizDashboard;
  isSaving = false;
  formHeading = 'Create';
  dotPersonalityQuizs: any;
  isLoading: boolean;
  itemsPerPage = 1;
  isLoaded = false;
  dotPersonalityQuizsdata: any;
  mySubscription: any;
  quizCount: any = 0;
  showTypeOfForm: any;
  selectedOption: any;
  showPersonQuiz: any;
  enableQuizCard: any;
  userSkills: any;
  isSkip = false;
  stud_quiz_id = 410;
  shallowStorage: Array<object> = [];
  answersStore: Array<object> = [];
  enableTextBox = false;
  userId: any;
  quizResponse: any;

  editForm = this.fb.group({
    quizId: [],
    quizDescription: [null],
    quizFilePath: [null],
    quizOrder: [],
    quizStatus: [],
    option1: [null],
    option2: [null],
    option3: [null],
    option4: [null],
    option5: [null],
    option6: [null],
    option7: [null],
    option8: [null],
    option9: [null],
    option10: [null],
    isActive: [],
    createdBy: [null],
    createdDate: [],
    lastmodifiedBy: [null],
    lastmodifiedDate: [],
  });

  constructor(
    private toastrService: ToastrService,
    protected dotPersonalityQuizService: DotPersonalityQuizService,
    private studentHelperService: StudentHelperService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private cd: ChangeDetectorRef,
    private store: Store<AuthState>,
    private helperService: HelperService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this.mySubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false;
      }
    });
  }

  ngOnInit(): void {
    this.store.select(userResponse).subscribe(res => {
        if (res) {
          this.userId = res.id;
        }
    });
    this.getFromQuiz();
    this.getQuizResponse();
    this.showPersonQuiz = this.quizDashboard;

  }

  getFromQuiz(): void {
    this.isLoading = true;

    this.quizCount = 1;
    this.isLoading = true;
    this.dotPersonalityQuizService.filterOnBoarding({ type: 'onboarding' }).subscribe(
      (res: HttpResponse<any>) => {
        this.onSuccess(res.body);
      },
      () => this.onError()
    );

  }

  getQuizResponse(): void {
       this.isLoading = true;
       this.helperService.getUserQuizResponse().subscribe(res => {
         this.isLoading = false;
          if (res && res.length) {
            this.quizResponse = res.filter(res => res.type==='onboarding');
            if (this.quizResponse && this.quizResponse.length) {
              const response = this.quizResponse[0]
              this.selectedOption = response.quiz_response && response.quiz_response.length ? response.quiz_response[0].response: undefined;
            }
          }
       },
       () => {
        this.isLoading = false;
       })
  }

  onError(): void {
    this.isLoading = false;
    throw new Error('Method not implemented.');
  }

  updateForm(dotPersonalityQuiz: any): void {
    this.formHeading = 'Edit';
    this.editForm.patchValue({
      quizId: dotPersonalityQuiz.quizId,
      quizDescription: dotPersonalityQuiz.quizDescription,
      quizFilePath: dotPersonalityQuiz.quizFilePath,
      quizOrder: dotPersonalityQuiz.quizOrder,
      quizStatus: dotPersonalityQuiz.quizStatus,
      option1: dotPersonalityQuiz.option1,
      option2: dotPersonalityQuiz.option2,
      option3: dotPersonalityQuiz.option3,
      option4: dotPersonalityQuiz.option4,
      option5: dotPersonalityQuiz.option5,
      option6: dotPersonalityQuiz.option6,
      option7: dotPersonalityQuiz.option7,
      option8: dotPersonalityQuiz.option8,
      option9: dotPersonalityQuiz.option9,
      option10: dotPersonalityQuiz.option10,
      isActive: dotPersonalityQuiz.isActive,
      createdBy: dotPersonalityQuiz.createdBy,
      createdDate: dotPersonalityQuiz.createdDate ? dotPersonalityQuiz.createdDate : null,
      lastmodifiedBy: dotPersonalityQuiz.lastmodifiedBy,
      lastmodifiedDate: dotPersonalityQuiz.lastmodifiedDate ? dotPersonalityQuiz.lastmodifiedDate : null,
    });
    this.cd.detectChanges();
  }

  backTo() {
    if (this.shallowStorage.length === 0) {
      return false;
    } else {
      this.shallowStorage.reverse();
      this.answersStore.reverse();

      this.dotPersonalityQuizs = this.shallowStorage[0];
      this.selectedOption = this.answersStore[0];
      console.log(this.dotPersonalityQuizs, this.selectedOption);
      this.updateForm(this.dotPersonalityQuizs);
      this.ngOnInit();
      this.shallowStorage.splice(0, 1);
    }
  }

  nextState(): void {

    this.isSkip = true;
    this.cd.detectChanges();
    const arr = this.dotPersonalityQuizsdata;
    this.shallowStorage.push(this.dotPersonalityQuizsdata[0]);
    this.answersStore.push(this.selectedOption);
    const remain = arr.splice(0, 1);
    if (arr.length === 0) {
      this.router.navigate(['main-route/user/userDetails']);
    } else {
      this.router.navigate(['main-route/skill/detail']);
    }

    this.dotPersonalityQuizs = arr[0];
    this.updateForm(this.dotPersonalityQuizs);
    this.selectedOption = undefined;
    this.cd.detectChanges();
    this.ngOnInit();
  }

  save(): any {
    this.isLoading = true;
    if (this.selectedOption === undefined) {
      this.cd.detectChanges();
      this.toastrService.warning('Please answer the question');
      this.isLoading = false;
      return false;
    } else {
      this.isSaving = true;
      const dotPersonalityQuiz = this.createFromForm();
      const body = {
        quiz: dotPersonalityQuiz.quizId ? dotPersonalityQuiz.quizId : dotPersonalityQuiz['quiz_id'],
        selected_options: [{option: this.selectedOption}]
      };
      this.subscribeToSaveResponse(this.dotPersonalityQuizService.create(body));
    }
  }

  private createFromForm(): IDotPersonalityQuiz {
    return {
      ...new DotPersonalityQuiz(),
      quizId: this.editForm.get(['quizId'])!.value,
      quizDescription: this.editForm.get(['quizDescription'])!.value,
      quizFilePath: this.editForm.get(['quizFilePath'])!.value,
      quizOrder: this.editForm.get(['quizOrder'])!.value,
      quizStatus: this.editForm.get(['quizStatus'])!.value,
      option1: this.editForm.get(['option1'])!.value,
      option2: this.editForm.get(['option2'])!.value,
      option3: this.editForm.get(['option3'])!.value,
      option4: this.editForm.get(['option4'])!.value,
      isActive: this.editForm.get(['isActive'])!.value,
      createdBy: this.editForm.get(['createdBy'])!.value,
      createdDate: this.editForm.get(['createdDate'])!.value ? moment(this.editForm.get(['createdDate'])!.value, DATE_FORMAT) : undefined,
      lastmodifiedBy: this.editForm.get(['lastmodifiedBy'])!.value,
      lastmodifiedDate: this.editForm.get(['lastmodifiedDate'])!.value
        ? moment(this.editForm.get(['lastmodifiedDate'])!.value, DATE_FORMAT)
        : undefined,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDotPersonalityQuiz>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSuccess(data: any): void {
    this.isLoading = false;
    this.dotPersonalityQuizsdata = data;
    this.dotPersonalityQuizs = data[0] || [];
    this.updateForm(this.dotPersonalityQuizs);
    this.isLoaded = true;
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.isLoading = false;
    const msg = this.editForm.get(['quizId']) && this.editForm.get(['quizId']).value ? 'Updated' : 'Created';
    this.nextState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
    this.isLoading = false;
    this.toastrService.warning(`Call Failed`);
  }

  goToQuiz() {
    this.getFromQuiz();
    this.enableQuizCard = 'quiz';
  }

  skipTo(showTypeOfForm): void {
    this.ngZone.run(() => this.router.navigate(['main-route/user/userDetails'])).then();
  }

  setActive(option: any) {
    this.selectedOption = option;
  }

  speicfyOthers() {
    let { option10 } = this.editForm.value;
    this.selectedOption = option10;
  }

  ngOnDestroy(): void {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }

}
