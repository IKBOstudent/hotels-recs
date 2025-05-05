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
import { ISearchParams } from '~/store/features/hotels/types';
import { Magnifier } from '@gravity-ui/icons';

import styles from './SearchForm.module.scss';

interface FormData {
    queryString: string;
    range: RangeValue<DateTime>;
}

export const SearchForm: React.FC = () => {
    const dispatch = useAppDispatch();

    const searchParams = useAppSelector(searchParamsSelector);
    const initalRange = searchParams
        ? { start: searchParams.checkInDate, end: searchParams.checkOutDate }
        : undefined;

    const {
        control,
        handleSubmit,
        formState: { isValid },
    } = useForm<FormData>({
        shouldUnregister: false,
        defaultValues: {
            queryString: searchParams?.queryString,
            range: initalRange,
        },
    });

    const onSubmit = ({ queryString, range }: FormData) => {
        console.log(queryString, range);

        const newSearchParams: ISearchParams = {
            queryString,
            checkInDate: range.start,
            checkOutDate: range.end,
        };
        dispatch(setSearchParams(newSearchParams));
    };

    const handleChange = ({ queryString, range }: Partial<FormData>) => {
        if (!searchParams) {
            return;
        }

        const updatedSearchParams: Partial<ISearchParams> = {
            queryString,
            checkInDate: range?.start,
            checkOutDate: range?.end,
        };
        dispatch(updateSearchParams(updatedSearchParams));
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Flex
                width="fit-content"
                direction="column"
                gap={2}
                style={{
                    padding: 12,
                    minWidth: searchParams ? 230 : 250,
                }}
            >
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
                    name="range"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <RangeDatePicker
                            {...field}
                            onUpdate={(val) => {
                                field.onChange(val);
                                handleChange({ range: val ?? undefined });
                            }}
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
