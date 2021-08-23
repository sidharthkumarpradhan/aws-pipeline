import { Moment } from 'moment';

export interface IDotUserSkills {
  id?: number;
  userSkillId?: number;
  isPrimary?: boolean;
  skillAchievements?: string;
  skillFile?: string;
  createdBy?: string;
  createdDate?: Moment;
  lastmodifiedBy?: string;
  lastmodifiedDate?: Moment;
  skillIdId?: number;
  userIdId?: number;
}

export class DotUserSkills implements IDotUserSkills {
  constructor(
    public id?: number,
    public userSkillId?: number,
    public isPrimary?: boolean,
    public skillAchievements?: string,
    public skillFile?: string,
    public createdBy?: string,
    public createdDate?: Moment,
    public lastmodifiedBy?: string,
    public lastmodifiedDate?: Moment,
    public skillIdId?: number,
    public userIdId?: number
  ) {
    this.isPrimary = this.isPrimary || false;
  }
}
