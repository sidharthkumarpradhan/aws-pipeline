import { Moment } from 'moment';

export interface IDotTopicDetails {
  id?: number;
  topicId?: number;
  topicType?: string;
  topicName?: string;
  topicDescription?: string;
  topicDuration?: number;
  topicEarningTitle?: string;
  topicEarningBadge?: string;
  topicDotCoins?: number;
  topicStatus?: string;
  isActive?: boolean;
  parentTopicId?: number;
  topicSeq?: number;
  topicImage?: string;
  createdBy?: string;
  createdDate?: Moment;
  lastmodifiedBy?: string;
  lastmodifiedDate?: Moment;
  requestIdId?: number;
}

export class DotTopicDetails implements IDotTopicDetails {
  constructor(
    public id?: number,
    public topicId?: number,
    public topicType?: string,
    public topicName?: string,
    public topicDescription?: string,
    public topicDuration?: number,
    public topicEarningTitle?: string,
    public topicEarningBadge?: string,
    public topicDotCoins?: number,
    public topicStatus?: string,
    public isActive?: boolean,
    public parentTopicId?: number,
    public topicSeq?: number,
    public topicImage?: string,
    public createdBy?: string,
    public createdDate?: Moment,
    public lastmodifiedBy?: string,
    public lastmodifiedDate?: Moment,
    public requestIdId?: number
  ) {
    this.isActive = this.isActive || false;
  }
}
