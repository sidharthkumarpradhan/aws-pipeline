import { Moment } from 'moment';

export interface IDotRewardSetup {
  id?: number;
  rewardSetupId?: number;
  effectiveDate?: Moment;
  expiryDate?: Moment;
  createdBy?: string;
  createdDate?: Moment;
  lastmodifiedBy?: string;
  lastmodifiedDate?: Moment;
  rewardIdId?: number;
  topicIdId?: number;
}

export class DotRewardSetup implements IDotRewardSetup {
  constructor(
    public id?: number,
    public rewardSetupId?: number,
    public effectiveDate?: Moment,
    public expiryDate?: Moment,
    public createdBy?: string,
    public createdDate?: Moment,
    public lastmodifiedBy?: string,
    public lastmodifiedDate?: Moment,
    public rewardIdId?: number,
    public topicIdId?: number
  ) {}
}
