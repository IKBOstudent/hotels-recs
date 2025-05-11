import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IOrder } from './types';

interface OrderState {
    orders: IOrder[];
    status: 'loading' | 'success' | 'error' | null;
}

const initialState: OrderState = {
    orders: [],
    status: null,
};

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        addOrder(state, action: PayloadAction<IOrder>) {
            state.orders = [...state.orders, action.payload];
            state.status = 'success';
        },
        setStatus(
            state,
            action: PayloadAction<'loading' | 'success' | 'error'>,
        ) {
            state.status = action.payload;
        },
        resetOrder(state) {
            state.status = null;
        },
    },
});

export const { addOrder, setStatus, resetOrder } = orderSlice.actions;
export default orderSlice.reducer;
