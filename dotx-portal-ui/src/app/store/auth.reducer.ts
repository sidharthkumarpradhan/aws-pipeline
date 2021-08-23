import { AuthState } from './auth.model';
import { AuthActions, AuthActionTypes } from './auth.action';

export const initialState: AuthState = {
    tokenResponse: {
        access_token: '',
        expires_in: 0,
        refresh_token: '',
        token_type: '',
        scope: '',
    },
    menus: [],
    isLoggedIn: false,
    userInfo: null,
    userResponse: null
};

export function reducer(state: AuthState = initialState, action: AuthActions): AuthState {
    switch (action.type) {
        case AuthActionTypes.AuthLoginType:
            return {
                ...state
            };
        case AuthActionTypes.AuthLoginSuccessType:

            sessionStorage.setItem('auth', JSON.stringify({ tokenResponse: { ...action.payload } }));
            return {
                ...state,
                isLoggedIn: true,
                tokenResponse: {
                    ...action.payload
                }
            };
        case AuthActionTypes.SetUserResponse:
            return {
                ...state,
                userResponse: action.payload
            };
        case AuthActionTypes.AuthLoginFailType:
                return {
                    ...initialState
            };
            case AuthActionTypes.SetUserDetailsType:
                return {
                    ...state,
                    userInfo: action.payload
            };
        case AuthActionTypes.AuthLogoutType: return initialState;
        default: return state;
    }
}
