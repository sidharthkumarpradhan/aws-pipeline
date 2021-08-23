import { AuthState } from './auth.model';
import { ActionReducerMap, ActionReducer } from '@ngrx/store';
import { reducer as authReducer } from './auth.reducer';
import { localStorageSync } from 'ngrx-store-localstorage';

export interface State {
    auth: AuthState;
  }
export const reducers: ActionReducerMap<State> = {
    auth: authReducer
  };

export function localStorageSyncReducer(
    reducer: ActionReducer<any>
  ): ActionReducer<any> {
    return localStorageSync({
      keys: [{
        auth: ['tokenResponse', 'userResponse', 'userInfo']
      }],
      rehydrate: true,
      storage: sessionStorage
    })(reducer);
  }
