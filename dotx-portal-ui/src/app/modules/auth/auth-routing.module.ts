import { CreatePasswordComponent } from './page/create-password/create-password.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DotLoginComponent } from './page/dot-login/dot-login.component';
import { ForgotPasswordComponent } from './page/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './page/reset-password/reset-password.component';
import { JoinCodeComponent } from './page/join-code/join-code.component';
import { AuthComponent } from './auth.component';


const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: '',
        component: DotLoginComponent,
      },
      {
        path: 'login',
        component: DotLoginComponent,
      },
      {
        path: 'resetPassword',
        component: ResetPasswordComponent,
      },
      {
        path: 'forgotPassword',
        component: ForgotPasswordComponent,
      },
      {
        path: 'join-code',
        component: JoinCodeComponent
      },
      {
        path: 'set-password',
        component: CreatePasswordComponent
      }

    ]
  }

]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
