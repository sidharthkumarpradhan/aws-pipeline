
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteComponent } from './route.component';


const routes: Routes = [
    {
        path: '',
        component: RouteComponent,
        children: [
            // custom created component
            // {
            //     path: 'profile',
            //     children: [
            //         {
            //             path: '',
            //             loadChildren: () =>
            //                 import('../profile/profile.module').then(m => m.ProfileModule)
            //         }
            //     ]
            // },
            {
                path: 'm',
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import('../admin-dashboard/admin-dashboard.module').then(m => m.AdminDashboardModule)
                    }
                ]
            },

            // {
            //     path: 'user',
            //     children: [
            //         {
            //             path: 'userDetails',
            //             loadChildren: () =>
            //                 import('../dot-user-details/dot-user-details.module').then(m => m.DotUserDetailsModule)
            //         }
            //     ]
            // },

            // {
            //     path: 'quiz',
            //     children: [
            //         {
            //             path: 'detail',
            //             loadChildren: () =>
            //                 import('../dot-personality-quiz/dot-personality-quiz.module').then(m => m.DotPersonalityQuizModule)
            //         }
            //     ]
            // },
            // {
            //     path: 'skill',
            //     children: [
            //         {
            //             path: 'detail',
            //             loadChildren: () =>
            //                 import('../dot-user-skills/dot-user-skills.module').then(m => m.DotUserSkillsModule)
            //         }
            //     ]
            // },
            {
                path: 'student',
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import('../student-dashboard/student-dashboard.module').then(m => m.StudentDashboardModule)
                    }
                ]
            },

            // {
            //     path: 'onBoarding',
            //     children: [
            //         {
            //             path: '',
            //             loadChildren: () =>
            //                 import('../dot-on-boarding-quiz/on-boarding.module').then(m => m.OnBoardingModule)
            //         }
            //     ]
            // },
            {
                path: 'student-onboard',
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import('../student-onboarding/student-onboarding.module').then(m => m.StudentOnboardingModule)
                    }
                ]
            },
        ]
    }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
export class AppRouteodule { }
