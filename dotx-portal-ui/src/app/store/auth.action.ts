import { Action } from '@ngrx/store';
import { TokenResponse } from './auth.model';


export class LoginDetails {
  email: string;
  password: string;
}

export enum AuthActionTypes {
    AuthLoginType = '[Auth] Login',
    AuthLoginSuccessType = '[Auth] Login Success',
    AuthLoginFailType = '[Auth] Login Fail',
    AuthLogoutType = '[Auth] Logout',
    RefreshTokenType = '[Auth] Refresh Token',
    SetUserResponse = '[Auth] User Response',
    SetUserDetailsType = '[Auth] User Details',
    AuthRefreshTokenSuccessType = '[Auth] Refresh Token Success',
  }

export class AuthLogin implements Action {
    readonly type = AuthActionTypes.AuthLoginType;
    constructor(public payload: LoginDetails) { }
  }
export class AuthLoginSuccess implements Action {
    readonly type = AuthActionTypes.AuthLoginSuccessType;
    constructor(public payload: TokenResponse) { }
  }

export class AuthLoginFail implements Action {
    readonly type = AuthActionTypes.AuthLoginFailType;
    constructor(public payload?: any) { }
  }
export class AuthLogout implements Action {
    readonly type = AuthActionTypes.AuthLogoutType;
    constructor() { }
  }
export class RefreshToken implements Action {
    readonly type = AuthActionTypes.RefreshTokenType;
    constructor() { }
  }

export class SetUser implements Action {
    readonly type = AuthActionTypes.SetUserResponse;
    constructor(public payload: any) { }
  }

export class SetUserDetail implements Action {
    readonly type = AuthActionTypes.SetUserDetailsType;
    constructor(public payload: any) { }
  }

export type AuthActions =
  | AuthLogin
  | AuthLoginSuccess
  | AuthLoginFail
  | AuthLogout
  | SetUser
  | SetUserDetail
  | RefreshToken;
