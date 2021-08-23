import { Component, Input, OnInit } from '@angular/core';
import { StudentHelperService } from '../student-helper.service';

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
  constructor(private studentService: StudentHelperService) { }

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
        this.buildOptions(this.currentIndex);
      }
    },
    () => this.isLoading = false)
  }

  buildOptions(index: number): void {
    if (this.currentIndex <= this.personalityQuizData.length) {
      this.options = [];
      const currentQuizDataOptions = this.personalityQuizData[index].options;
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
      
    }
    
  }
  save(): void {
    const selectedOptions = [];
    this.options.forEach(option => {
      if (option.selected) {
        selectedOptions.push({option: option.option});
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
}
