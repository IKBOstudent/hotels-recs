import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '~/store/store';
import { IHotel, ISearchParams } from './types';

interface IHotelsSearchState {
    searchParams: ISearchParams | null;
    offers: IHotel[];
}

const initialState: IHotelsSearchState = {
    searchParams: null,
    offers: [],
};

const hotelsSearchSlice = createSlice({
    name: 'hotelsSearch',
    initialState,
    reducers: {
        setSearchParams(state, action: PayloadAction<ISearchParams>) {
            state.searchParams = action.payload;
        },
        updateSearchParams(
            state,
            action: PayloadAction<Partial<ISearchParams>>,
        ) {
            const { checkInDate, checkOutDate, queryString } = action.payload;
            const current = state.searchParams;
            if (current) {
                state.searchParams = {
                    checkInDate: checkInDate ?? current.checkInDate,
                    checkOutDate: checkOutDate ?? current.checkOutDate,
                    queryString: queryString ?? current.queryString,
                };
            }
            console.error('trying to update null state');
        },
        resetSearchParams(state) {
            state.searchParams = null;
        },
        setOffers(state, action: PayloadAction<IHotel[]>) {
            state.offers = action.payload;
        },
    },
});

export const {
    setSearchParams,
    updateSearchParams,
    resetSearchParams,
    setOffers,
} = hotelsSearchSlice.actions;
export default hotelsSearchSlice.reducer;

export const searchParamsSelector = (state: RootState) =>
    state.hotelsSearch.searchParams;
export const offersSelector = (state: RootState) => state.hotelsSearch.offers;
