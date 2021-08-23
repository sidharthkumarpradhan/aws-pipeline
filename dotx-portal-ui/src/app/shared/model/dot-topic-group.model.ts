import { Moment } from 'moment';

export interface IDotTopicGroup {
  id?: number;
  groupId?: number;
  groupName?: string;
  groupDescription?: string;
  groupStatus?: string;
  groupOwner?: string;
  groupImage?: string;
  isActive?: boolean;
  createdBy?: string;
  createdDate?: Moment;
  lastmodifiedBy?: string;
  lastmodifiedDate?: Moment;
  topicIdId?: number;
}

export class DotTopicGroup implements IDotTopicGroup {
  constructor(
    public id?: number,
    public groupId?: number,
    public groupName?: string,
    public groupDescription?: string,
    public groupStatus?: string,
    public groupOwner?: string,
    public groupImage?: string,
    public isActive?: boolean,
    public createdBy?: string,
    public createdDate?: Moment,
    public lastmodifiedBy?: string,
    public lastmodifiedDate?: Moment,
    public topicIdId?: number
  ) {
    this.isActive = this.isActive || false;
  }
}
