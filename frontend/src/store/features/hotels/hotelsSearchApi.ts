import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IHotel, ISearchParams } from './types';

export const hotelsSearchApi = createApi({
    reducerPath: 'hotelsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_DEV_SERVER,
        credentials: 'include',
    }),
    endpoints: (builder) => ({
        searchHotels: builder.mutation<IHotel[], ISearchParams>({
            query: ({ checkInDate, checkOutDate, queryString }) => ({
                url: '/api/hotels/search',
                method: 'POST',
                body: {
                    checkInDate: checkInDate.format('MM/DD/YYYY'),
                    checkOutDate: checkOutDate.format('MM/DD/YYYY'),
                    queryString,
                },
            }),
        }),
    }),
});

export const { useSearchHotelsMutation } = hotelsSearchApi;
