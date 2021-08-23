import {QuestMapDetailComponent} from './quest-map-detail/quest-map-detail.component';
import {QuestMapComponent} from './quest-map/quest-map.component';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DailyDotHomeComponent} from './daily-dot-home/daily-dot-home.component';
import {StudentHomeComponent} from './student-home/student-home.component';
import {SpotlightChallengesComponent} from './spotlight-challenges/spotlight-challenges.component';
import {StudentGroupsComponent} from './student-groups/student-groups.component';
import {StudentGroupsEditComponent} from './student-groups/student-groups-edit/student-groups-edit.component';
import {DefaultHomeComponent} from './default-home/default-home.component';
import {SearchSpotlightChallengesComponent} from './search-spotlight-challenges/search-spotlight-challenges.component';


const routes: Routes = [
  {
    path: '',
    component: DefaultHomeComponent,
    children: [
      {
        path: '',
        component: StudentHomeComponent,
        },
        {
          path: 'home',
          component: StudentHomeComponent,
        },
        {
          path: 'daily-dot',
          component: DailyDotHomeComponent,
        },
        {
          path: 'quest-map',
          component: QuestMapComponent,
        },
        {
          path: 'quest-map/:id',
          component: QuestMapDetailComponent,
        },
        {
          path: 'spotlight',
          component: SpotlightChallengesComponent,
        },
        {
          path: 'spotlight-groups',
          component: StudentGroupsComponent,
        },
        {
          path: 'spotlight-groups/:id',
          component: StudentGroupsComponent,
        },
      {
        path: 'edit-groups/:type',
        component: StudentGroupsEditComponent,
      },
      {
        path: 'edit-groups/:type/:id',
        component: StudentGroupsEditComponent,
      },
      {
        path: 'spotlight-search',
        component: SearchSpotlightChallengesComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
