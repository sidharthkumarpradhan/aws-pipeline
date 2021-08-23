import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {StudentOnboardingService} from '../student-onboarding.service';

@Component({
  selector: 'app-about-dotx',
  templateUrl: './about-dotx.component.html',
  styleUrls: ['./about-dotx.component.scss']
})
export class AboutDotxComponent implements OnInit {
  onboardQuizResp: any[] = [];
  isLoading = false;
  currentPage = 0;
  quiz: any;

  constructor(private studentOnboardService: StudentOnboardingService,
              private toastr: ToastrService,
              private router: Router) {

  }

  ngOnInit() {
    this.getOnBoardingQuiz();
  }

  skipTo(): void {
    this.router.navigate(['/main-route/student-onboard/user-info']);
  }

  getOnBoardingQuiz(): void {
    this.isLoading = true;
    this.studentOnboardService.getStudentPersonalityQuiz().subscribe(res => {
      this.isLoading = false;
      if (res && res.length) {
        const onBoardingQuiz = res.filter(q => q.type === 'onboarding');
        this.onboardQuizResp = onBoardingQuiz && onBoardingQuiz.length ? onBoardingQuiz : [];
        this.buildOptions(this.currentPage);
      }
    }, () => {
      this.isLoading = false;
      this.toastr.error('Error While Fetching Quiz Quetionary')
    });
  }

  selectOption(option: string): void {
    this.quiz.options.forEach(res => {
       if (res.option === option) {
        res['selected'] = true;
       } else {
        res['selected'] = false;
       }
    })

  }
  save(): void {
    const selectedOptions = [];
    this.quiz.options.forEach(option => {
      if (option.selected) {
        selectedOptions.push({option: option.option});
      }
    })
    const requestPayload = {
      quiz: this.quiz.quiz_id,
      selected_options: selectedOptions
    }
    this.isLoading = true;
    this.studentOnboardService.savePersonalizeQuizDetails(requestPayload).subscribe(() => {
      this.isLoading = false;
      this.buildOptions(++this.currentPage);
    }, () => this.isLoading = false)
  }

  buildOptions(index: number): void {
    if (this.currentPage < this.onboardQuizResp.length) {
      this.quiz = this.onboardQuizResp[this.currentPage];
      this.quiz.options.forEach(q => {
        q['selected'] = false;
        if(this.quiz.quiz_response && this.quiz.quiz_response.length) {
           if (this.quiz.quiz_response[0].response === q.option) {
             q['selected'] = true;
           }
        }
      });

    } else {
      this.router.navigateByUrl('main-route/student-onboard/user-info');
    }

  }

  backTo() {
    this.router.navigate(['/auth/set-password']);
  }
}
