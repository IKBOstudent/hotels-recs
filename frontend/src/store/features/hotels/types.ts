import { RangeValue } from '@gravity-ui/date-components';
import { DateTime } from '@gravity-ui/date-utils';

export interface IHotel {
    id: number;
    images: string[];
    name: string;
    city: string;
    address: string;
    description: string;
    aspects: string;
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
    queryString: string;
}

export interface ISearchParams {
    datesRange: RangeValue<DateTime>;
    queryString: string;
}

export interface ISearchHotelsReq {
    queryString: string;
    checkInDate: string;
    checkOutDate: string;
    viewedIds: number[];
}

export interface ISearchHotelsRes {
    offers: IOffer[];
    hasMore: boolean;
}
