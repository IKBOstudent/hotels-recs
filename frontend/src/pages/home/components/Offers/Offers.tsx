import { Icon, Spin, Text } from '@gravity-ui/uikit';
import React, { useCallback, useEffect, useState } from 'react';
import { useSearchHotelsMutation } from '~/store/features/hotels/hotelApi';
import { useInView } from 'react-intersection-observer';
import { IHotel } from '~/store/features/hotels/types';
import HotelCard from '../HotelCard/HotelCard';
import HotelCardSkeleton from '../HotelCardSkeleton/HotelCardSkeleton';
import { ArrowDown } from '@gravity-ui/icons';

import styles from './Offers.module.scss';
import { Header } from '~/components/Header/Header';

interface HotelsScrollProps {}

const HotelsScroll: React.FC<HotelsScrollProps> = () => {
    // const [hotels, setHotels] = useState<IHotel[]>([]);
    // const [viewedIds, setViewedIds] = useState<number[]>([]);

    // const [searchHotels, { isLoading }] = useSearchHotelsMutation();

    const { ref, inView } = useInView({
        threshold: 0.1,
    });

    // const loadMoreHotels = useCallback(async () => {
    //     if (isLoading) return;

    //     try {
    //         const hotels = await searchHotels({
    //             queryString,
    //             checkInDate: '',
    //             checkOutDate: '',
    //         }).unwrap();

    //         if (hotels && hotels.length > 0) {
    //             setHotels((prev) => [...prev, ...hotels]);
    //             setViewedIds((prev) => [...prev, ...hotels.map((h) => h.id)]);
    //         }
    //     } catch (error) {
    //         console.error('Failed to load hotels:', error);
    //     }
    // }, [keywords, viewedIds, isLoading, searchHotels]);

    // useEffect(() => {
    //     loadMoreHotels();
    // }, []);

    useEffect(() => {
        if (inView) {
            console.log('in view');
        }
    }, [inView]);

    return (
        <div className={styles.container}>
            <div
                style={{ position: 'fixed', top: 0, width: '100%', zIndex: 3 }}
            >
                <Header />
            </div>
            {[...Array(3)].map((_, index) => (
                <div key={index}>
                    <HotelCard />
                    <div></div>
                </div>
            ))}
            <div>
                <HotelCardSkeleton />
            </div>
        </div>
    );
};

export default HotelsScroll;
