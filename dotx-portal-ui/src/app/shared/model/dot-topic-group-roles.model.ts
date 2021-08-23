import { Moment } from 'moment';

export interface IDotTopicGroupRoles {
  id?: number;
  groupRoleId?: number;
  roleName?: string;
  roleDescription?: string;
  roleAvatar?: string;
  roleGuidelines?: string;
  roleAssignedTo?: string;
  roleAssignedDate?: Moment;
  roleStatus?: string;
  isActive?: boolean;
  createdBy?: string;
  createdDate?: Moment;
  lastmodifiedBy?: string;
  lastmodifiedDate?: Moment;
  groupIdId?: number;
}

export class DotTopicGroupRoles implements IDotTopicGroupRoles {
  constructor(
    public id?: number,
    public groupRoleId?: number,
    public roleName?: string,
    public roleDescription?: string,
    public roleAvatar?: string,
    public roleGuidelines?: string,
    public roleAssignedTo?: string,
    public roleAssignedDate?: Moment,
    public roleStatus?: string,
    public isActive?: boolean,
    public createdBy?: string,
    public createdDate?: Moment,
    public lastmodifiedBy?: string,
    public lastmodifiedDate?: Moment,
    public groupIdId?: number
  ) {
    this.isActive = this.isActive || false;
  }
}
