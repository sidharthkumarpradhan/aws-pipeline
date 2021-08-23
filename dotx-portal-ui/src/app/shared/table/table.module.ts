import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableFilterPipe } from './table-filter.pipe';
import { SearchComponent } from './search.component';
import { AppPaginationComponent } from './app-pagination/app-pagination.component';
import { PaginationPipe } from './app-pagination/paginate.pipe';


const commonComps = [
  TableFilterPipe,
  SearchComponent,
  AppPaginationComponent,
  PaginationPipe
]
@NgModule({
  declarations: [...commonComps],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [...commonComps]
})
export class TableModule { }
