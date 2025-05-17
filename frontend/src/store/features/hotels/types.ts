import { RangeValue } from '@gravity-ui/date-components';
import { DateTime } from '@gravity-ui/date-utils';

export interface IHotel {
    id: number;
    images: string[];
    rating: number;
    name: string;
    city: string;
    address: string;
    description: string;
    amenities: string[];
}

export interface IOffer {
    id: number;
    hotel: IHotel;
    checkInDate: string;
    checkOutDate: string;
    nights: number;
    price: number;
}

export interface IOffersState {
    data: IOffer[];
    loading: boolean;
    error: string | null;
    viewedIds: number[];
    hasMore: boolean;
}

export interface ISearchParamsState {
    checkInTimestamp: number;
    checkOutTimestamp: number;
    locationQuery: string;
    additionalQuery?: string;
}

export interface ISearchParams {
    datesRange: RangeValue<DateTime>;
    locationQuery: string;
    additionalQuery?: string;
}

export interface ISearchHotelsReq {
    locationQuery: string;
    additionalQuery?: string;
    checkInDate: string;
    checkOutDate: string;
    viewedIds: number[];
}

export interface ISearchHotelsRes {
    offers: IOffer[];
    hasMore: boolean;
}
