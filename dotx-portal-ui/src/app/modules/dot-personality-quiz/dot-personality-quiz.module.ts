import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DotXSharedLibsModule } from '../../shared/modules/shared-libs.module';
// import { DotPersonalityQuizComponent } from './dot-personality-quiz.component';
// import { DotPersonalityQuizDetailComponent } from './dot-personality-quiz-detail.component';
import { DotPersonalityQuizUpdateComponent } from './dot-personality-quiz-update.component';
// import { DotPersonalityQuizDeleteDialogComponent } from './dot-personality-quiz-delete-dialog.component';
// import { dotPersonalityQuizRoute } from './dot-personality-quiz.route';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  {
      path: '',
      component: DotPersonalityQuizUpdateComponent,
      data: {
        defaultSort: 'id,asc',
        pageTitle: 'DotUserSkills',
      },
  },
];

@NgModule({
  imports: [DotXSharedLibsModule,SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    DotPersonalityQuizUpdateComponent
  ],
  exports: [DotPersonalityQuizUpdateComponent]
})
export class DotPersonalityQuizModule {}
