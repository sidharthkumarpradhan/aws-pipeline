import {TermsComponent} from './terms/terms.component';
import {DefaultComponent} from './default/default.component';
import {ContactComponent} from './contact/contact.component';
import {AboutComponent} from './about/about.component';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {AuthenticationGuard} from './shared/services/authentication.guard';

const routes: Routes = [
  {
    path: '',
    component: DefaultComponent,
    children: [
      {path: '', redirectTo: 'home', pathMatch: 'full'},
      {path: 'home', component: HomeComponent},
      {path: 'about', component: AboutComponent},
      {path: 'contacts', component: ContactComponent},
      {path: 'terms-conditions', component: TermsComponent},
    ]
  },
  {
    path: 'auth',
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./modules/auth/auth.module').then(m => m.AuthModule)
      }
    ]
  },
  {
    path: 'main-route',
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./modules/route/route.module').then(m => m.RouteModule)
      }
    ],
    canActivate: [AuthenticationGuard]
  },



  // Fallback when no prior routes is matched
  {path: '**', redirectTo: 'home', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true,
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
