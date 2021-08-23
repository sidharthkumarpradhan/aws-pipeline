import { Moment } from 'moment';

export interface IDotTopicResponse {
  id?: number;
  topicResponseId?: number;
  responseDescription?: string;
  dateOfResponse?: Moment;
  responseRating?: number;
  createdBy?: string;
  createdDate?: Moment;
  lastmodifiedBy?: string;
  lastmodifiedDate?: Moment;
  topicAssignIdId?: number;
}

export class DotTopicResponse implements IDotTopicResponse {
  constructor(
    public id?: number,
    public topicResponseId?: number,
    public responseDescription?: string,
    public dateOfResponse?: Moment,
    public responseRating?: number,
    public createdBy?: string,
    public createdDate?: Moment,
    public lastmodifiedBy?: string,
    public lastmodifiedDate?: Moment,
    public topicAssignIdId?: number
  ) {}
}
