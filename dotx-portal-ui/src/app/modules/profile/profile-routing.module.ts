import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateProfileComponent } from './page/create-profile/create-profile.component';


const routes: Routes = [
  {
    path: 'createProfile',
    component: CreateProfileComponent,
  },
  {
    path: 'createProfile?value',
    component: CreateProfileComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
