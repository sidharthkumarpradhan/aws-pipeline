import { Moment } from 'moment';

export interface IDotTopicRatings {
  id?: number;
  topicRatingId?: number;
  ratingCategory?: string;
  ratingValue?: number;
  ratingComments?: string;
  createdBy?: string;
  createdDate?: Moment;
  lastmodifiedBy?: string;
  lastmodifiedDate?: Moment;
  topicIdId?: number;
  userIdId?: number;
}

export class DotTopicRatings implements IDotTopicRatings {
  constructor(
    public id?: number,
    public topicRatingId?: number,
    public ratingCategory?: string,
    public ratingValue?: number,
    public ratingComments?: string,
    public createdBy?: string,
    public createdDate?: Moment,
    public lastmodifiedBy?: string,
    public lastmodifiedDate?: Moment,
    public topicIdId?: number,
    public userIdId?: number
  ) {}
}
