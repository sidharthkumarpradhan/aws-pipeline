import { NgModule, ModuleWithProviders } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AuthInterceptor } from './auth-interceptor';

@NgModule({
  imports: [HttpClientModule],
  exports: [HttpClientModule]
})
export class CommonInterceptorModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CommonInterceptorModule,
      providers: [{
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true
      }]
    };
  }
}
