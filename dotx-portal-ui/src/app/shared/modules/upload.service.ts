import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(
    private httpClient: HttpClient
  ) { }

  uploadDocument(file, fileType: string = 'avatar'): Observable<any> {
    const uploadResourceUrl = `${environment.baseURL}/dot-files/upload`;
    const formData = new FormData();
    file.forEach(element => {
      formData.append('file', element);
    });
    formData.append('type', fileType);
    return this.httpClient.post(uploadResourceUrl, formData)
      .pipe(catchError(err => throwError(err)));
  }

  uploadDailyDot(file): Observable<any> {
    const uploadResourceUrl = `${environment.baseURL}/dot-admin-daily-dot-records/import`;
    const formData = new FormData();
    file.forEach(element => {
      formData.append('file', element);
    });
    return this.httpClient.post(uploadResourceUrl, formData)
      .pipe(catchError(err => throwError(err)));
  }

  uploadDotCoinBadge(file): Observable<any> {
    const uploadResourceUrl = `${environment.baseURL}/dot-files/upload`;
    const formData = new FormData();
    formData.append('type', 'reward_badge');
    file.forEach(element => {
      formData.append('file', element);
    });
    return this.httpClient.post(uploadResourceUrl, formData)
      .pipe(catchError(err => throwError(err)));
  }

  validImageUrl(url: string): boolean {
    if (!url) { return false }
    return (url.indexOf('http://') === 0 || url.indexOf('https://') === 0);
  }

  getFileName(filename: string): string {
    return (this.validImageUrl(filename)) ? filename : `${environment.fileLocation}${filename}`;
  }
}
