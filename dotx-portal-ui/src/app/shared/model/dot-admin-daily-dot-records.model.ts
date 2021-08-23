import { Moment } from 'moment';

export interface IDotAdminDailyDotRecords {
  id?: number;
  adminDailyDotRecId?: number;
  dailyDotType?: string;
  recordDate?: Moment;
  recordTitle?: string;
  recordDescription?: string;
  recordResponse?: string;
  option1?: string;
  option2?: string;
  option3?: string;
  option4?: string;
  dateOfPublish?: Moment;
  recordStatus?: string;
  isActive?: boolean;
  createdBy?: string;
  createdDate?: Moment;
  lastmodifiedBy?: string;
  lastmodifiedDate?: Moment;
}

export class DotAdminDailyDotRecords implements IDotAdminDailyDotRecords {
  constructor(
    public id?: number,
    public adminDailyDotRecId?: number,
    public dailyDotType?: string,
    public recordDate?: Moment,
    public recordTitle?: string,
    public recordDescription?: string,
    public recordResponse?: string,
    public option1?: string,
    public option2?: string,
    public option3?: string,
    public option4?: string,
    public dateOfPublish?: Moment,
    public recordStatus?: string,
    public isActive?: boolean,
    public createdBy?: string,
    public createdDate?: Moment,
    public lastmodifiedBy?: string,
    public lastmodifiedDate?: Moment
  ) {
    this.isActive = this.isActive || false;
  }
}
