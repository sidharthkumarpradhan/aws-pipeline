import { Moment } from 'moment';

export interface IDotRespAttachment {
  id?: number;
  respAttacmentId?: number;
  respAttachTitle?: string;
  respAttachDescription?: string;
  respAttachTilePath?: string;
  createdBy?: string;
  createdDate?: Moment;
  lastmodifiedBy?: string;
  lastmodifiedDate?: Moment;
  topicResponseIdId?: number;
}

export class DotRespAttachment implements IDotRespAttachment {
  constructor(
    public id?: number,
    public respAttacmentId?: number,
    public respAttachTitle?: string,
    public respAttachDescription?: string,
    public respAttachTilePath?: string,
    public createdBy?: string,
    public createdDate?: Moment,
    public lastmodifiedBy?: string,
    public lastmodifiedDate?: Moment,
    public topicResponseIdId?: number
  ) {}
}
