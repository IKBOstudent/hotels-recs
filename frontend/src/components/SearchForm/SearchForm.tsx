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
import { Magnifier } from '@gravity-ui/icons';

import styles from './SearchForm.module.scss';
import debounce from 'lodash/debounce';

interface FormData {
    queryString: string;
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
            queryString: '',
            datesRange: undefined,
        },
    });

    const onSubmit = ({ queryString, datesRange }: FormData) => {
        const newSearchParams: ISearchParamsState = {
            queryString,
            checkInTimestamp: datesRange.start.valueOf(),
            checkOutTimestamp: datesRange.end.valueOf(),
        };
        dispatch(setSearchParams(newSearchParams));
    };

    const handleChange = debounce(
        ({ queryString, datesRange }: Partial<FormData>) => {
            if (!searchParams) {
                return;
            }

            const updatedSearchParams: Partial<ISearchParamsState> = {
                queryString,
                checkInTimestamp: datesRange?.start.valueOf(),
                checkOutTimestamp: datesRange?.end.valueOf(),
            };
            dispatch(updateSearchParams(updatedSearchParams));
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
                <Controller
                    name="queryString"
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
                                        data={Magnifier}
                                        size={16}
                                        className={styles.searchIcon}
                                    />
                                </Text>
                            }
                            {...field}
                            onChange={(e) => {
                                field.onChange(e);
                                handleChange({ queryString: e.target.value });
                            }}
                            size="l"
                            placeholder="Search"
                        />
                    )}
                />

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
