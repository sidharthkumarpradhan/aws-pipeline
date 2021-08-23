import { Pipe, PipeTransform } from '@angular/core';
import { MOBILE_PAGE_SIZE, PAGE_SIZE } from 'src/app/shared/constant';

@Pipe({
  name: 'pagination',
  pure: false
})
  export class PaginationPipe implements PipeTransform {

  transform(items: any[], page: number, pageSize: number = PAGE_SIZE): any {
    const totalCount: number = items.length;
    const currentPage: number = page;
    if (window.screen.width < 768 && pageSize === 10) {
      pageSize = MOBILE_PAGE_SIZE;
    }

    const start = (currentPage - 1) * pageSize;
    const end = Math.min(start + pageSize - 1, totalCount);

    const result: any[] = items.slice(start, end + 1);
    return result;
  }
}
