import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentOnboardingService {

  constructor(private httpClient: HttpClient) { }

  getStudentPersonalityQuiz(): Observable<any> {
    return this.httpClient.get(`${environment.baseURL}/dot-std-per-quiz-details/student_quiz_details`);
  }

  savePersonalizeQuizDetails(payload): Observable<any> {
    return this.httpClient.post(`${environment.baseURL}/dot-std-per-quiz-details`, payload);
  }

  updateAboutMe(requestPayLoad: any) {
    //  const copy = this.convertDateFromClient(dotUserSkills);
    return this.httpClient.put(`${environment.baseURL}/dot-user-details`, requestPayLoad);
  }
}
