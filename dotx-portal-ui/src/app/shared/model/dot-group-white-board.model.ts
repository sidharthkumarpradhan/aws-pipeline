import { Moment } from 'moment';

export interface IDotGroupWhiteBoard {
  id?: number;
  boardId?: number;
  boardTitle?: string;
  contentFilePath?: string;
  createdBy?: string;
  createdDate?: Moment;
  lastmodifiedBy?: string;
  lastmodifiedDate?: Moment;
  groupIdId?: number;
}

export class DotGroupWhiteBoard implements IDotGroupWhiteBoard {
  constructor(
    public id?: number,
    public boardId?: number,
    public boardTitle?: string,
    public contentFilePath?: string,
    public createdBy?: string,
    public createdDate?: Moment,
    public lastmodifiedBy?: string,
    public lastmodifiedDate?: Moment,
    public groupIdId?: number
  ) {}
}
