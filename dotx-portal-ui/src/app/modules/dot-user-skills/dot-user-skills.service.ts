import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { catchError, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_FORMAT, DATE_TIME_FORMAT } from 'src/app/shared/constants/input.constants';
import { createRequestOption } from 'src/app/shared/util/request-util';
import { IDotUserSkills } from 'src/app/shared/model/dot-user-skills.model';
import { ConfigService } from 'src/app/shared/config.service';
import * as _ from 'lodash';
import { environment } from '../../../environments/environment';

type EntityResponseType = HttpResponse<IDotUserSkills>;
type EntityArrayResponseType = HttpResponse<IDotUserSkills[]>;


@Injectable({ providedIn: 'root' })
export class DotUserSkillsService {
  public resourceUrl = '';
  public skillResourceUrl = '';
  public bulkSkillResourceUrl = '';
  public uploadResourceUrl = '';
  public aboutMeResourceUrl = '';
  favouritesResourceUrl = '';
  bulkUpdateUrl = '';

  constructor(protected http: HttpClient, private config: ConfigService) {
    this.resourceUrl = `${environment.baseURL}/dot-user-skills`;
    this.skillResourceUrl = `${environment.baseURL}/dot-skill-details/`;
    this.uploadResourceUrl = `${environment.baseURL}/dot-user-details/file_upload`;
    this.bulkSkillResourceUrl = `${environment.baseURL}/dot-user-skills/bulk_add`;
    this.bulkUpdateUrl = `${environment.baseURL}/dot-user-skills/update`;
    this.aboutMeResourceUrl = `${environment.baseURL}/dot-user-details`;
  }

  create(dotUserSkills) {
    //  const copy = this.convertDateFromClient(dotUserSkills);
    return this.http
      .post(this.bulkSkillResourceUrl, dotUserSkills, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  updateAboutMe(requestPayLoad: any) {
    //  const copy = this.convertDateFromClient(dotUserSkills);
    return this.http.put(this.aboutMeResourceUrl, requestPayLoad);
  }

  update(dotUserSkills): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(dotUserSkills);
    return this.http
      .post<IDotUserSkills>(this.bulkUpdateUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IDotUserSkills>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(page: string, req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IDotUserSkills[]>(this.skillResourceUrl + page, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  filter(filterColumns: any): Observable<EntityArrayResponseType> {
    return this.http
      .post<any>(`${this.resourceUrl}/filter`, filterColumns, { observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  retrivalSkills(userId: any): Observable<EntityArrayResponseType> {
    return this.http
      .post<any>(`${this.resourceUrl}/filter`, userId, { observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  uploadLogo(payload): Observable<any> {
    // const payload = {file : companyLogo}
    /* let headers;
      headers = this.getFileHeaders(); */
    // return this.http.post(`${this.uploadResourceUrl}`, payload);
    return this.http
      .post(`${this.uploadResourceUrl}`, payload)
      .pipe(catchError(err => throwError(err)));
    //  return this.commonApiService.uploadImg('user/upload', payload);
  }

  protected convertDateFromClient(dotUserSkills: IDotUserSkills): IDotUserSkills {
    const copy: IDotUserSkills = Object.assign({}, dotUserSkills, {
      createdDate:
        dotUserSkills.createdDate && dotUserSkills.createdDate.isValid() ? dotUserSkills.createdDate.format(DATE_FORMAT) : undefined,
      lastmodifiedDate:
        dotUserSkills.lastmodifiedDate && dotUserSkills.lastmodifiedDate.isValid()
          ? dotUserSkills.lastmodifiedDate.format(DATE_FORMAT)
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
      bodyData.forEach((dotUserSkills: IDotUserSkills) => {
        dotUserSkills.createdDate = dotUserSkills.createdDate ? moment(dotUserSkills.createdDate) : undefined;
        dotUserSkills.lastmodifiedDate = dotUserSkills.lastmodifiedDate ? moment(dotUserSkills.lastmodifiedDate) : undefined;
      });
      return res.clone({
        body: bodyData,
      });
    }
    return res;
  }

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

  getFileHeaders(): HttpHeaders {
    return new HttpHeaders()
      //.set('Authorization', 'Basic ' + environment.oAuthHeader)
      //.set('Content-Type', CONTENT_TYPE.APPLICATION_URL_ENCODED);
      .set('Accept', "multipart/form-data");
  }
}

