import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_FORMAT, DATE_TIME_FORMAT } from 'src/app/shared/constants/input.constants';
import { createRequestOption } from 'src/app/shared/util/request-util';
import { IDotUserDetails } from 'src/app/shared/model/dot-user-details.model';
import { ConfigService } from 'src/app/shared/config.service';
import * as _ from 'lodash';
import { environment } from '../../../environments/environment';

type EntityResponseType = HttpResponse<IDotUserDetails>;
type EntityArrayResponseType = HttpResponse<IDotUserDetails[]>;
// let environment;

@Injectable({ providedIn: 'root' })
export class DotUserDetailsService {
  public resourceUrl = '';

  constructor(protected http: HttpClient, private config: ConfigService) {

    this.resourceUrl = `${environment.baseURL}/dot-user-details`;
  }

  create(dotUserDetails): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(dotUserDetails);
    return this.http
      .post<IDotUserDetails>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(dotUserDetails): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(dotUserDetails);
    return this.http
      .put<IDotUserDetails>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IDotUserDetails>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IDotUserDetails[]>(this.resourceUrl, { params: options, observe: 'response' })
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

  protected convertDateFromClient(dotUserDetails: IDotUserDetails): IDotUserDetails {
    const copy: IDotUserDetails = Object.assign({}, dotUserDetails, {
      dateOfCreation:
        dotUserDetails.dateOfCreation && dotUserDetails.dateOfCreation.isValid()
          ? dotUserDetails.dateOfCreation.format(DATE_FORMAT)
          : undefined,
      dateOfExit:
        dotUserDetails.dateOfExit && dotUserDetails.dateOfExit.isValid() ? dotUserDetails.dateOfExit.format(DATE_FORMAT) : undefined,
      createdDate:
        dotUserDetails.createdDate && dotUserDetails.createdDate.isValid() ? dotUserDetails.createdDate.format(DATE_FORMAT) : undefined,
      lastmodifiedDate:
        dotUserDetails.lastmodifiedDate && dotUserDetails.lastmodifiedDate.isValid()
          ? dotUserDetails.lastmodifiedDate.format(DATE_FORMAT)
          : undefined,
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      const bodyData = this.camelizeKeys(res.body);
      bodyData.dateOfCreation = bodyData.dateOfCreation ? moment(bodyData.dateOfCreation) : undefined;
      bodyData.dateOfExit = bodyData.dateOfExit ? moment(bodyData.dateOfExit) : undefined;
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
      // bodyData.forEach((dotUserDetails: IDotUserDetails) => {
      bodyData.dateOfCreation = bodyData.dateOfCreation ? moment(bodyData.dateOfCreation) : undefined;
      bodyData.dateOfExit = bodyData.dateOfExit ? moment(bodyData.dateOfExit) : undefined;
      bodyData.createdDate = bodyData.createdDate ? moment(bodyData.createdDate) : undefined;
      bodyData.lastmodifiedDate = bodyData.lastmodifiedDate ? moment(bodyData.lastmodifiedDate) : undefined;
      // });
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
}
