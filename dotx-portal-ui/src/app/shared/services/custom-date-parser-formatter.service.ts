import { Injectable } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class CustomDateParserFormatterService {

  parse(value: string): NgbDateStruct
  {
    if (!value)
      return null
     let parts=value.split('/');
     return {year:+parts[0],month:+parts[1],day:+parts[2]} as NgbDateStruct

  }
  format(date: NgbDateStruct): string
  {
   //  return date?date.year+"/"+('0'+date.month).slice(-2)+"/"+('0'+date.day).slice(-2):null
    return date?('0'+date.day).slice(-2)+"/"+('0'+date.month).slice(-2)+"/"+(date.year):null
  }
}
