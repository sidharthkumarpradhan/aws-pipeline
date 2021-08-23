import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { IDotUserDetails, DotUserDetails } from 'src/app/shared/model/dot-user-details.model';
import { DotUserDetailsService } from './dot-user-details.service';
import { DotUserDetailsUpdateComponent } from './dot-user-details-update.component';
import { HelperService } from 'src/app/shared/services/helper.service';
import { dotUserAvatarComponent } from './dot-user-avatar.component';

@Injectable({ providedIn: 'root' })
export class DotUserDetailsResolve implements Resolve<IDotUserDetails> {
  constructor(private service: DotUserDetailsService, private router: Router, private helper: HelperService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDotUserDetails> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((dotUserDetails: HttpResponse<DotUserDetails>) => {
          if (dotUserDetails.body) {
            return of(this.helper.snakeToCamel(dotUserDetails.body));
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new DotUserDetails());
  }
}

export const dotUserDetailsRoute: Routes = [
  
  {
    path: '',
    component: DotUserDetailsUpdateComponent,
    data: {
      defaultSort: 'id,asc',
      pageTitle: 'DotUserDetails',
    },
  },
  {
    path: 'userAvatar',
    component: dotUserAvatarComponent,
    data: {
    //  defaultSort: 'id,asc',
      pageTitle: 'DotUserAvatar',
    },
  },
  {
    path: 'new',
    component: DotUserDetailsUpdateComponent,
    resolve: {
      dotUserDetails: DotUserDetailsResolve,
    },
    data: {
      pageTitle: 'DotUserDetails',
    },
  },
  {
    path: ':id/edit',
    component: DotUserDetailsUpdateComponent,
    resolve: {
      dotUserDetails: DotUserDetailsResolve,
    },
    data: {
      pageTitle: 'DotUserDetails',
    },
  }
];
