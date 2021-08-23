import { Moment } from 'moment';

export interface IDotJoincodeDetails {
  id?: number;
  joincodeId?: number;
  joincode?: string;
  userEmail?: string;
  passwdRequired?: boolean;
  joinCodePasswd?: string;
  createdBy?: string;
  createdDate?: Moment;
  lastmodifiedBy?: string;
  lastmodifiedDate?: Moment;
}

export class DotJoincodeDetails implements IDotJoincodeDetails {
  constructor(
    public id?: number,
    public joincodeId?: number,
    public joincode?: string,
    public userEmail?: string,
    public passwdRequired?: boolean,
    public joinCodePasswd?: string,
    public createdBy?: string,
    public createdDate?: Moment,
    public lastmodifiedBy?: string,
    public lastmodifiedDate?: Moment
  ) {
    this.passwdRequired = this.passwdRequired || false;
  }
}
