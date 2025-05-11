import { AppThunk } from '~/store/store';
import { addOrder, setStatus } from './orderSlice';
import { IOffer } from '../hotels/types';
import { ICreateOrderReq } from './types';
import { axiosInstance } from '~/axios';

export const createOrder =
    (offer: IOffer): AppThunk =>
    async (dispatch) => {
        try {
            dispatch(setStatus('loading'));
            // const { data } = await axiosInstance.post<ICreateOrderReq>(
            //     '/api/hotels/orders',
            //     {
            //         offerId: offer.id,
            //     },
            // );
            // dispatch(addOrder({ offer }));
            throw new Error('babab');
            setTimeout(
                () => dispatch(addOrder({ offer, status: 'created' })),
                2000,
            );
        } catch (e) {
            let message = 'Unexpected booking error';
            if (e instanceof Error) {
                message = e.message;
            }
            console.error('Booking request failed:', message);
            dispatch(setStatus('error'));
        }
    };
