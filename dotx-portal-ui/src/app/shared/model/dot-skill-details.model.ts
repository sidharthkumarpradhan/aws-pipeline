import { Moment } from 'moment';

export interface IDotSkillDetails {
  id?: number;
  skillId?: number;
  skillName?: string;
  skillDescription?: string;
  skillCategory?: string;
  createdBy?: string;
  createdDate?: Moment;
  lastmodifiedBy?: string;
  lastmodifiedDate?: Moment;
  skill_file?: string;
}

export class DotSkillDetails implements IDotSkillDetails {
  constructor(
    public id?: number,
    public skillId?: number,
    public skillName?: string,
    public skillDescription?: string,
    public skillCategory?: string,
    public createdBy?: string,
    public createdDate?: Moment,
    public lastmodifiedBy?: string,
    public lastmodifiedDate?: Moment
  ) {}
}
