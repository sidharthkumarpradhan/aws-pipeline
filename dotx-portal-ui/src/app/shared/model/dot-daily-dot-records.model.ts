import { Moment } from 'moment';

export interface IDotDailyDotRecords {
  id?: number;
  dailyDotRecId?: number;
  recordDate?: Moment;
  recordTitle?: string;
  recordDescription?: string;
  recordResponse?: string;
  option1?: string;
  option2?: string;
  option3?: string;
  option4?: string;
  isDeleted?: boolean;
  fileUploadPath?: string;
  createdBy?: string;
  createdDate?: Moment;
  lastmodifiedBy?: string;
  lastmodifiedDate?: Moment;
  dailyDotIdId?: number;
}

export class DotDailyDotRecords implements IDotDailyDotRecords {
  constructor(
    public id?: number,
    public dailyDotRecId?: number,
    public recordDate?: Moment,
    public recordTitle?: string,
    public recordDescription?: string,
    public recordResponse?: string,
    public option1?: string,
    public option2?: string,
    public option3?: string,
    public option4?: string,
    public isDeleted?: boolean,
    public fileUploadPath?: string,
    public createdBy?: string,
    public createdDate?: Moment,
    public lastmodifiedBy?: string,
    public lastmodifiedDate?: Moment,
    public dailyDotIdId?: number
  ) {
    this.isDeleted = this.isDeleted || false;
  }
}
