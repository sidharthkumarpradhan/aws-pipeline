import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DotXSharedLibsModule } from '../../shared/modules/shared-libs.module';
// import { DotUserDetailsComponent } from './dot-user-details.component';
import { DotUserDetailsUpdateComponent } from './dot-user-details-update.component';
import { dotUserDetailsRoute } from './dot-user-details.route';
import { SharedModule } from 'src/app/shared/shared.module';
import { dotUserAvatarComponent } from './dot-user-avatar.component';

const routes: Routes = [
  {
      path: '',
      component: DotUserDetailsUpdateComponent
  },
  {
    path: 'userAvatar',
    component: dotUserAvatarComponent
  },
];
@NgModule({
  imports: [DotXSharedLibsModule, SharedModule, RouterModule.forChild(dotUserDetailsRoute)],
  declarations: [
    // DotUserDetailsComponent, 
    DotUserDetailsUpdateComponent,
    dotUserAvatarComponent
  ],
  exports: [
    // DotUserDetailsComponent,
    DotUserDetailsUpdateComponent,
    dotUserAvatarComponent],
})
export class DotUserDetailsModule {}
