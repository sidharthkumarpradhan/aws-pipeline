import { Moment } from 'moment';

export interface IDotRewardAllocation {
  id?: number;
  rewardAllocId?: number;
  rewardAllocDate?: Moment;
  createdBy?: string;
  createdDate?: Moment;
  lastmodifiedBy?: string;
  lastmodifiedDate?: Moment;
  rewardSetupIdId?: number;
  userIdId?: number;
}

export class DotRewardAllocation implements IDotRewardAllocation {
  constructor(
    public id?: number,
    public rewardAllocId?: number,
    public rewardAllocDate?: Moment,
    public createdBy?: string,
    public createdDate?: Moment,
    public lastmodifiedBy?: string,
    public lastmodifiedDate?: Moment,
    public rewardSetupIdId?: number,
    public userIdId?: number
  ) {}
}
