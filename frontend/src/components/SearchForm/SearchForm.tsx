import React from 'react';
import { RangeDatePicker, RangeValue } from '@gravity-ui/date-components';
import { DateTime, dateTime } from '@gravity-ui/date-utils';
import { Button, Flex, Icon, Text, TextInput } from '@gravity-ui/uikit';
import { Controller, useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '~/store/store';
import {
    searchParamsSelector,
    setSearchParams,
    updateSearchParams,
} from '~/store/features/hotels/hotelsSearchSlice';
import { ISearchParamsState } from '~/store/features/hotels/types';
import { MapPin, Star } from '@gravity-ui/icons';

import styles from './SearchForm.module.scss';
import debounce from 'lodash/debounce';
import { searchHotels } from '~/store/features/hotels/thunk';

interface FormData {
    locationQuery: string;
    additionalQuery?: string;
    datesRange: RangeValue<DateTime>;
}

export const SearchForm: React.FC = () => {
    const dispatch = useAppDispatch();

    const searchParams = useAppSelector(searchParamsSelector);

    const {
        control,
        handleSubmit,
        formState: { isValid },
    } = useForm<FormData>({
        shouldUnregister: false,
        defaultValues: searchParams || {
            locationQuery: '',
            additionalQuery: '',
            datesRange: undefined,
        },
    });

    const onSubmit = ({
        locationQuery,
        additionalQuery,
        datesRange,
    }: FormData) => {
        const newSearchParams: ISearchParamsState = {
            locationQuery,
            additionalQuery,
            checkInTimestamp: datesRange.start.valueOf(),
            checkOutTimestamp: datesRange.end.valueOf(),
        };
        dispatch(setSearchParams(newSearchParams));
    };

    const handleChange = debounce(
        ({ locationQuery, additionalQuery, datesRange }: Partial<FormData>) => {
            if (!searchParams) {
                return;
            }

            const updatedSearchParams: Partial<ISearchParamsState> = {
                locationQuery,
                additionalQuery,
                checkInTimestamp: datesRange?.start.valueOf(),
                checkOutTimestamp: datesRange?.end.valueOf(),
            };
            dispatch(updateSearchParams(updatedSearchParams));
            dispatch(searchHotels(true));
        },
        200,
    );

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Flex
                width="fit-content"
                direction="column"
                gap={2}
                style={{
                    padding: 12,
                    minWidth: searchParams ? 250 : 280,
                }}
            >
                {!searchParams && (
                    <Text variant="header-1" style={{ alignSelf: 'center' }}>
                        Search Hotels Anywhere
                    </Text>
                )}
                <Flex direction={searchParams ? 'column' : 'row'} gap={2}>
                    <Controller
                        name="locationQuery"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <TextInput
                                startContent={
                                    <Text
                                        color="secondary"
                                        style={{ display: 'flex' }}
                                    >
                                        <Icon
                                            data={MapPin}
                                            size={16}
                                            className={styles.searchIcon}
                                        />
                                    </Text>
                                }
                                {...field}
                                onChange={(e) => {
                                    field.onChange(e);
                                    handleChange({
                                        locationQuery: e.target.value,
                                    });
                                }}
                                size="l"
                                placeholder="Location"
                            />
                        )}
                    />

                    <Controller
                        name="additionalQuery"
                        control={control}
                        render={({ field }) => (
                            <TextInput
                                startContent={
                                    <Text
                                        color="secondary"
                                        style={{ display: 'flex' }}
                                    >
                                        <Icon
                                            data={Star}
                                            size={16}
                                            className={styles.searchIcon}
                                        />
                                    </Text>
                                }
                                {...field}
                                onChange={(e) => {
                                    field.onChange(e);
                                    handleChange({
                                        additionalQuery: e.target.value,
                                    });
                                }}
                                size="l"
                                placeholder="Features"
                            />
                        )}
                    />
                </Flex>

                <Controller
                    name="datesRange"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <RangeDatePicker
                            {...field}
                            onUpdate={(val) => {
                                field.onChange(val);
                                handleChange({ datesRange: val ?? undefined });
                            }}
                            popupClassName={styles.calendar}
                            minValue={dateTime()}
                            size="l"
                        />
                    )}
                />

                {!searchParams && (
                    <Button
                        type="submit"
                        size="l"
                        view="action"
                        disabled={!isValid}
                    >
                        <Text variant="body-2">Search</Text>
                    </Button>
                )}
            </Flex>
        </form>
    );
};
