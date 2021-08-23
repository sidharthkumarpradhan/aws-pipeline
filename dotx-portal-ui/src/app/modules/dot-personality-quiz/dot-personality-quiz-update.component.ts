import { ChangeDetectorRef, Component, Input, NgZone, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { DATE_FORMAT, DATE_TIME_FORMAT } from 'src/app/shared/constants/input.constants';

import { IDotPersonalityQuiz, DotPersonalityQuiz } from 'src/app/shared/model/dot-personality-quiz.model';
import { DotPersonalityQuizService } from './dot-personality-quiz.service';
import { StudentHelperService } from '../student-dashboard/student-helper.service';
import { Store } from '@ngrx/store';
import { AuthState } from 'src/app/store/auth.model';
import { userInfo } from 'src/app/store/auth.selector';
// import { HooksUtilityService } from 'src/app/shared/hooks-utility.service';

export interface StudentOptions {
  user: string,
  quiz: Number,
  quiz_status: string,
  quiz_start_date: string,
  quiz_completion_date: string,
  quiz_response: string
}

@Component({
  selector: 'jhi-dot-personality-quiz-update',
  templateUrl: './dot-personality-quiz-update.component.html',
  styleUrls: ['./dot-personality-quiz.component.css']
})

export class DotPersonalityQuizUpdateComponent implements OnInit {

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
  public active = "";
  showPersonQuiz: any;
  enableQuizCard: any;
  userSkills: any;
  isSkip: Boolean = false;
  stud_quiz_id: any = 410;
  shallowStorage: Array<object> = [];
  answersStore: Array<object> = [];
  options: any;
  optionsBulk: StudentOptions[] = [];
  userId: any;
  quiz_id: any;
  enableTextBox: Boolean = false;
  preferredOthers: Boolean = false;
  currentQuiz = 0;
  

  editForm = this.fb.group({
    quizId: [],
    quizDescription: [null],
    quizFilePath: [null],
    quizOrder: [],
    quizStatus: [],
    others: [''],
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
  from: any;

  constructor(
    private toastrService: ToastrService,
    // private hooksUtilityService: HooksUtilityService,
    protected dotPersonalityQuizService: DotPersonalityQuizService,
    private studentHelperService: StudentHelperService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private cd: ChangeDetectorRef,
    private store: Store<AuthState>
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
    this.store.select(userInfo).subscribe(res => {
      if (res) {
        this.userId = res.user_id ? res.user_id : res.userId;
      }
    });
    this.navigationExtras();
    //  this.getQuizRetreive(userId);
    this.showPersonQuiz = this.quizDashboard;
    const { handlePersonalQuiz } = this.studentHelperService;
    if (handlePersonalQuiz.observers.length === 0) {
      this.studentHelperService.handlePersonalQuiz.subscribe(resp => {
        if (resp) {

          this.showPersonQuiz = resp;

          // this.getQuizRetreive(userId);
        }
      });
    }

  }

  navigationExtras() {
    this.activatedRoute.queryParams.subscribe(params => {
      const typeOf = params.typeOf;
      if (typeOf === 'onboarding') {
        this.showTypeOfForm = 'ONBOARDING';
      } else {
        this.showTypeOfForm = 'QUIZ';
      }
      this.from = params.from;
      if (this.quizCount === 0) {
        this.getFromQuiz(typeOf);
      }
      this.cd.detectChanges();

    });
  }

  getQuizRetreive(userId) {
    this.isLoading = true;
    this.dotPersonalityQuizService.quizRetrival({ user_id: userId }).subscribe(
      (res: HttpResponse<any>) => {
        //  this.onSuccess(res.body, res.headers)
        this.userSkills = res.body;
        const key = 'personality';
        const arrayUniqueByKey = [...new Map(this.userSkills.map(item =>
          [item.quiz[key], item])).values()];
        console.log(arrayUniqueByKey);
        const arr = arrayUniqueByKey.map(history => {
          return history['quiz'];
        });
      },
      () => this.onError()
    );
  }

  getFromQuiz(typeOf: string): void {
    this.isLoading = true;
    let body = { "type": typeOf };
    this.quizCount = 1;
    if (typeOf === undefined) {  //// This should remove later--------------]]]]]]]]]]]]]]]]]]]]
      this.isLoading = true;
      this.dotPersonalityQuizService.filter().subscribe(
        (res: HttpResponse<any>) => {
          this.onSuccess(res.body, res.headers)
        },
        () => this.onError()
      );
    } else {
      this.dotPersonalityQuizService.filter().subscribe(
        (res: HttpResponse<any>) => this.onSuccess(res.body, res.headers),
        () => this.onError()
      );
    }

  }
  onError(): void {
    this.isLoading = false;
    throw new Error('Method not implemented.');
  }


  speicfyOthers() {
    const { others } = this.editForm.value;
    this.optionsBulk.forEach(ele => {
      if (ele.quiz_response === 'Others') {
        ele.quiz_response = others;
      }
    });
  }

  addNewOption(option) {
    return {
      quiz: this.quiz_id,
      quiz_status: '1',
      quiz_start_date: '2021-04-15 21:09',
      quiz_completion_date: '2021-04-15 21:09',
      quiz_response: option
    };
  }

  checkItem(option, optionIndex, event): void {
    const skillCheck = event.srcElement.checked;
    if (option === 'Others' && skillCheck) {
      this.enableTextBox = true;
      this.preferredOthers = true;
    } else if (!skillCheck && option === 'Others') {
      this.enableTextBox = false;
      this.preferredOthers = false;
    }
    if (skillCheck) {
      this.optionsBulk.push(option);
    } else if (this.optionsBulk.length) {
      this.optionsBulk = this.optionsBulk.filter(item => item !== option);
    }
  }

  setOptions(optionsRes) {
    this.options.forEach((element) => {
      let isChecked = false;
      const filterData = optionsRes.find((item) => item === element.option);
      if (filterData) {
        isChecked = true;
        //   const skillFile = this.findMySkillFile(element);
        this.optionsBulk.push(element.option);
        element['selected'] = isChecked;
        // this.skillsList[index].skill_file = skillFile;
      }

      this.cd.detectChanges();
    });
  }

  // findMySkillFile(skillId) {
  //   const index = this.mySkills.findIndex(item => item.skill_id === skillId);
  //   return this.mySkills[index].skill_file;

  // }

  extractOptions(arr) {
    const extractedValue = arr.map(item => item.response);
    return extractedValue;
  }


  updateForm(dotPersonalityQuiz): void {
    this.formHeading = 'Edit';
    this.options = dotPersonalityQuiz.options;
    const optionRes = this.extractOptions(dotPersonalityQuiz.quizResponse);
    this.setOptions(optionRes);
    this.cd.detectChanges();
  }

  backTo() {
    this.enableTextBox = false;
    this.editForm.reset();
    if (this.showTypeOfForm === 'QUIZ' && this.currentQuiz === 0) {
      this.router.navigate(['main-route/user/userDetails/userAvatar']);
    } else {
      this.currentQuiz--;
      this.dotPersonalityQuizs = this.dotPersonalityQuizsdata[this.currentQuiz];
      this.quiz_id = this.dotPersonalityQuizs.quizId;
      this.updateForm(this.dotPersonalityQuizs);
    }

  }

  nextState(): void {
    this.currentQuiz++;
    this.isSkip = true;
    this.cd.detectChanges();
    this.optionsBulk = [];
    this.editForm.reset();
    this.enableTextBox = false;
    const arr = this.dotPersonalityQuizsdata;
    this.shallowStorage.push(this.dotPersonalityQuizsdata[this.currentQuiz]);
    //arr.splice(0, 1);
    if (this.currentQuiz === this.dotPersonalityQuizsdata.length) {
      if (this.showTypeOfForm === 'ONBOARDING') {
        this.router.navigate(['main-route/user/userDetails']);
      } else if (this.showPersonQuiz === 'personQuiz') {
        this.enableQuizCard = 'quizCard';
        this.toastrService.info('Quiz Completed !');
      } else {
        this.router.navigate(['main-route/skill/detail']);
      }
    }
    this.dotPersonalityQuizs = this.dotPersonalityQuizsdata[this.currentQuiz];
    this.quiz_id = this.dotPersonalityQuizs.quizId ? this.dotPersonalityQuizs.quizId : this.dotPersonalityQuizs.quiz_id;
    this.updateForm(this.dotPersonalityQuizs);
  }

  save(): any {
    const { others } = this.editForm.value;
    this.isLoading = true;
    if (!this.optionsBulk.length) {
      this.toastrService.warning('Please select answers');
      this.isLoading = false;
      return false;
    }
    if (this.preferredOthers && others === '') {
      this.toastrService.warning('Please Specify answer');
      this.isLoading = false;
      return false;
    } else {
      this.isSaving = true;
      const selectedOptions = [];
      this.optionsBulk.forEach(res => {
        selectedOptions.push({option: res});
      });
      const requestPayload ={
        quiz: this.quiz_id,
        selected_options: [...selectedOptions]
      }
      this.subscribeToSaveResponse(this.dotPersonalityQuizService.create(requestPayload));
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

  protected onSuccess(data: any[] | null, headers: HttpHeaders): void {
    this.isLoading = false;
    this.dotPersonalityQuizsdata = data.filter(res => res.type === 'personality');
    this.currentQuiz = this.from === 'talents' ?  this.dotPersonalityQuizsdata.length - 1 : 0;
    this.dotPersonalityQuizs = this.dotPersonalityQuizsdata[this.currentQuiz] || [];
    this.quiz_id = this.dotPersonalityQuizs.quizId;
    this.updateForm(this.dotPersonalityQuizs);
    this.isLoaded = true;
    //  this.getQuizRetreive(2);
    //  this.ngbPaginationPage = this.page;
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
    this.toastrService.success(`Call Failed`);
  }

  goToQuiz() {
    this.getFromQuiz('personality');
    this.enableQuizCard = 'quiz';
  }

  skipTo(showTypeOfForm): void {
    this.currentQuiz++;
    if (this.currentQuiz === this.dotPersonalityQuizsdata.length) {
      if (this.showTypeOfForm === 'ONBOARDING') {
        this.router.navigate(['main-route/user/userDetails']);
      } else if (this.showPersonQuiz === 'personQuiz') {
        this.enableQuizCard = 'quizCard';
        this.toastrService.info('Quiz Completed !');
      } else {
        this.router.navigate(['main-route/skill/detail']);
      }
    }
    this.dotPersonalityQuizs = this.dotPersonalityQuizsdata[this.currentQuiz];
    this.quiz_id = this.dotPersonalityQuizs.quizId ? this.dotPersonalityQuizs.quizId : this.dotPersonalityQuizs.quiz_id;
    this.updateForm(this.dotPersonalityQuizs);
  }

  setActive(option) {
    this.active = option;
  }

  onClickOption(e) {
    this.selectedOption = e.target.innerHTML;
    console.log('click', this.selectedOption);
  }

  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }

  /* Hooks starts here */
  onFocusOutquizDescriptionField(event: any): void {
    console.log('quizDescription');
    // this.hooksUtilityService.dotPersonalityQuizonFocusOutquizDescriptionField(event);
  }
  onFocusOutquizFilePathField(event: any): void {
    console.log('quizFilePath');
    // this.hooksUtilityService.dotPersonalityQuizonFocusOutquizFilePathField(event);
  }
  onFocusOutquizOrderField(event: any): void {
    console.log('quizOrder');
    // this.hooksUtilityService.dotPersonalityQuizonFocusOutquizOrderField(event);
  }
  onChangequizStatusField(event: any): void {
    console.log('quizStatus');
    // this.hooksUtilityService.dotPersonalityQuizonChangequizStatusField(event);
  }
  onFocusOutoption1Field(event: any): void {
    console.log('option1');
    // this.hooksUtilityService.dotPersonalityQuizonFocusOutoption1Field(event);
  }
  onFocusOutoption2Field(event: any): void {
    console.log('option2');
    // this.hooksUtilityService.dotPersonalityQuizonFocusOutoption2Field(event);
  }
  onFocusOutoption3Field(event: any): void {
    console.log('option3');
    // this.hooksUtilityService.dotPersonalityQuizonFocusOutoption3Field(event);
  }
  onFocusOutoption4Field(event: any): void {
    console.log('option4');
    // this.hooksUtilityService.dotPersonalityQuizonFocusOutoption4Field(event);
  }
  onChangeisActiveField(event: any): void {
    console.log('isActive');
    // this.hooksUtilityService.dotPersonalityQuizonChangeisActiveField(event);
  }
  onFocusOutcreatedByField(event: any): void {
    console.log('createdBy');
    // this.hooksUtilityService.dotPersonalityQuizonFocusOutcreatedByField(event);
  }
  onChangecreatedDateField(event: any): void {
    console.log('createdDate');
    // this.hooksUtilityService.dotPersonalityQuizonChangecreatedDateField(event);
  }
  onFocusOutlastmodifiedByField(event: any): void {
    console.log('lastmodifiedBy');
    // this.hooksUtilityService.dotPersonalityQuizonFocusOutlastmodifiedByField(event);
  }
  onChangelastmodifiedDateField(event: any): void {
    console.log('lastmodifiedDate');
    // this.hooksUtilityService.dotPersonalityQuizonChangelastmodifiedDateField(event);
  }

  // function call when user clicks on cancel button
  cancelFormHook() {
    // this.hooksUtilityService.dotPersonalityQuizcancelHook();
  }

  // function call when user clicks on save button
  submitFormHook() {
    console.log('clicked on submit button');
    // this.hooksUtilityService.dotPersonalityQuizsubmitHook();
  }

  /* End Hooks */
}
