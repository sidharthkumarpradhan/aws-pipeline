import { Moment } from 'moment';

export interface IDotStdPerQuizDetails {
  id?: number;
  studQuizId?: number;
  quizStatus?: string;
  quizStartDate?: Moment;
  quizCompletionDate?: Moment;
  createdBy?: string;
  createdDate?: Moment;
  lastmodifiedBy?: string;
  lastmodifiedDate?: Moment;
  quizResponse?: string;
  quizIdId?: number;
  userIdId?: number;
}

export class DotStdPerQuizDetails implements IDotStdPerQuizDetails {
  constructor(
    public id?: number,
    public studQuizId?: number,
    public quizStatus?: string,
    public quizStartDate?: Moment,
    public quizCompletionDate?: Moment,
    public createdBy?: string,
    public createdDate?: Moment,
    public lastmodifiedBy?: string,
    public lastmodifiedDate?: Moment,
    public quizResponse?: string,
    public quizIdId?: number,
    public userIdId?: number
  ) {}
}
