import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DotXSharedLibsModule } from '../../shared/modules/shared-libs.module';
import { DotUserSkillsUpdateComponent } from './dot-user-skills-update.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { WriteYourselfComponent } from './write-yourself/write-yourself.component';
const routes: Routes = [
  {
    path: '',
    component: DotUserSkillsUpdateComponent
  },
  {
    path: 'aboutme',
    component: WriteYourselfComponent
  }
];
@NgModule({
  imports: [DotXSharedLibsModule, SharedModule,
    RouterModule.forChild(routes)],
  declarations: [DotUserSkillsUpdateComponent, WriteYourselfComponent],
  exports: [DotUserSkillsUpdateComponent]
})
export class DotUserSkillsModule {}
