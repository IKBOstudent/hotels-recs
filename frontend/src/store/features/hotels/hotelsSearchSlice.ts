import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '~/store/store';
import {
    IOffersState,
    ISearchHotelsRes,
    ISearchParams,
    ISearchParamsState,
} from './types';
import { dateTimeParse } from '@gravity-ui/date-utils';

interface IHotelsSearchState {
    searchParams: ISearchParamsState | null;
    offers: IOffersState;
}

const initialState: IHotelsSearchState = {
    searchParams: null,
    offers: {
        data: [],
        loading: true,
        error: null,
        viewedIds: [],
        hasMore: true,
    },
};

const hotelsSearchSlice = createSlice({
    name: 'hotelsSearch',
    initialState,
    reducers: {
        setSearchParams(state, action: PayloadAction<ISearchParamsState>) {
            state.searchParams = action.payload;
        },
        updateSearchParams(
            state,
            action: PayloadAction<Partial<ISearchParamsState>>,
        ) {
            const {
                checkInTimestamp,
                checkOutTimestamp,
                locationQuery,
                additionalQuery,
            } = action.payload;

            if (state.searchParams) {
                state.searchParams = {
                    checkInTimestamp:
                        checkInTimestamp ?? state.searchParams.checkInTimestamp,
                    checkOutTimestamp:
                        checkOutTimestamp ??
                        state.searchParams.checkOutTimestamp,
                    locationQuery:
                        locationQuery ?? state.searchParams.locationQuery,
                    additionalQuery:
                        additionalQuery ?? state.searchParams.additionalQuery,
                };
            }
            console.error('trying to update null state');
        },
        resetSearchParams(state) {
            state.searchParams = null;
        },
        setOffers(
            state,
            action: PayloadAction<ISearchHotelsRes & { reset: boolean }>,
        ) {
            if (action.payload.reset) {
                state.offers.data = action.payload.offers;
                state.offers.viewedIds = action.payload.offers.map(
                    (offer) => offer.hotel.id,
                );
            } else if (action.payload.hasMore) {
                state.offers.data = [
                    ...state.offers.data,
                    ...action.payload.offers,
                ];
                state.offers.viewedIds = [
                    ...state.offers.viewedIds,
                    ...action.payload.offers.map((offer) => offer.hotel.id),
                ];
            }
            state.offers.hasMore = action.payload.hasMore;
            state.offers.loading = false;
            state.offers.error = null;
        },
        setOffersLoading(state, action: PayloadAction<boolean>) {
            state.offers.loading = action.payload;
        },
        setOffersError(state, action: PayloadAction<string>) {
            state.offers.error = action.payload;
            state.offers.loading = false;
        },
    },
});

export const {
    setSearchParams,
    updateSearchParams,
    resetSearchParams,
    setOffers,
    setOffersLoading,
    setOffersError,
} = hotelsSearchSlice.actions;

export default hotelsSearchSlice.reducer;

export const offersSelector = (state: RootState) => state.hotelsSearch.offers;
export const viewedIdsSelector = (state: RootState) =>
    state.hotelsSearch.offers.viewedIds;

export const searchParamsSelector = createSelector(
    [
        (state: RootState) => state.hotelsSearch.searchParams?.locationQuery,
        (state: RootState) => state.hotelsSearch.searchParams?.additionalQuery,
        (state: RootState) => state.hotelsSearch.searchParams?.checkInTimestamp,
        (state: RootState) =>
            state.hotelsSearch.searchParams?.checkOutTimestamp,
    ],
    (
        locationQuery,
        additionalQuery,
        checkInTimestamp,
        checkOutTimestamp,
    ): ISearchParams | undefined => {
        const start = dateTimeParse(checkInTimestamp);
        const end = dateTimeParse(checkOutTimestamp);
        if (locationQuery && start && end) {
            return {
                locationQuery,
                additionalQuery,
                datesRange: { start, end },
            };
        }

        return;
    },
);
