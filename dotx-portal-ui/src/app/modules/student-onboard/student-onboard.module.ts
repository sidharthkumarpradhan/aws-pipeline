import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';

import { AvatarComponent } from './avatar/avatar.component';
import { SkillsComponent } from './skills/skills.component';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { PasswordComponent } from './password/password.component';
import { QuizAttemptComponent } from './quiz-attempt/quiz-attempt.component';
import { CommonLoaderModule } from 'src/app/shared/component/common-loader/common-loader.module';

const commonComponents = [AvatarComponent, SkillsComponent, PersonalInfoComponent,
  PasswordComponent, QuizAttemptComponent];

@NgModule({
  declarations: [...commonComponents],
  imports: [
    SharedModule,
    CommonLoaderModule,
  ],
  exports: [...commonComponents]
})
export class StudentOnboardModule { }
