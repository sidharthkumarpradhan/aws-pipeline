import { Moment } from 'moment';

export interface IDotTopicAttachments {
  id?: number;
  topicAttachId?: number;
  attachmentTitle?: string;
  attachmentDescription?: string;
  attachmentFilePath?: string;
  createdBy?: string;
  createdDate?: Moment;
  lastmodifiedBy?: string;
  lastmodifiedDate?: Moment;
  topicIdId?: number;
}

export class DotTopicAttachments implements IDotTopicAttachments {
  constructor(
    public id?: number,
    public topicAttachId?: number,
    public attachmentTitle?: string,
    public attachmentDescription?: string,
    public attachmentFilePath?: string,
    public createdBy?: string,
    public createdDate?: Moment,
    public lastmodifiedBy?: string,
    public lastmodifiedDate?: Moment,
    public topicIdId?: number
  ) {}
}
