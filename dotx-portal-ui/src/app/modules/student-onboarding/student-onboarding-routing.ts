import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AboutDotxComponent } from "./about-dotx/about-dotx.component";
import { CompleteProfileComponent } from "./complete-profile/complete-profile.component";
import { PersonalityQuizComponent } from "./personality-quiz/personality-quiz.component";
import { StudentOnboardingComponent } from "./student-onboarding.component";
import { TalentFavOnboardComponent } from "./talent-fav-onboard/talent-fav-onboard.component";
import { UserAvatarComponent } from "./user-avatar/user-avatar.component";
import { UserInfoComponent } from "./user-info/user-info.component";
import { WriteYourselfComponent } from "./write-yourself/write-yourself.component";

const routes: Routes = [
    {
        path: '',
        component: StudentOnboardingComponent,
        children: [
            {
                path: 'about-dotx',
                component: AboutDotxComponent
            },
            {
                path: 'user-info',
                component: UserInfoComponent
            },
            {
                path: 'avatar',
                component: UserAvatarComponent
            },
            {
                path: 'personality-quiz',
                component: PersonalityQuizComponent
            },
            {
                path: 'personality-quiz/:page',
                component: PersonalityQuizComponent
            },
            {
                path: 'skill/:page',
                component: TalentFavOnboardComponent
            },
            {
                path: 'about-me',
                component: WriteYourselfComponent
            },
            {
                path: 'completed',
                component: CompleteProfileComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
export class StudentOnboardingRoutingModule { }