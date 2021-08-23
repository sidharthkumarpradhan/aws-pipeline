import { Moment } from 'moment';

export interface IDotGroupResponses {
  id?: number;
  groupResponseId?: number;
  createdBy?: string;
  createdDate?: Moment;
  lastmodifiedBy?: string;
  lastmodifiedDate?: Moment;
  groupIdId?: number;
  topicResponseIdId?: number;
}

export class DotGroupResponses implements IDotGroupResponses {
  constructor(
    public id?: number,
    public groupResponseId?: number,
    public createdBy?: string,
    public createdDate?: Moment,
    public lastmodifiedBy?: string,
    public lastmodifiedDate?: Moment,
    public groupIdId?: number,
    public topicResponseIdId?: number
  ) {}
}
