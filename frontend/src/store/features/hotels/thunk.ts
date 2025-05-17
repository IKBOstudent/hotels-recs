import { AppThunk } from '~/store/store';
import { ISearchHotelsReq, ISearchHotelsRes } from './types';
import {
    searchParamsSelector,
    setOffers,
    setOffersError,
    setOffersLoading,
    viewedIdsSelector,
} from './hotelsSearchSlice';
import { AxiosResponse } from 'axios';
import axiosInstance from '~/axios';

export const searchHotels =
    (reset: boolean = false): AppThunk =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            const searchParams = searchParamsSelector(state);
            if (!searchParams) {
                return;
            }
            const { locationQuery, additionalQuery, datesRange } = searchParams;
            const viewedIds = viewedIdsSelector(state);

            dispatch(setOffersLoading(true));
            const { data } = await axiosInstance.post<
                ISearchHotelsReq,
                AxiosResponse<ISearchHotelsRes>
            >('http://localhost:8081/api/search', {
                locationQuery,
                additionalQuery,
                checkInDate: datesRange.start.format('YYYY-MM-DD'),
                checkOutDate: datesRange.end.format('YYYY-MM-DD'),
                skipHotels: viewedIds,
            });
            dispatch(setOffers({ ...data, reset }));
            // setTimeout(() => dispatch(setOffers({ offers, hasMore: true })), 2000);
        } catch (e) {
            let message = 'Unexpected search error';
            if (e instanceof Error) {
                message = e.message;
            }
            console.error('Search request failed:', message);
            dispatch(setOffersError(message));
        }
    };
