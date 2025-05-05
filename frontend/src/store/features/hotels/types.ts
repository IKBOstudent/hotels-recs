import { DateTime } from '@gravity-ui/date-utils';

export interface IHotel {
    id: number;
    name: string;
    city: string;
    address: string;
    description: string;
    aspects: string;
}

export interface ISearchParams {
    checkInDate: DateTime;
    checkOutDate: DateTime;
    queryString: string;
}
