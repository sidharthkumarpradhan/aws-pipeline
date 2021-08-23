import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { NgJhipsterModule } from 'ng-jhipster';
import { SearchFilter } from '../pipes/filter.pipe';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  declarations: [SearchFilter],
  exports: [FormsModule, CommonModule, NgbModule, ReactiveFormsModule,
    //  NgJhipsterModule,
    BsDatepickerModule,
    SearchFilter],
})
export class DotXSharedLibsModule {}
