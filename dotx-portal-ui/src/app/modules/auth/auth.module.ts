import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotLoginComponent } from './page/dot-login/dot-login.component';
import { AuthRoutingModule } from './auth-routing.module';
import { ResetPasswordComponent } from './page/reset-password/reset-password.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { ForgotPasswordComponent } from './page/forgot-password/forgot-password.component';
import { JoinCodeComponent } from './page/join-code/join-code.component';
import { CreatePasswordComponent } from './page/create-password/create-password.component';
import { AuthComponent } from './auth.component';
import { LayoutModule } from 'src/app/shared/layout/layout.module';

@NgModule({
  declarations: [DotLoginComponent, ResetPasswordComponent, ForgotPasswordComponent,
    JoinCodeComponent, CreatePasswordComponent, AuthComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    LayoutModule
  ],
  exports: [ResetPasswordComponent, ForgotPasswordComponent]
})
export class AuthModule { }
