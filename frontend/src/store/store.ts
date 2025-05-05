import { configureStore, ThunkAction, UnknownAction } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { setupListeners } from '@reduxjs/toolkit/query';
import user from './features/user/userSlice';
import hotelsSearch from './features/hotels/hotelsSearchSlice';
import { hotelsSearchApi } from './features/hotels/hotelsSearchApi';

export const store = configureStore({
    reducer: {
        user,
        hotelsSearch,
        [hotelsSearchApi.reducerPath]: hotelsSearchApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat([hotelsSearchApi.middleware]),
});

setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    UnknownAction
>;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
