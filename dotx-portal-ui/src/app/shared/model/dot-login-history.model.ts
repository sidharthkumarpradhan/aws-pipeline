import { Moment } from 'moment';

export interface IDotLoginHistory {
  id?: number;
  loginHistId?: number;
  loginId?: string;
  loginDateTime?: Moment;
  logoutDateTime?: Moment;
  loginLocation?: string;
  createdBy?: string;
  createdDate?: Moment;
  lastmodifiedBy?: string;
  lastmodifiedDate?: Moment;
  userIdId?: number;
}

export class DotLoginHistory implements IDotLoginHistory {
  constructor(
    public id?: number,
    public loginHistId?: number,
    public loginId?: string,
    public loginDateTime?: Moment,
    public logoutDateTime?: Moment,
    public loginLocation?: string,
    public createdBy?: string,
    public createdDate?: Moment,
    public lastmodifiedBy?: string,
    public lastmodifiedDate?: Moment,
    public userIdId?: number
  ) {}
}
