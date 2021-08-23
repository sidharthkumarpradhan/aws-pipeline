export interface AuthState {
    tokenResponse: TokenResponse;
    userResponse?: any;
    userInfo?: any;
    menus?: Menus[];
    isLoggedIn?: boolean;
    userRole?: string;
  }

export interface Menus {
  label?: string;
  seq?: number;
  url?: string;
  sub_menu?: Menus[];
}

export class TokenResponse {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    token_type: string;
    scope: string;
}
