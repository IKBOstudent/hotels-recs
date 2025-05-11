import { IOffer } from '../hotels/types';

export interface IOrder {
    offer: IOffer;
    status: 'created' | 'canceled';
}

export interface ICreateOrderReq {
    offerId: number;
}
