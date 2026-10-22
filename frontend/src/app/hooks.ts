// Типизированные хуки redux: компоненты импортируют только их.

import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';

import type { IAppState } from './types';

export const useAppDispatch: () => ThunkDispatch<IAppState, undefined, AnyAction> = useDispatch;
export const useAppSelector: TypedUseSelectorHook<IAppState> = useSelector;
