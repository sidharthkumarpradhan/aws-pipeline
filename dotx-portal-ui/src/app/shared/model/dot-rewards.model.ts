import { Moment } from 'moment';

export interface IDotRewards {
  id?: number;
  rewardId?: number;
  rewardName?: string;
  rewardDescription?: string;
  rewardType?: string;
  rewardPoints?: number;
  createdBy?: string;
  createdDate?: Moment;
  lastmodifiedBy?: string;
  lastmodifiedDate?: Moment;
}

export class DotRewards implements IDotRewards {
  constructor(
    public id?: number,
    public rewardId?: number,
    public rewardName?: string,
    public rewardDescription?: string,
    public rewardType?: string,
    public rewardPoints?: number,
    public createdBy?: string,
    public createdDate?: Moment,
    public lastmodifiedBy?: string,
    public lastmodifiedDate?: Moment
  ) {}
}
