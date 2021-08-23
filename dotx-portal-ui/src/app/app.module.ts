import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// import { ReactiveFormsModule } from '@angular/forms';

/* Modules */
import { LayoutModule } from './shared/layout/layout.module';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { CommonInterceptorModule } from './shared/modules/common-interceptor.module';
import { MetaReducer, StoreModule } from '@ngrx/store';
import { localStorageSyncReducer, reducers } from './store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { effects } from './store/effect.index';
// import { AuthModule } from './modules/auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  SocialLoginModule,
  AuthServiceConfig,
  GoogleLoginProvider
} from 'angular5-social-login';
import { getAuthServiceConfigs } from './shared/socialloginConfig';
// import { DotUserDetailsModule } from './modules/dot-user-details/dot-user-details.module';

/* Components  */
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { DefaultComponent } from './default/default.component';
import { TermsComponent } from './terms/terms.component';
import { ChartsModule, ThemeService } from 'ng2-charts';
import { CKEditorModule } from 'ckeditor4-angular';
const metaReducers: MetaReducer<any>[] = [localStorageSyncReducer];
export function provideConfig() {
  return getAuthServiceConfigs;
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    ContactComponent,
    DefaultComponent,
    TermsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CKEditorModule,
    // ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    // NgbModule,
    LayoutModule,

    SocialLoginModule,
    ChartsModule,

    CommonInterceptorModule.forRoot(),
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreDevtoolsModule.instrument(), // To enable NGRX REDUX DEV TOOLS comment this line
    EffectsModule.forRoot(effects),
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-right',
      preventDuplicates: true
    }),
  ],
  providers: [{
    provide: AuthServiceConfig,
    useFactory: provideConfig
  }, NgbActiveModal, ThemeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
