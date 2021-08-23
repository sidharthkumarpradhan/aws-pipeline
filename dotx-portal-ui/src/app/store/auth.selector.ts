import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.model';

export const getAuthState = createFeatureSelector<AuthState>(
    'auth'
);

export const accessToken = createSelector(getAuthState, (state: AuthState) => state.tokenResponse.access_token);

export const expiresIn = createSelector(getAuthState, (state: AuthState) => state.tokenResponse.expires_in);

export const refreshToken = createSelector(getAuthState, (state: AuthState) => state.tokenResponse.refresh_token);

export const menus = createSelector(getAuthState, (state: AuthState) => state.menus);

export const isLoggedIn = createSelector(getAuthState, (state: AuthState) => state.isLoggedIn);

export const userRole = createSelector(getAuthState, (state: AuthState) => state.userRole);

export const userResponse = createSelector(getAuthState, (state: AuthState) => state.userResponse);

export const userInfo = createSelector(getAuthState, (state: AuthState) => state.userInfo);

