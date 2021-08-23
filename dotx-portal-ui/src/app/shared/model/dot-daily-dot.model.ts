import { Moment } from 'moment';

export interface IDotDailyDot {
  id?: number;
  dailyDotId?: number;
  dailyDotType?: string;
  dailyDotName?: string;
  createdBy?: string;
  createdDate?: Moment;
  lastmodifiedBy?: string;
  lastmodifiedDate?: Moment;
  userIdId?: number;
}

export class DotDailyDot implements IDotDailyDot {
  constructor(
    public id?: number,
    public dailyDotId?: number,
    public dailyDotType?: string,
    public dailyDotName?: string,
    public createdBy?: string,
    public createdDate?: Moment,
    public lastmodifiedBy?: string,
    public lastmodifiedDate?: Moment,
    public userIdId?: number
  ) {}
}
