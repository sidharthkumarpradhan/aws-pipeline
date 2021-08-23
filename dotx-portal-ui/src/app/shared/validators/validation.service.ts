import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }

  public static getValidationErrorMessage(validatorName: string, labelName: string, validatorValue?: any): any {
    const config = {
      required: `${labelName} is required`,
      invalidValue: `Invalid ${labelName}`,
      inValidUserName: 'Invalid, Should be Email or 10 digit mobile number and atleast 6 characters before @',
      invalidPassword: 'Must be atleast 8 characters, contains a number',
      invalidPreferPassword: 'Password should contain minimum 8 characters, one capital,one number and one special character',
      maxlength: `This field can't contains more than ${validatorValue.requiredLength} characters`,
      minlength: `This field must contains atleast ${validatorValue.requiredLength} characters`,
      invalidDOB: `Age must be 18 years and above`,
      pattern: `Invalid ${labelName}`,
      notSame: 'Passwords do not match'
    };
    return config[validatorName];
  }
}
