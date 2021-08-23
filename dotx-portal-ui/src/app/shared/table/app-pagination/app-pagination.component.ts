import { Component, OnChanges, Input, EventEmitter, Output, SimpleChanges, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { MOBILE_PAGE_SIZE, PAGE_SIZE } from 'src/app/shared/constant';

@Component({
  selector: 'app-pagination',
  templateUrl: './app-pagination.component.html',
  styles: [`
  .dataTables_info{ font-size: 14px;line-height: 14px;color: #606a71; }`]
})
export class AppPaginationComponent implements OnChanges {
  @Input() page = 1;
  @Input() totalRecords = 0;
  @Input() pageSize: number = PAGE_SIZE;
  @Output() readonly pageChange: EventEmitter<number> = new EventEmitter();

  pages: number [] = [];
  activePage: number = 1;
  startIndex: number;
  endIndex: number;
  pageCount: number;

  ngOnChanges(changes: SimpleChanges): void {
    if (window.screen.width < 768) {
      this.pageSize = MOBILE_PAGE_SIZE;
    }
    this.pageCount = Math.ceil(this.totalRecords / this.pageSize);    
    // reset page if tableData array has changed
    if (this.totalRecords && changes.totalRecords && changes.totalRecords.currentValue !== changes.totalRecords.previousValue) {
      this.page = 1;
      this.onClickPage(1);
    } else {
      this.activePage = this.page;
    }
    
  }

  onClickPage(pageNumber: number): void {
    if (pageNumber >= 1) {
      this.getPages(pageNumber);
    }
  }
  onClickFirstPage(pageNumber): void {
    if (this.activePage !== pageNumber) {
      this.getPages(pageNumber);
    }
  }

  onClickLastPage(pageNumber): void {
    if (this.activePage !== pageNumber) {
      this.getPages(pageNumber);
    }
  }

  getPages(pageNumber): void {
    this.activePage = pageNumber;
    this.getArrayOfPage(pageNumber);
    this.pageChange.emit(this.activePage);
  }

  getArrayOfPage(page: number): void {    
    let startPage: number, endPage: number;
    if (this.pageCount <= 5) {
      startPage = 1;
      endPage = this.pageCount;
    // tslint:disable-next-line:no-collapsible-if
    } else {

      if (page <= 3) {
        startPage = 1;
        endPage = 5;

      } else if (page + 1 >= this.pageCount) {
        startPage = this.pageCount - 4;
        endPage = this.pageCount;
      } else {
        startPage = page - 2;
        endPage = page + 2;
      }
    }
    this.pages = _.range(startPage, endPage + 1);

    this.startIndex = (this.activePage - 1) * this.pageSize;
    const a = (this.startIndex) + (+this.pageSize) - 1;
    const b = this.totalRecords - 1;
    this.endIndex = Math.min(a, b);
  }
}
