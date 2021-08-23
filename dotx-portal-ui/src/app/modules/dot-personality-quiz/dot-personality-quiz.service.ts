import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_FORMAT } from 'src/app/shared/constants/input.constants';
import { createRequestOption } from 'src/app/shared/util/request-util';
import { IDotPersonalityQuiz } from 'src/app/shared/model/dot-personality-quiz.model';
import { ConfigService } from 'src/app/shared/config.service';
import * as _ from 'lodash';
import { environment } from '../../../environments/environment';
import { CONTENT_TYPE } from 'src/app/shared/constant';
import { CommonApiService } from 'src/app/shared/services/common-api.service';

type EntityResponseType = HttpResponse<IDotPersonalityQuiz>;
type EntityArrayResponseType = HttpResponse<IDotPersonalityQuiz[]>;


@Injectable({ providedIn: 'root' })
export class DotPersonalityQuizService {
  public resourceUrl = '';
  public postResourceUrl = '';
  public getResource = '';

  constructor(protected http: HttpClient, private commonApiService: CommonApiService, private config: ConfigService) {
    this.resourceUrl = `${environment.baseURL}/dot-personality-quiz`;
    this.postResourceUrl = `${environment.baseURL}/dot-std-per-quiz-details`;
    this.getResource = `${environment.baseURL}/dot-std-per-quiz-details/student_quiz_details`;
  }



  /* update(dotPersonalityQuiz): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(dotPersonalityQuiz);
    return this.http
      .put<IDotPersonalityQuiz>(this.postResourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IDotPersonalityQuiz>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IDotPersonalityQuiz[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  } */


  /* working */
  create(dotPersonalityQuiz): Observable<any> {
    const copy = this.convertDateFromClient(dotPersonalityQuiz);
    return this.http
      .post<IDotPersonalityQuiz>(this.postResourceUrl, dotPersonalityQuiz, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }
  filter(): Observable<EntityArrayResponseType> {
    return this.http
      .get<any>(`${this.getResource}`, { observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  filterOnBoarding(filterColumns: any): Observable<EntityArrayResponseType> {
    return this.http
      .post<any>(`${this.resourceUrl}/filter`, filterColumns, { observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }
  quizRetrival(userId: any): Observable<EntityArrayResponseType> {
    return this.http
      .post<any>(`${this.postResourceUrl}/filter`, userId, { observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  protected convertDateFromClient(dotPersonalityQuiz: IDotPersonalityQuiz): IDotPersonalityQuiz {
    const copy: IDotPersonalityQuiz = Object.assign({}, dotPersonalityQuiz, {
      createdDate:
        dotPersonalityQuiz.createdDate && dotPersonalityQuiz.createdDate.isValid()
          ? dotPersonalityQuiz.createdDate.format(DATE_FORMAT)
          : undefined,
      lastmodifiedDate:
        dotPersonalityQuiz.lastmodifiedDate && dotPersonalityQuiz.lastmodifiedDate.isValid()
          ? dotPersonalityQuiz.lastmodifiedDate.format(DATE_FORMAT)
          : undefined,
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      const bodyData = this.camelizeKeys(res.body);
      bodyData.createdDate = bodyData.createdDate ? moment(bodyData.createdDate) : undefined;
      bodyData.lastmodifiedDate = bodyData.lastmodifiedDate ? moment(bodyData.lastmodifiedDate) : undefined;
      return res.clone({
        body: bodyData,
      });
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      const bodyData = this.camelizeKeys(res.body);
      bodyData.forEach((dotPersonalityQuiz: IDotPersonalityQuiz) => {
        dotPersonalityQuiz.createdDate = dotPersonalityQuiz.createdDate ? moment(dotPersonalityQuiz.createdDate) : undefined;
        dotPersonalityQuiz.lastmodifiedDate = dotPersonalityQuiz.lastmodifiedDate ? moment(dotPersonalityQuiz.lastmodifiedDate) : undefined;
      });
      return res.clone({
        body: bodyData,
      });
    }
    return res;
  }

  /* getTokenHeaders(): HttpHeaders {
   return new HttpHeaders()
     .set('Authorization', 'bearer ' + 'IkoZBlx2Mmlk0MgQMaEThR65n2VYpNXQbq8MFGmR3E')
     .set('Content-Type', CONTENT_TYPE.APPLICATION_JSON);
 }
 */



  camelizeKeys(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(v => this.camelizeKeys(v));
    } else if (obj !== null && typeof obj === 'object') {
      return Object.keys(obj).reduce(
        (result, key) => ({
          ...result,
          [_.camelCase(key)]: this.camelizeKeys(obj[key]),
        }),
        {}
      );
    }
    return obj;
  }
}
