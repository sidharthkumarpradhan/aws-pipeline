import { Pipe, PipeTransform, Injectable } from '@angular/core';
import * as moment from 'moment';
import filter from 'lodash/filter';
@Pipe({
  name: 'tFilter',
  pure: false
})
@Injectable()
export class TableFilterPipe implements PipeTransform {

  /**
     * @param items object from array
     * @param term term's search
     * @param dateFormat array of strings which are in date formats
     */
  transform(items: any, term: string, dateFormat: any = []): any {
    if (!term || !items) {
      return items;
    }

    filter(items, function (item: any): any {
      if (dateFormat && dateFormat.length) {
        dateFormat.forEach(val => {
          item[val] = item[val] ? moment(item[val]).format('MM/DD/YYYY') : item[val];
        });
      }
    });
    return TableFilterPipe.filter(items, term);
  }

  /**
   *
   * @param items List of items to filter
   * @param term  a string term to compare with every property of the list
   *
   */
  static filter(items: Array<{ [key: string]: any }>, term: string): Array<{ [key: string]: any }> {

    const toCompare = term.toLowerCase();

    // tslint:disable-next-line: no-shadowed-variable
    function checkInside(item: any, term: string): boolean {

      if (typeof item === 'string' && item.toString().toLowerCase().includes(toCompare)) {
        return true;
      }

      for (const property in item) {
        if (item[property] === null || item[property] === undefined) {
          continue;
        }
        if (typeof item[property] === 'object') {
          if (checkInside(item[property], term)) {
            return true;
          }
        } else if (item[property].toString().toLowerCase().includes(toCompare)) {
          return true;
        }
      }
      return false;
    }

    return items.filter((item) => {
      return checkInside(item, term);
    });
  }
}
