/* import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilter implements PipeTransform {
  transform(value: any, args?: any): any {
    if (!value) {return null; }
    if (!args) {
      return value;
    }
    args = args.toLowerCase();
    return value.filter(
      (item: any)  => JSON.stringify(item).toLowerCase().includes(args));
  }
} */

import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({
  name: 'searchFilter',
  pure: false
})
@Injectable()
export class SearchFilter implements PipeTransform {

  /**
   *
   * @param items List of items to filter
   * @param term  a string term to compare with every property of the list
   * @param excludes List of keys which will be ignored during search
   *
   */
  static filter(items: Array<{ [key: string]: any }>, term: string, excludes: any): Array<{ [key: string]: any }> {

    const toCompare = term.toLowerCase();

    function checkInside(item: any, term: string) {

      if (typeof item === 'string' && item.toString().toLowerCase().includes(toCompare)) {
        return true;
      }

      for (const property in item) {
        if (item[property] === null || item[property] == undefined || excludes.includes(property)) {
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

    return items.filter(function(item) {
      return checkInside(item, term);
    });
  }

  transform(items: any, term: string, excludes: any = []): any {
    if (!term || !items) { return items; }

    return SearchFilter.filter(items, term, excludes);
  }
}
