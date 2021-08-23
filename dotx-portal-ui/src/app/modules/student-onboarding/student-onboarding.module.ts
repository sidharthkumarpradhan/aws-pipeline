import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentOnboardingComponent } from './student-onboarding.component';
import { StudentOnboardingRoutingModule } from './student-onboarding-routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { LayoutModule } from 'src/app/shared/layout/layout.module';
import { UserInfoComponent } from './user-info/user-info.component';
import { UserAvatarComponent } from './user-avatar/user-avatar.component';
import { PersonalityQuizComponent } from './personality-quiz/personality-quiz.component';
import { TalentFavOnboardComponent } from './talent-fav-onboard/talent-fav-onboard.component';
import { CompleteProfileComponent } from './complete-profile/complete-profile.component';
import { WriteYourselfComponent } from './write-yourself/write-yourself.component';
import { AboutDotxComponent } from './about-dotx/about-dotx.component';



@NgModule({
  declarations: [StudentOnboardingComponent, UserInfoComponent, UserAvatarComponent, PersonalityQuizComponent, TalentFavOnboardComponent, CompleteProfileComponent, WriteYourselfComponent, AboutDotxComponent],
  imports: [
    CommonModule,
    StudentOnboardingRoutingModule,
    SharedModule,
    LayoutModule
  ]
})
export class StudentOnboardingModule { }
