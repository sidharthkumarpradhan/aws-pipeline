import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpBackend } from '@angular/common/http';

let endpoints;

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  changeStatus = new BehaviorSubject<boolean>(false);
  changeStatus$ = this.changeStatus.asObservable();
  appConfig: any;
  http: HttpClient;
  constructor(private httpBackend: HttpBackend) {
    this.http = new HttpClient(httpBackend);
  }

  setStatus(changeStaus: any): void {
    this.changeStatus.next(changeStaus);
  }

  loadConfig(): any {
    return this.http.get('assets/app-config.json').pipe(
      tap(res => {
        if (res) {
          this.appConfig = this.getEnvironmentData(res);
          this.setStatus(true);
        }
      })
    ).toPromise();
  }
  getEnvironmentData(environment: any): any {
    endpoints = {
       tokenUrl: '/'
    };

    const resData = [endpoints, environment];
    return resData;
  }
}
