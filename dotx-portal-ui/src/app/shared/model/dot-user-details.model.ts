import { Moment } from 'moment';

export interface IDotUserDetails {
  id?: number;
  userId?: number;
  userCode?: string;
  userType?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  displayName?: string;
  gender?: string;
  userPhoneNum?: string;
  userEmail?: string;
  userGmail?: string;
  dateOfCreation?: Moment;
  userDob?: string;
  dateOfExit?: Moment;
  userLoginId?: string;
  userPassword?: string;
  isTempPasswd?: boolean;
  userLoginWithgmail?: boolean;
  userLoginUserId?: boolean;
  schoolName?: string;
  classDetails?: string;
  avatarImageFile?: string;
  createdBy?: string;
  createdDate?: Moment;
  lastmodifiedBy?: string;
  lastmodifiedDate?: Moment;
  joincodeIdId?: number;
}

export class DotUserDetails implements IDotUserDetails {
  constructor(
    public id?: number,
    public userId?: number,
    public userCode?: string,
    public userType?: string,
    public firstName?: string,
    public middleName?: string,
    public lastName?: string,
    public displayName?: string,
    public gender?: string,
    public userPhoneNum?: string,
    public userEmail?: string,
    public userGmail?: string,
    public dateOfCreation?: Moment,
    public dateOfExit?: Moment,
    public userLoginId?: string,
    public userPassword?: string,
    public isTempPasswd?: boolean,
    public userLoginWithgmail?: boolean,
    public userLoginUserId?: boolean,
    public schoolName?: string,
    public classDetails?: string,
    public avatarImageFile?: string,
    public createdBy?: string,
    public createdDate?: Moment,
    public lastmodifiedBy?: string,
    public lastmodifiedDate?: Moment,
    public joincodeIdId?: number
  ) {
    this.isTempPasswd = this.isTempPasswd || false;
    this.userLoginWithgmail = this.userLoginWithgmail || false;
    this.userLoginUserId = this.userLoginUserId || false;
  }
}
