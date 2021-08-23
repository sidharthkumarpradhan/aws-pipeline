import { ToastrService } from 'ngx-toastr';
import { StudentHelperService } from './../../student-dashboard/student-helper.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { DATE_TIME_LOCAL } from 'src/app/shared/constants/input.constants';
import { FormBuilder } from '@angular/forms';
import { AuthState } from 'src/app/store/auth.model';
import { Store } from '@ngrx/store';
import { userInfo, userResponse } from 'src/app/store/auth.selector';

export interface StudentOptions {
  user: string,
  quiz: Number,
  quiz_status: string,
  quiz_start_date: string,
  quiz_completion_date: string,
  quiz_response: string
}

@Component({
  selector: 'app-quiz-attempt',
  templateUrl: './quiz-attempt.component.html',
  styleUrls: ['./quiz-attempt.component.css']
})
export class QuizAttemptComponent implements OnInit {
  showQuizCard: boolean;

  formContent: any;
  activeStepIndex: number = 0;
  stepItems: number;
  userId: string;
  quizList: any[];
  isSubmit: boolean;
  active = '';
  selectedOption: any;
  currentDate = moment().format(DATE_TIME_LOCAL);
  options: any;
  quiz_id: any;
  optionsBulk: StudentOptions[] = [];
  shallowStorage: Array<object> = [];
  enableTextBox: Boolean = false;
  preferredOthers: Boolean = false;

  quizForm = this.fb.group({
    others: [''],
  });

  constructor(
    private studentHelperService: StudentHelperService,
    private cd: ChangeDetectorRef, private fb: FormBuilder,
    private toastrService: ToastrService,
    private store: Store<AuthState>
  ) {

  }

  ngOnInit(): void {
    this.store.select(userResponse).subscribe(res => {
      if (res) {
        this.userId = res.id;
      }
    });
    this.activeStepIndex = 0;
    this.showQuizCard = true;
    this.getAttemptedQuizList();
  }

  getAttemptedQuizList() {
    this.studentHelperService.getStudentPersonalityQuiz().subscribe((res) => {
      if (res) {
        this.formContent = res;
        this.stepItems = res.length;
        this.setOptionChecked(0);
        this.cd.markForCheck();
      }
    });
  }
  setOptionChecked(index: number = 0) {
    // if (this.formContent && this.formContent[index].quiz_response) {
    //   this.setActive(this.formContent[index].quiz_response);
    // }

    this.options = this.formContent[0].options || [];
    this.quiz_id = this.formContent[0].quiz_id;
    const optionRes = this.extractOptions(this.formContent[0].quiz_response);
    this.setOptions(optionRes);
  }
  goToQuiz() {
    this.getAttemptedQuizList();
    this.showQuizCard = true;
    this.activeStepIndex = 0;
  }

  goToStep(step: string): any {
    // if (step === 'next' && this.activeStepIndex === this.stepItems - 1) {
    //   this.showQuizCard = false;
    //   return false;
    // }
    // this.active = '';
    // this.activeStepIndex =
    //   step === 'prev' ? this.activeStepIndex - 1 : this.activeStepIndex + 1;
    this.nextState();
    this.viewCheck();
  }

  setActive(option) {
    this.active = option;
  }

  updateForm(dotPersonalityQuiz): void {
    this.options = dotPersonalityQuiz.options;
    const optionRes = this.extractOptions(dotPersonalityQuiz.quiz_response);
    this.setOptions(optionRes);
  }

  backTo() {
    this.enableTextBox = false;
    this.quizForm.reset();
    this.shallowStorage.reverse();
    this.options = this.formContent[0].options;
    // this.active = this.selectedOption;
    this.quiz_id = this.formContent.quizId;
    this.updateForm(this.options);
    this.shallowStorage.splice(0, 1);

  }

  nextState(): void {
    this.optionsBulk = [];
    this.quizForm.reset();
    let arr = this.formContent;
    this.shallowStorage.push(this.formContent[0]);
    arr.splice(0, 1);
    if (arr.length > 0) {
      const quiz = this.formContent[0] || [];
      this.quiz_id = this.formContent[0].quiz_id;
      this.updateForm(quiz);
    } else {
      this.showQuizCard = false;
    }
    this.cd.detectChanges();
  }

  speicfyOthers() {
    let { others } = this.quizForm.value;
    this.optionsBulk.forEach(ele => {
      if (ele.quiz_response == 'Others') {
        ele.quiz_response = others
      }
    });
    console.log('bulk', this.optionsBulk)
  }

  addNewOption(option) {
    return {
      user: this.userId,
      quiz: this.quiz_id,
      quiz_status: "1",
      quiz_start_date: "2021-04-15 21:09",
      quiz_completion_date: "2021-04-15 21:09",
      quiz_response: option
    };
  }

  extractOptions(arr) {
    const extractedValue = arr.map(item => item);
    return extractedValue;
  }

  checkItem(option, optionIndex, event) {
    const skillCheck = event.srcElement.checked;
    if (option === 'Others' && skillCheck) {
      this.enableTextBox = true;
      this.preferredOthers = true;
    } else if (!skillCheck && option === 'Others') {
      this.enableTextBox = false;
      this.preferredOthers = false;
    }
    if (skillCheck) {
      this.optionsBulk.push(this.addNewOption(option));
    } else if (this.optionsBulk.length) {
      this.optionsBulk = this.optionsBulk.filter(item => item.quiz_response !== option);
    }
    console.log('optionBulk', this.optionsBulk)
  }

  setOptions(optionsRes) {
    this.options.forEach((element) => {
      let isChecked = false;
      const filterData = optionsRes.findIndex((item) => item.response === element.option) > -1;
      const othersData = optionsRes.filter((item) => item.response !== element.option);
      if (optionsRes && optionsRes.length && filterData) {
        isChecked = true;
        //   const skillFile = this.findMySkillFile(element);
        this.optionsBulk.push(this.addNewOption(element.option));
        element['selected'] = isChecked;
        // this.skillsList[index].skill_file = skillFile;
      }
      if (othersData.length > 0) {
        isChecked = true;
        this.enableTextBox = true;
        //   const skillFile = this.findMySkillFile(element);
        this.optionsBulk.push(this.addNewOption('Others'));
        if (element.option === 'Others') {
          element['selected'] = isChecked;
        }
        this.quizForm.patchValue({
          others: othersData[0].response
        })
      }

      this.cd.detectChanges();
    });
    console.log('res options', this.optionsBulk);
  }

  /* onClickOption(e) {
    this.selectedOption = e.target.innerHTML;
    console.log('click', this.selectedOption);
  } */

  save(index: number): any {
    const { others } = this.quizForm.value;
    if (!this.optionsBulk.length) {
      this.toastrService.warning('Please select answers');
      //this.isLoading = false;
      return false;
    }
    if (this.preferredOthers && others == '') {
      this.toastrService.warning('Please Specify answer');
      // this.isLoading = false;
      return false;
    }
    else {
      this.isSubmit = true;
      // const body = {
      //   user: this.userId,
      //   quiz: this.formContent[index].quiz_id,
      //   quiz_status: (this.formContent[index].quiz_status),
      //   quiz_start_date: this.currentDate,
      //   quiz_completion_date: this.currentDate,
      //   quiz_response: this.formContent[index]['quiz_response']
      // };
      console.log(this.optionsBulk);
      this.studentHelperService.savePersonalizeQuizDetails(this.optionsBulk).subscribe(res => {
        this.toastrService.success(`Your answer submitted successfully`);
        this.nextState();
        this.viewCheck();
      }, err => this.viewCheck());
    }
  }

  viewCheck() {
    this.isSubmit = false;
    this.cd.markForCheck();
  }

  trackByFn(index: number): number {
    return index;
  }

}
