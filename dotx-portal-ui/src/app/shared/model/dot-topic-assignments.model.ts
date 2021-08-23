import { Moment } from 'moment';

export interface IDotTopicAssignments {
  id?: number;
  topicAssignId?: number;
  assignmentStatus?: string;
  dateOfAssignment?: Moment;
  assignedBy?: string;
  createdBy?: string;
  assignFeedbackOption?: string;
  assignFeedbackNotes?: string;
  assignParentId?: number;
  createdDate?: Moment;
  lastmodifiedBy?: string;
  lastmodifiedDate?: Moment;
  joincodeIdId?: number;
  topicIdId?: number;
  userIdId?: number;
}

export class DotTopicAssignments implements IDotTopicAssignments {
  constructor(
    public id?: number,
    public topicAssignId?: number,
    public assignmentStatus?: string,
    public dateOfAssignment?: Moment,
    public assignedBy?: string,
    public createdBy?: string,
    public assignFeedbackOption?: string,
    public assignFeedbackNotes?: string,
    public assignParentId?: number,
    public createdDate?: Moment,
    public lastmodifiedBy?: string,
    public lastmodifiedDate?: Moment,
    public joincodeIdId?: number,
    public topicIdId?: number,
    public userIdId?: number
  ) {}
}
