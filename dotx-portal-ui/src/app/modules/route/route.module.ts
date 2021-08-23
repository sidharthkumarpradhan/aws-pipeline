import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouteComponent } from './route.component';
import { AppRouteodule } from './route-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { LayoutModule } from 'src/app/shared/layout/layout.module';



@NgModule({
  declarations: [RouteComponent],
  imports: [
    CommonModule,
    AppRouteodule,
    SharedModule,
    LayoutModule
  ]
})
export class RouteModule { }
