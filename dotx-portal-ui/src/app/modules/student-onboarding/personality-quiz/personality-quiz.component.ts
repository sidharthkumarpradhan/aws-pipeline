import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentHelperService } from '../../student-dashboard/student-helper.service';

@Component({
  selector: 'app-personality-quiz',
  templateUrl: './personality-quiz.component.html',
  styleUrls: ['./personality-quiz.component.scss']
})
export class PersonalityQuizComponent implements OnInit {

  personalityQuizData: any[] = [];
  isLoading = false;
  options: any[] = [];
  currentIndex = 0;
  enableTextBox = false;
  quizDescription = '';
  page: any;
  quizIcon = 'assets/img/q1.png';
  constructor(private studentService: StudentHelperService,
    private router: Router,
    private route: ActivatedRoute) {
      this.route.params.subscribe( params => this.page = params.page );
     }

  ngOnInit() {
    this.getPersonalityQuizData();
  }
  getPersonalityQuizData(): void {
    this.isLoading = true;
    this.options = [];
    this.currentIndex = 0;
    this.studentService.getStudentPersonalityQuiz().subscribe(quizData => {
      this.isLoading = false;
      if (quizData && quizData.length) {
        this.personalityQuizData = quizData.filter(data => data.type === 'personality');
        this.currentIndex = this.page === 'talents' ? this.personalityQuizData.length - 1 : 0;
        this.buildOptions(this.currentIndex);
      }
    },
    () => this.isLoading = false)
  }

  buildOptions(index: number): void {
    if (this.currentIndex < this.personalityQuizData.length) {
      this.options = [];
      const currentQuizDataOptions = this.personalityQuizData[index].options;
      this.quizDescription = this.personalityQuizData[index].quiz_description;
      this.quizIcon = this.personalityQuizData[index].quiz_icon_file_path ? this.personalityQuizData[index].quiz_icon_file_path : this.quizIcon;
      if (currentQuizDataOptions && currentQuizDataOptions.length) {
        currentQuizDataOptions.forEach(quiz => {
           const quizResponse = this.personalityQuizData[index].quiz_response;
           let isSeclected = false;
           if (quizResponse && quizResponse.length && quizResponse.find(qResp => qResp.response === quiz.option)) {
            isSeclected = true;
           }
           this.options.push({option: quiz.option, selected: isSeclected})
        })
      }
      
    } else {
      this.router.navigateByUrl('main-route/student-onboard/skill/Talents')
    }
    
  }
  save(): void {
    const selectedOptions = [];
    this.personalityQuizData[this.currentIndex].quiz_response = [];
    this.options.forEach(option => {
      if (option.selected) {
        selectedOptions.push({option: option.option});
        this.personalityQuizData[this.currentIndex].quiz_response.push({response: option.option});
      }
    })
    const requestPayload = {
      quiz: this.personalityQuizData[this.currentIndex].quiz_id,
      selected_options: selectedOptions
    }
    this.isLoading = true;
    this.studentService.savePersonalizeQuizDetails(requestPayload).subscribe(() => {
      this.isLoading = false;
      this.buildOptions(++this.currentIndex);
    }, () => this.isLoading = false)
  }

  backTo() {
    if (this.currentIndex === 0) {
        this.router.navigateByUrl('main-route/student-onboard/avatar')
    } else {
      this.buildOptions(--this.currentIndex)
    }
  }
  skipTo(): void {
    this.currentIndex++;
    if (this.currentIndex === this.personalityQuizData.length) {
       this.router.navigateByUrl('main-route/student-onboard/skill/Talents')
    } else {
      this.buildOptions(this.currentIndex);
    }
  }
}
