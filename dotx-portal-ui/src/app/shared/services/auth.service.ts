import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpBackend, HttpHeaders, HttpParams } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { AuthState } from 'src/app/store/auth.model';
import { refreshToken } from 'src/app/store/auth.selector';
import { LoginDetails } from 'src/app/store/auth.action';
import { AUTHORIZED_GRANT_TYPES, CONTENT_TYPE } from '../constant';
import { environment } from 'src/environments/environment';
import { CommonApiService } from './common-api.service';
@Injectable({
  providedIn: 'root'
})
export class AuthorizeService {
  refreshToken: string;
  constructor(private httpBackend: HttpClient,
    private handler: HttpBackend,
    private httpclient: HttpClient,
    private commonApiService: CommonApiService,
    private store: Store<AuthState>) {
    this.httpBackend = new HttpClient(this.handler);

  }


  loginOAuthToken(userData): Observable<any> {
    let headers;
    headers = this.commonApiService.getHeaders();
    let body = new HttpParams();
    body = body.set('username', userData.username);
    body = body.set('password', userData.password);
    body = body.set('grant_type', 'password');
    const authUrl = `${environment.baseURL}/user/oauth/token`;
    // tslint:disable-next-line:object-literal-shorthand
    return this.httpBackend.post(authUrl, body, { headers: headers, observe: 'response' });
  }

  signUp(userData): Observable<any> {
    let body = new HttpParams();
    let headers;
    headers = this.commonApiService.getHeaders();
    //  const authUrl = `${environment.userDataIP}:${environment.googleUserDataPort}/sign_up`;
    const authUrl = environment.signUp;
    console.log('====', userData)
    // tslint:disable-next-line:object-literal-shorthand
    return this.httpBackend.post(authUrl, userData, { headers: headers, observe: 'response' });

  }

  signinWithGoogle(userData): Observable<any> {
    let body = new HttpParams();
    let headers;
    headers = this.commonApiService.getHeaders();
    // const authUrl = `${environment.userDataIP}/${environment.googleUserDataPort}/google_auth`;
    const authUrl = environment.signWithGoogle;
    // tslint:disable-next-line:object-literal-shorthand
    return this.httpBackend.post(authUrl, userData, { headers: headers, observe: 'response' });

  }

  resetPassword(userData): Observable<any> {
    let body = new HttpParams();
    const authUrl = `${environment.baseURL}/dot-user-details/reset_password`;
    // tslint:disable-next-line:object-literal-shorthand
    return this.httpclient.post(authUrl, userData, { observe: 'response' });

  }

  forgotPassword(userData): Observable<any> {
    let body = new HttpParams();
    const authUrl = `${environment.baseURL}/dot-user-details/forgot_password`;
    // tslint:disable-next-line:object-literal-shorthand
    return this.httpclient.post(authUrl, userData, { observe: 'response' });

  }


  create(userData): Observable<any> {
    let body = new HttpParams();
    const authUrl = `${environment.baseURL}/dot-user-details`;
    // tslint:disable-next-line:object-literal-shorthand
    return this.httpclient.put(authUrl, userData, { observe: 'response' });

  }


  loginWithJoincode(userData): Observable<any> {
    let body = new HttpParams();
    let headers;
    headers = this.commonApiService.getHeaders();
    console.log('base url---- ', environment.userDataIP, environment);
    const authUrl = environment.joinAuthJoinCode;
    console.log('authUrl joincode', authUrl, headers, userData);
    // tslint:disable-next-line:object-literal-shorthand
    return this.httpBackend.post(authUrl, userData, { headers: headers, observe: 'response' });

  }

  getUserProfile(userId): Observable<any> {
    // console.log('hello world');
    let body = new HttpParams();
    console.log(sessionStorage.getItem('access_token'))
    const authUrl = `${environment.baseURL}/dot-user-details/${userId}`;
    // tslint:disable-next-line:object-literal-shorthand
    return this.httpclient.get(authUrl);

  }

  getUserIdData(): Observable<any> {
    let body = new HttpParams();
    const authUrl = `${environment.baseURL}/dot-user-details/info`;
    // tslint:disable-next-line:object-literal-shorthand
    return this.httpclient.get(authUrl);

  }

  createUser(payload): Observable<any> {

    const authUrl = `${environment.baseURL}/dot-user-details/create_login`;
    // tslint:disable-next-line:object-literal-shorthand
    return this.httpclient.post(authUrl, payload);

  }

  getRefreshToken(): Observable<any> {
    this.store.select(refreshToken).pipe().subscribe(res => {
      if (res) {
        this.refreshToken = res;
      }
    });
    let body = new HttpParams();
    body = body.set('grant_type', AUTHORIZED_GRANT_TYPES.REFRESH_TOKEN);
    body = body.set(AUTHORIZED_GRANT_TYPES.REFRESH_TOKEN, this.refreshToken);
    const authUrl = `${environment.baseURL}/user/oauth/token`;
    return this.httpclient.post(authUrl, body, {});
  }

  fetchMenu(): Observable<any> {
    const authUrl = `${environment.userDataIP}/v1/user-role/userMenu`;
    return this.httpclient.get(authUrl);
  }
}
