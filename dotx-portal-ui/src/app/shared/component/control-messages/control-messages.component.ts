import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ValidationService } from '../../validators/validation.service';

@Component({
  selector: 'app-control-messages',
  templateUrl: './control-messages.component.html',
  styleUrls: ['./control-messages.component.scss']
})
export class ControlMessagesComponent implements OnInit {

  @Input()
  public control: FormControl;
  @Input()
  public labelName: string;

  get errorMessage(): boolean {
    if (this.control && this.control.errors) {
      for (const propertyName in this.control.errors) {
        if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched) {
          return ValidationService.getValidationErrorMessage(
            propertyName,
            this.labelName,
            this.control.errors[propertyName],
          );
        }
      }
    }


    return undefined;
  }

  constructor() { }

  ngOnInit() {
  }

}
