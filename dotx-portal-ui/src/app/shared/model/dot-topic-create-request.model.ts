import { Moment } from 'moment';

export interface IDotTopicCreateRequest {
  id?: number;
  requestId?: number;
  requestType?: string;
  requestName?: string;
  requestDescription?: string;
  requestedBy?: string;
  requestedDate?: Moment;
  requestStatus?: string;
  createdBy?: string;
  createdDate?: Moment;
  lastmodifiedBy?: string;
  lastmodifiedDate?: Moment;
}

export class DotTopicCreateRequest implements IDotTopicCreateRequest {
  constructor(
    public id?: number,
    public requestId?: number,
    public requestType?: string,
    public requestName?: string,
    public requestDescription?: string,
    public requestedBy?: string,
    public requestedDate?: Moment,
    public requestStatus?: string,
    public createdBy?: string,
    public createdDate?: Moment,
    public lastmodifiedBy?: string,
    public lastmodifiedDate?: Moment
  ) {}
}
