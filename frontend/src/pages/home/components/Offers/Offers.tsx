import { Button, Flex, Icon, Spin, Text } from '@gravity-ui/uikit';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import OfferCard from '../OfferCard/OfferCard';
import OfferCardSkeleton from '../OfferCard/OfferCardSkeleton';
import { ArrowDown, ArrowRotateRight } from '@gravity-ui/icons';

import debounce from 'lodash/debounce';

import styles from './Offers.module.scss';
import { useAppDispatch, useAppSelector } from '~/store/store';
import { offersSelector } from '~/store/features/hotels/hotelsSearchSlice';
import { searchHotels } from '~/store/features/hotels/thunk';

interface OffersProps {
    // searchParams:
    setFloatersVisible: (val: boolean) => void;
}

const Offers: React.FC<OffersProps> = ({ setFloatersVisible }) => {
    const dispatch = useAppDispatch();

    const { data, loading, error, hasMore } = useAppSelector(offersSelector);

    const { ref: loaderRef, inView: loaderInView } = useInView({
        threshold: 0.1,
    });

    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setFloatersVisible(true);

        const onScroll = () => {
            setFloatersVisible(false);
        };

        const onScrollEnd = () => {
            setFloatersVisible(true);
        };

        containerRef?.current?.addEventListener('scroll', onScroll, {
            passive: true,
        });
        containerRef?.current?.addEventListener('scrollend', onScrollEnd, {
            passive: true,
        });
        return () => {
            containerRef?.current?.removeEventListener('scroll', onScroll);
            containerRef?.current?.removeEventListener(
                'scrollend',
                onScrollEnd,
            );
        };
    }, []);

    useEffect(() => {
        if (loaderInView) {
            console.log('skeleton in view');
            dispatch(searchHotels());
        }
    }, [loaderInView]);

    const array = hasMore && !error ? [...data, undefined] : data;

    return (
        <div ref={containerRef} className={styles.container}>
            {array.map((offer) =>
                offer ? (
                    <div key={offer.hotel.id} className={styles.item}>
                        <OfferCard offer={offer} />
                    </div>
                ) : (
                    <div ref={loaderRef} className={styles.item}>
                        <OfferCardSkeleton />
                    </div>
                ),
            )}

            {error && (
                <Flex
                    className={styles.item}
                    justifyContent="center"
                    alignItems="center"
                    direction="column"
                    style={{
                        paddingTop: 48,
                        paddingBottom: 48,
                        minHeight: '100vh',
                        paddingLeft: 16,
                        paddingRight: 16,
                    }}
                    gap={4}
                >
                    <Text ellipsis variant="display-1">
                        An error occurred!
                    </Text>
                    <Text variant="subheader-3">Try again later...</Text>
                    <Button
                        size="l"
                        style={{ width: 'fit-content' }}
                        onClick={() => window.location.reload()}
                    >
                        <Text>Reload page</Text>
                        <Icon data={ArrowRotateRight} />
                    </Button>
                </Flex>
            )}
        </div>
    );
};

export default Offers;
