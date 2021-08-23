import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotOnBoardingQuizComponent } from './dot-on-boarding-quiz.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    component: DotOnBoardingQuizComponent,
    children: [
      {
        path: '',
        component: DotOnBoardingQuizComponent,
      },

    ]
  },
];

@NgModule({
  declarations: [DotOnBoardingQuizComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
  exports: [DotOnBoardingQuizComponent]
})
export class OnBoardingModule { }
