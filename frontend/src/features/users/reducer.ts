import { USERS_ERROR, USERS_LOADED, USERS_LOADING } from './actionTypes';
import type { UsersAction } from './actions';
import type { IUsersState } from './types';

const initialState: IUsersState = {
    error: null,
    items: [],
    loading: false
};

export function usersReducer(state: IUsersState = initialState, action: UsersAction): IUsersState {
    switch (action.type) {
    case USERS_ERROR:
        return { ...state,
            error: action.message,
            loading: false };
    case USERS_LOADED:
        return { ...state,
            error: null,
            items: action.items,
            loading: false };
    case USERS_LOADING:
        return { ...state,
            error: null,
            loading: true };
    default:
        return state;
    }
}
