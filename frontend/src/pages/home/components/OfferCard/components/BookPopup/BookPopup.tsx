import { DatePicker } from '@gravity-ui/date-components';
import { DateTime, dateTime, dateTimeParse } from '@gravity-ui/date-utils';
import { Xmark } from '@gravity-ui/icons';
import {
    Alert,
    Button,
    Flex,
    Icon,
    Loader,
    Modal,
    Select,
    SelectOption,
    Skeleton,
    Text,
    useToaster,
} from '@gravity-ui/uikit';
import { FC, memo, useEffect, useState } from 'react';
import { axiosInstance } from '~/axios';
import { IOffer } from '~/store/features/hotels/types';
import { resetOrder } from '~/store/features/order/orderSlice';
import { createOrder } from '~/store/features/order/thunk';
import { useAppDispatch, useAppSelector } from '~/store/store';

export interface IBookPopupProps {
    offer: IOffer;
    isOpen: boolean;
    setOpen: (open: boolean) => void;
}

const GUESTS_OPTIONS: SelectOption[] = [
    {
        value: '2-adults',
        content: '2 adult without children',
    },
    {
        value: '4-adults',
        content: '4 adult without children',
    },
];

const BookPopup: FC<IBookPopupProps> = ({ offer, isOpen, setOpen }) => {
    const [offerStatus, setOfferStatus] = useState<
        'loading' | 'ok' | 'booked' | null
    >(null);

    const { add } = useToaster();

    const dispatch = useAppDispatch();
    const { status: orderStatus } = useAppSelector((state) => state.order);
    const loading = orderStatus === 'loading';

    const handleCreateBooking = () => {
        dispatch(createOrder(offer));
    };

    const handleChangeOpen = (open: boolean) => {
        if (!open) {
            setOfferStatus(null);
            dispatch(resetOrder());
        }
        setOpen(open);
    };

    useEffect(() => {
        // axiosInstance
        //     .get(`/api/hotels/offers/${offer}`)
        //     .then(() => {
        //         setOfferStatus('ok');
        //     })
        //     .catch(() => {
        //         setOfferStatus('booked');
        //     });
        if (isOpen) {
            setOfferStatus('loading');
            setTimeout(() => {
                setOfferStatus('ok');
            }, 2000);
        }
    }, [isOpen]);

    useEffect(() => {
        if (orderStatus === 'success') {
            add({
                title: 'Successfull booking',
                theme: 'success',
                content: (
                    <Button size="l" view="normal">
                        <Text variant="subheader-1">Show my bookings</Text>
                    </Button>
                ),
                name: 'booking-success',
            });

            handleChangeOpen(false);
        }
    }, [orderStatus]);

    return (
        <Modal open={isOpen} onOpenChange={handleChangeOpen}>
            {offerStatus === 'loading' && (
                <div style={{ padding: 16 }}>
                    <Loader />
                </div>
            )}
            {(offerStatus === 'ok' || offerStatus === 'booked') && (
                <div style={{ padding: 16, maxWidth: 400 }}>
                    <Flex direction="column" gap={4}>
                        <Text
                            variant="header-2"
                            style={{ alignSelf: 'center' }}
                        >
                            Create Booking
                        </Text>
                        <Text variant="header-1">{offer.hotel.name}</Text>

                        {offerStatus === 'booked' && (
                            <Alert
                                theme="danger"
                                title="Oops, this hotel has already been booked"
                                message="Sorry, but it seems that someone has already booked this hotel. Please, try other dates"
                            />
                        )}

                        <Flex
                            direction="column"
                            justifyContent="space-between"
                            gap={2}
                        >
                            <Flex gap={4}>
                                <DatePicker
                                    size="l"
                                    value={dateTimeParse(offer.checkInDate, {
                                        format: 'MM/DD/YYYY',
                                    })}
                                    readOnly
                                />
                                <DatePicker
                                    size="l"
                                    value={dateTimeParse(offer.checkOutDate, {
                                        format: 'MM/DD/YYYY',
                                    })}
                                    readOnly
                                />
                            </Flex>
                            <Select
                                size="l"
                                options={GUESTS_OPTIONS}
                                value={[GUESTS_OPTIONS[0].value]}
                                renderSelectedOption={(option) => (
                                    <Flex gap={1}>
                                        <Text variant="subheader-1">
                                            Guests:
                                        </Text>
                                        <Text>{option.content}</Text>
                                    </Flex>
                                )}
                            />
                        </Flex>

                        {offerStatus === 'ok' && (
                            <>
                                <Flex
                                    style={{
                                        backgroundColor:
                                            'var(--g-color-base-float)',
                                        borderRadius:
                                            'var(--g-border-radius-s)',
                                        padding: 12,
                                    }}
                                    alignSelf="stretch"
                                    alignItems="center"
                                    justifyContent="space-between"
                                >
                                    <Text variant="subheader-1">
                                        {offer.nights > 1
                                            ? `For ${offer.nights} nights`
                                            : 'For one night'}
                                    </Text>
                                    <Text variant="header-1">
                                        RUB {offer.price}
                                    </Text>
                                </Flex>

                                {orderStatus === 'error' && (
                                    <Alert
                                        theme="danger"
                                        title="Booking failed"
                                        message="Sorry, we couldn't save your booking."
                                    />
                                )}

                                {orderStatus === 'error' ? (
                                    <Button
                                        size="xl"
                                        view="normal"
                                        onClick={() => handleChangeOpen(false)}
                                    >
                                        <Text variant="subheader-2">
                                            Close window{' '}
                                        </Text>
                                        <Icon data={Xmark} />
                                    </Button>
                                ) : (
                                    <Button
                                        size="xl"
                                        view={loading ? 'normal' : 'action'}
                                        width="max"
                                        loading={loading}
                                        onClick={handleCreateBooking}
                                    >
                                        <Text variant="subheader-2">
                                            Create Booking
                                        </Text>
                                    </Button>
                                )}
                            </>
                        )}
                    </Flex>
                </div>
            )}
        </Modal>
    );
};

export default memo(BookPopup);
