import React, { useEffect } from 'react';
import { Header } from '~/components/Header/Header';
import { SearchForm } from '~/components/SearchForm/SearchForm';
import { searchParamsSelector } from '~/store/features/hotels/hotelsSearchSlice';
import { useAppSelector } from '~/store/store';
import HotelsScroll from './components/Offers/Offers';

export const HomePage: React.FC = () => {
    // const offers = useAppSelector(offersSelector);
    const searchParams = useAppSelector(searchParamsSelector);

    useEffect(() => {
        console.log('searchParams new', searchParams);
    }, [searchParams]);

    return <>{searchParams ? <HotelsScroll /> : <SearchForm />}</>;
};
