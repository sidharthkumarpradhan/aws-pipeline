import { Moment } from 'moment';

export interface IDotPersonalityQuiz {
  id?: number;
  quizId?: number;
  quizDescription?: string;
  quizFilePath?: string;
  quizOrder?: number;
  quizStatus?: boolean;
  option1?: string;
  option2?: string;
  option3?: string;
  option4?: string;
  option5?: string;
  option6?: string;
  option7?: string;
  option8?: string;
  option9?: string;
  option10?: string;
  isActive?: boolean;
  createdBy?: string;
  createdDate?: Moment;
  lastmodifiedBy?: string;
  lastmodifiedDate?: Moment;
}

export class DotPersonalityQuiz implements IDotPersonalityQuiz {
  constructor(
    public id?: number,
    public quizId?: number,
    public quizDescription?: string,
    public quizFilePath?: string,
    public quizOrder?: number,
    public quizStatus?: boolean,
    public option1?: string,
    public option2?: string,
    public option3?: string,
    public option4?: string,
    public isActive?: boolean,
    public createdBy?: string,
    public createdDate?: Moment,
    public lastmodifiedBy?: string,
    public lastmodifiedDate?: Moment
  ) {
    this.quizStatus = this.quizStatus || false;
    this.isActive = this.isActive || false;
  }
}
