import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { RouterModule, Routes } from '@angular/router';

/* Modules */
import { LayoutModule } from 'src/app/shared/layout/layout.module';
import { TableModule } from 'src/app/shared/table/table.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { TagInputModule } from 'ngx-chips';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

/* Components  */
import { AdminHeaderComponent } from './layout/header/admin-header.component';
import { ChallengeComponent } from './challenge/challenge.component';
import { QuestComponent } from './quest/quest.component';
import { DailyDotsComponent } from './daily-dots/daily-dots.component';
import { AdminHomeComponent, NgbdModal1Content } from './admin-home/admin-home.component';
import { ChallengeUpdateComponent } from './challenge/challenge-update/challenge-update.component';
import { GroupUpdateComponent } from './challenge/groups/group-update/group-update.component';
import { GroupsComponent } from './challenge/groups/groups.component';
import { LeaderBoardComponent } from './admin-home/leader-board/leader-board.component';
import { DotCoinsComponent } from './admin-home/dot-coins/dot-coins.component';
import { CommonLoaderModule } from 'src/app/shared/component/common-loader/common-loader.module';
import { ExportToCsvService } from './export-to-csv.service';
import {AdminResetPasswordComponent} from './layout/reset-password/reset-password.component';
import {StudentOnboardModule} from '../student-onboard/student-onboard.module';
import { JoinCodesModelComponent } from './join-codes-model/join-codes-model.component';

const routes: Routes = [
  {
      path: '',
      component: AdminDashboardComponent,
      children: [
        {
          path: 'home',
          component: AdminHomeComponent,
        },
        {
          path: 'challenge',
          component: ChallengeComponent,
        },
        {
          path: 'challenge/:type',
          component: ChallengeUpdateComponent,
        },
        {
          path: 'challenge/:type/:id',
          component: ChallengeUpdateComponent,
        },
        {
          path: 'group/:type',
          component: GroupUpdateComponent,
        },
        {
          path: 'group/:type/:id',
          component: GroupUpdateComponent,
        },
        {
          path: 'quest',
          component: QuestComponent,
        },
        {
          path: 'daily-dots',
          component: DailyDotsComponent,
        },
      ]
  },
];

@NgModule({
  declarations: [
    AdminDashboardComponent, AdminHeaderComponent, ChallengeComponent,
    QuestComponent, DailyDotsComponent, AdminHomeComponent,
    NgbdModal1Content,
    ChallengeUpdateComponent,
    GroupUpdateComponent,
    GroupsComponent,
    LeaderBoardComponent,
    DotCoinsComponent,
    AdminResetPasswordComponent,
    JoinCodesModelComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    // NgbModule,
    TagInputModule,
    TableModule,
    CommonLoaderModule,
    NgMultiSelectDropDownModule,
    // NgxPaginationModule,
    LayoutModule,
    StudentOnboardModule,
  ],
  entryComponents: [
    NgbdModal1Content,
    GroupUpdateComponent,
    ChallengeUpdateComponent,
    AdminResetPasswordComponent,
    JoinCodesModelComponent
  ],
  providers: [ExportToCsvService]
})
export class AdminDashboardModule { }
