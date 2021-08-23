import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { CreateProfileComponent } from './page/create-profile/create-profile.component';
// import { ReactiveFormsModule } from '@angular/forms';
// import { NgbDate, NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { ControlMessagesComponent } from 'src/app/shared/component/control-messages/control-messages.component';
// import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [CreateProfileComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    /* ReactiveFormsModule,
    NgbModule,
    SharedModule */
  ]
})
export class ProfileModule { }
