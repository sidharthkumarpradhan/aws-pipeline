import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonLoaderComponent } from './common-loader.component';


@NgModule({
  declarations: [
    CommonLoaderComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [CommonLoaderComponent]
})
export class CommonLoaderModule { }
