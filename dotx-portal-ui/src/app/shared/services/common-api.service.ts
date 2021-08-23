import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AUTHORIZED_GRANT_TYPES, CONTENT_TYPE } from '../constant';
import {UploadService} from '../modules/upload.service';
import * as moment from 'moment';
import { Store } from '@ngrx/store';
import { AuthState } from 'src/app/store/auth.model';
import { userInfo } from 'src/app/store/auth.selector';

@Injectable({
  providedIn: 'root'
})
export class CommonApiService {
  st_details: any;
  constructor(
      private uploadService: UploadService,
      private store: Store<AuthState>
  ) {
    this.store.select(userInfo).subscribe(res => {
      if (res) {
        this.st_details = res;
      }
    });

  }

  getHeaders(): HttpHeaders {
    return new HttpHeaders()
      .set('Authorization', 'Basic ' + environment.oAuthHeader)
      .set('Content-Type', CONTENT_TYPE.APPLICATION_URL_ENCODED);
  }

  getFileHeaders(): HttpHeaders {
    return new HttpHeaders().set('Accept', 'multipart/form-data');
  }

  // getTokenHeaders(): HttpHeaders {
  //   return new HttpHeaders()
  //     .set('Authorization', 'bearer ' + sessionStorage.getItem('access_token'))
  //     .set('Content-Type', CONTENT_TYPE.APPLICATION_JSON);
  // }

  getLoggedInUserDetails() {
    let imageUrl;
    if (this.st_details && this.st_details.avatar_image_file) {
      imageUrl = this.uploadService.getFileName(this.st_details.avatar_image_file);
    }

    return {...userInfo, profilePicUrl: imageUrl};
  }

  getDateDifference(date1, date2, type: string) {
    // @ts-ignore
    // const diffInMillis: number = new Date(date2) - new Date(date1);
    //
    if (type === 'days') {
      const given = moment(date2).startOf('day');
      const current = moment().startOf('day');
      return given.diff(current, type);
    }
  }
}
