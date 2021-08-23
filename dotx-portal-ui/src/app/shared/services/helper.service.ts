import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import * as _ from 'lodash';
import {AbstractControl} from '@angular/forms';
import {environment} from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  public resourceUrl = '';
  public isLoading = new BehaviorSubject(false);
  searchData: any;

  constructor(private httpClient: HttpClient) {

  }

  public uploadDocument(file: File, entityName: string): Observable<any> {
    const extUrl = `${this.resourceUrl}${entityName}/import`;
    const formData = new FormData();
    formData.append('file', file);
    return this.httpClient.post(extUrl, formData, { observe: 'response' }).pipe(catchError(err => throwError(err)));
  }
  public camelToSnakeCase(obj: any) {
    if (Array.isArray(obj)) {
      return obj.map(v => this.camelToSnakeCase(v));
    } else if (obj !== null && typeof obj === 'object') {
      return Object.keys(obj).reduce(
        (result, key) => ({
          ...result,
          [_.snakeCase(key)]: this.camelToSnakeCase(obj[key]),
        }),
        {}
      );
    }
    return obj;
  }
  public snakeToCamel(obj: any) {
    return _.mapKeys(obj, _.rearg(_.camelCase, 1));
  }

  isValidField(control: AbstractControl) {
    return control && control.touched && control.errors;
  }

  getFormattedDateToBind({ day, month, year }) {
    month = month.toString().length > 1 ? month : '0' + month;
    day = day.toString().length > 1 ? day : '0' + day;
    return `${year}-${month}-${day}`;
  }

  getFormattedDateToPrefill(dob) {
    const date = new Date(dob);
    return {
      day: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear()
    }
  }

  getFormattedDateForAdminChall(dob) {
    const date = new Date(dob);
    return {
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear()
    }
  }

  getTodaysFormattedDate() {
    const current = new Date();
    let currentMonth = current.getMonth() + 1;
    let totalMonths = 12 - currentMonth;
    console.log(currentMonth, totalMonths)
    return {
      year: current.getFullYear() - 10,
      month: currentMonth + totalMonths,
      day: current.getDate()
    };
  }

  getUserQuizResponse(): Observable<any> {
    const url = environment.baseURL;
    const extraUrl = `/dot-std-per-quiz-details/student_quiz_details`;
    return this.httpClient.get(url + extraUrl);
  }

  getOnlyImageFromChallenges(challenges: any[]): any[] {
    challenges.forEach((v, i) => {
      const imageList = v.attachments.flatMap(s => s.type === 'challenge_image' ? s.file : []);
      v['challenge_image'] = imageList && imageList.length ? imageList[0] : null;
    });
    return challenges;
  }

  getImageOrVideoFromChallenges(challenges: any[]): any[] {
    challenges.forEach(v => {
      const imageList = v.attachments.flatMap(s => s.type === 'challenge_image' ? s.file : []);
      const videoList = v.attachments.flatMap(s => s.type === 'challenge_video' ? s.file : []);
      v['filtered_attachments'] = videoList && videoList.length ? [{file: videoList[0], type: 'video'}] : imageList && imageList.length ? [{file: imageList[0], type: 'image'}] : [];
    });
    return challenges;
  }

  getUserDetails(userId: any): Observable<any> {
    return this.httpClient.get(`${environment.baseURL}/dot-user-details/${userId}`);
  }

  updateUserProfile(payload: any): Observable<any> {
    return this.httpClient.put(`${environment.baseURL}/dot-user-details`, payload);
  }
}
