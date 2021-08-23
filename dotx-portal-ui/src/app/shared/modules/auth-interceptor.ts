import { ERROR_MESSAGE } from './../constant';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Store } from '@ngrx/store';
import { AuthState } from 'src/app/store/auth.model';
import { Router } from '@angular/router';
import { AuthLogout } from 'src/app/store/auth.action';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { tap, catchError, finalize } from 'rxjs/operators';
import { get } from 'lodash';
import { HelperService } from '../services/helper.service';
import { HTTP_ERROR_MESSAGE } from '../constant';
import { accessToken } from 'src/app/store/auth.selector';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    accessToken: any;
    private requests: HttpRequest<any>[] = [];

    constructor(
                private toastr: ToastrService,
                private store: Store<AuthState>,
                private router: Router,
                private helperService: HelperService) {

    }
    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {

        if (!this.accessToken) {
            this.store.select(accessToken).subscribe((res) => (this.accessToken = res));
        }

        req = req.clone({ headers: req.headers.set('Authorization', 'bearer ' + this.accessToken)});
        if ((req.method === 'POST' || req.method === 'PUT') && this.checkUrl(req.url)) {
            req = req.clone({ headers: req.headers.set('Content-Type', 'application/json')});
            if (req.url.indexOf('dot-daily-dot-records') === -1) {
                req = this.convertToSnakeCase(req);
            }
            if (req.url.indexOf('dot-daily-dot-records/filter')) {
                req = this.convertToSnakeCase(req);
            }
            req = this.findBooleanypes(req);
       }
        this.requests.push(req);
        this.helperService.isLoading.next(true);
        return next.handle(req).pipe(
            tap(evt => {
                if (evt instanceof HttpResponse) {
                    this.removeRequest(req);
                }
            }),
            catchError(response => {
                this.removeRequest(req);
                if (req.responseType === 'text') {
                    response.error = JSON.parse(response.error);
                }
                if (response instanceof HttpErrorResponse) {
                    if (response.status === 401) {
                        if (!this.router.url.includes('login')) {
                            this.toastr.error('Your Session Expired! Please login again');
                            this.store.dispatch(new AuthLogout());
                        }
                        return observableThrowError(response);
                    }
                    if (response.status === 400) {
                        if (req.url.indexOf('dot-admin-daily-dot-records/import') >= 0) {
                            this.toastr.error(ERROR_MESSAGE.DAILY_DOT_DATE_FORMAT);
                        }
                        if (response.error && HTTP_ERROR_MESSAGE.includes(response.error.message)) {
                            this.toastr.error(response.error.message);
                        }
                        return observableThrowError(response);
                    }
                    this.toastr.error('Something went wrong, please try again later');
                    if (get(response, 'error.error_code', undefined)) {
                        this.toastr.error('ERROR', get(response, 'error.error_description', undefined));
                    } else {
                        return observableThrowError(response);
                    }
                }
                return new Observable<any>(observer => observer.next(response));
            }),
            finalize(() => {
                this.removeRequest(req);
            })
        );
    }

    checkUrl(url: string): boolean {
    const toExclude = ['file_upload', 'upload_avatar', 'upload', 'dot-admin-daily-dot-records/import'];
    for (const excludeString of toExclude) {
      if (url.indexOf(excludeString) >= 0) {
        return false;
      }
    }
    return true;
    }

    removeRequest(req: HttpRequest<any>): any {
        const i = this.requests.indexOf(req);
        if (i >= 0) {
            this.requests.splice(i, 1);
        }
        this.helperService.isLoading.next(this.requests.length > 0);
    }
    convertToSnakeCase(request: HttpRequest<any>): HttpRequest<any> {
        return request.clone({
          body: this.helperService.camelToSnakeCase(request.body)
        });
    }
    convertToCamel(res: any): any {
        if (res && res.body && res.body.length) {
            const newArray = [];
            res.body.forEach(r => {
                newArray.push(this.helperService.snakeToCamel(r));
            });
            return res.clone({
                body: newArray
            });
        }
        if (res && res.body) {
            return res.clone({
                body: this.helperService.snakeToCamel(res.body)
            });
        }
    }

    findBooleanypes(request: HttpRequest<any>) {
        return request.clone({
            body: this.converBooleanTinyInt(request.body)
          });
    }

    converBooleanTinyInt(obj: any): any {
       const keys = Object.keys(obj);
       keys.forEach(key => {
           if (typeof(obj[key]) === 'boolean') {
               if (obj[key]) {
                obj[key] = 1;
                } else {obj[key] = 0 ;
                }
            } });
       return obj;
    }
}
