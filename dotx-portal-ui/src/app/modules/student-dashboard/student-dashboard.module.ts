import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StudentRoutingModule} from './student-routing.module';

/* Modules */
import {SharedModule} from 'src/app/shared/shared.module';
import {CommonLoaderModule} from 'src/app/shared/component/common-loader/common-loader.module';
import {TagInputModule} from 'ngx-chips';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {TableModule} from 'src/app/shared/table/table.module';
import {NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';
import {LayoutModule} from 'src/app/shared/layout/layout.module';
import {ChartsModule} from 'ng2-charts';
import {StudentOnboardModule} from '../student-onboard/student-onboard.module';

/* Components  */
import {StudentGroupsComponent} from './student-groups/student-groups.component';
import {StudentGroupsEditComponent} from './student-groups/student-groups-edit/student-groups-edit.component';
import {DefaultHomeComponent} from './default-home/default-home.component';
import {QuestModalComponent} from './quest-map-detail/quest-modal/quest-modal.component';
import {StudentHomeComponent} from './student-home/student-home.component';
import {StudentDashboardComponent} from './student-dashboard/student-dashboard.component';
import {EditStudentDashboardComponent} from './edit-student-dashboard/edit-student-dashboard.component';
import {DailyDotHomeComponent} from './daily-dot-home/daily-dot-home.component';
import {StudentHeaderComponent} from './student-header/student-header.component';
import {QuestMapComponent} from './quest-map/quest-map.component';
import {QuestMapDetailComponent} from './quest-map-detail/quest-map-detail.component';
import {SpotlightChallengesComponent} from './spotlight-challenges/spotlight-challenges.component';
import {WorkLocationComponent} from './work-location/work-location.component';
import {SearchSpotlightChallengesComponent} from './search-spotlight-challenges/search-spotlight-challenges.component';
import {SendMessagePopupComponent} from '../../shared/component/send-message-popup/send-message-popup.component';
import {EditStudentProfileComponent} from './edit-student-profile/edit-student-profile.component';
import {PersonalityQuizComponent} from './personality-quiz/personality-quiz.component';
import {TalentsFavouritesComponent} from './talents-favourites/talents-favourites.component';
import {MyChallengesPopupComponent} from '../../shared/component/my-challenges-popup/my-challenges-popup.component';
import {SoloChallengeModelComponent} from './spotlight-challenges/solo-challenge-model/solo-challenge-model.component';
import {GroupChallengeModelComponent} from './spotlight-challenges/group-challenge-model/group-challenge-model.component';
import {ChallengeWorkareaComponent} from './spotlight-challenges/challenge-workarea/challenge-workarea.component';

@NgModule({
  declarations: [StudentHomeComponent, StudentDashboardComponent, EditStudentDashboardComponent,
    DailyDotHomeComponent, StudentHeaderComponent, QuestMapComponent,
    QuestMapDetailComponent, SpotlightChallengesComponent,
    StudentGroupsComponent, StudentGroupsEditComponent,
    WorkLocationComponent,
    DefaultHomeComponent,
    QuestModalComponent,
    SearchSpotlightChallengesComponent,
    EditStudentProfileComponent,
    PersonalityQuizComponent,
    TalentsFavouritesComponent,
    SoloChallengeModelComponent,
    GroupChallengeModelComponent,
    ChallengeWorkareaComponent],
  imports: [
    CommonModule,
    StudentRoutingModule,
    // ReactiveFormsModule,
    StudentOnboardModule,

    // NgbModule,
    TagInputModule,
    TableModule,
    NgMultiSelectDropDownModule,

    SharedModule,
    CommonLoaderModule,
    LayoutModule,
    ChartsModule

  ],
  entryComponents: [
    StudentDashboardComponent,
    EditStudentDashboardComponent,
    WorkLocationComponent,
    SendMessagePopupComponent,
    EditStudentProfileComponent,
    MyChallengesPopupComponent,
    SoloChallengeModelComponent,
    GroupChallengeModelComponent,
    ChallengeWorkareaComponent
  ],
  exports: [StudentHomeComponent, StudentDashboardComponent, EditStudentDashboardComponent,
    StudentHeaderComponent, DailyDotHomeComponent, SpotlightChallengesComponent],
  providers: []
})
export class StudentDashboardModule { }
