import { AbstractControl } from '@angular/forms';
import { NUMERIC, NUMERICWITHDECIMAL, ALPHANUMERIC, NAME, ADDRESS, USERNAME, PASSWORD, EMAIL, FAX, BLOODGROUP, LICENSENUMBER, URL } from '../constants/validationConstants';

export class CustomValidator {
    static ValidateUserName(control: AbstractControl) {
        const reg_ = new RegExp(
            '^[a-zA-Z0-9.!#$%&"*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$'
        );

        if (reg_.test(control.value)) {
            const isValidate = CustomValidator.validate(
                control,
                new RegExp(USERNAME.REGEX)
            );
            if (isValidate) {
                return { inValidUserName: isValidate };
            }
            return null;
        } else {
            const isValidate = CustomValidator.validate(
                control,
                new RegExp(NUMERIC.REGEX)
            );
            if (isValidate) {
                return { inValidUserName: isValidate };
            }
            return null;
        }
    }

    static ValidatePassword(control: AbstractControl) {
        const isValidate = CustomValidator.validate(
            control,
            new RegExp(PASSWORD.REGEX)
        );
        if (isValidate) {
            return { invalidPreferPassword: isValidate };
        }
        return null;
    }

    static ValidatePreferPassword(control: AbstractControl) {
        const isValidate = CustomValidator.validate(
            control,
            new RegExp(PASSWORD.REGEX)
        );
        if (isValidate) {
            return { invalidPreferPassword: isValidate };
        }
        return null;
    }

    static ValidateEmail(control: AbstractControl) {
        const isValidate = CustomValidator.validate(control, new RegExp(EMAIL.REGEX));
        if (isValidate) {
            return { 'invalidValue': isValidate };
        }
        return null;
    }

    static ValidateFax(control: AbstractControl) {
        const isValidate = CustomValidator.validate(control, new RegExp(FAX.REGEX));
        if (isValidate) {
            return { 'invalidValue': isValidate };
        }
        return null;
    }

    static ValidateAddress(control: AbstractControl) {
        const isValidate = CustomValidator.validate(control, new RegExp(ADDRESS.REGEX));
        if (isValidate) {
            return { 'invalidValue': isValidate };
        }
        return null;
    }

    static ValidateDOB(control: AbstractControl) {
        const val = control.value;
        if (val) {
            const { year, month, day } = val;
            const today = new Date().getTime();
            const selectedDate = new Date(`${month}/${day}/${year}`).getTime();
            const yearDiff = Math.ceil((today - selectedDate) / (1000 * 60 * 60 * 24 * 365.25));
            if (yearDiff < 19) {
                return { 'invalidDOB': true };
            } else {
                return null;
            }

        }
        return null;
    }


    static ValidateBloodGroup(control: AbstractControl) {
        const isValidate = CustomValidator.validate(control, new RegExp(BLOODGROUP.REGEX));
        if (isValidate) {
            return { 'invalidValue': isValidate };
        }
        return null;
    }

    static AllowAlphaOnly(control: AbstractControl) {
        const isValidate = CustomValidator.validate(control, new RegExp(NAME.REGEX));
        if (isValidate) {
            return { 'invalidValue': isValidate };
        }
        return null;
    }

    static AllowNumericOnly(control: AbstractControl) {
        const isValidate = CustomValidator.validate(control, new RegExp(NUMERIC.REGEX));
        if (isValidate) {
            return { 'invalidValue': isValidate };
        }
        return null;
    }

    static AllowNumericWithDecimalOnly(control: AbstractControl) {
        const isValidate = CustomValidator.validate(control, new RegExp(NUMERICWITHDECIMAL.REGEX));
        if (isValidate) {
            return { 'invalidValue': isValidate };
        }
        return null;
    }

    static AllowAlphaNumericOnly(control: AbstractControl) {
        const isValidate = CustomValidator.validate(control, new RegExp(ALPHANUMERIC.REGEX));
        if (isValidate) {
            return { 'invalidValue': isValidate };
        }
        return null;
    }

    static validate(control, reg_) {
        if (control.value && !(reg_.test(control.value))) {
            return true;
        }
        return false;
    }

    static validateLicenseNumber(control: AbstractControl) {
        const isValidate = CustomValidator.validate(control, new RegExp(LICENSENUMBER.REGEX));
        if (isValidate) {
            return { 'invalidValue': isValidate };
        }
        return null;
    }

    static validateWebsiteUrl(control: AbstractControl) {
        const isValidate = CustomValidator.validate(control, new RegExp(URL.REGEX));
        if (isValidate) {
            return { 'invalidValue': isValidate };
        } else if (!isValidate && control && control.value) {
            const val2 = control.value.split('//')[1];
            const webCtx = val2.split('.')[0];
            if (!webCtx.match(/^(?![0-9]*$)[a-zA-Z0-9]+$/)) {
                return { 'invalidValue': true };
            }
        }
        return null;
    }

}