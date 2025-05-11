import React, { useEffect, useState } from 'react';
import { Header } from '~/components/Header/Header';
import { SearchForm } from '~/components/SearchForm/SearchForm';
import { searchParamsSelector } from '~/store/features/hotels/hotelsSearchSlice';
import { useAppSelector } from '~/store/store';
import Offers from './components/Offers/Offers';
import { Flex } from '@gravity-ui/uikit';

export const HomePage: React.FC = () => {
    const searchParams = useAppSelector(searchParamsSelector);
    const [floatersVisible, setFloatersVisible] = useState<boolean>(false);

    useEffect(() => {
        console.log('searchParams update', searchParams);
    }, [searchParams]);

    return (
        <>
            <div
                style={{ position: 'fixed', top: 0, width: '100%', zIndex: 3 }}
            >
                <Header isVisible={floatersVisible} />
            </div>
            {searchParams ? (
                <Offers setFloatersVisible={setFloatersVisible} />
            ) : (
                <Flex
                    justifyContent="center"
                    alignItems="center"
                    style={{
                        paddingTop: 48,
                        paddingBottom: 48,
                        minHeight: '100vh',
                        paddingLeft: 16,
                        paddingRight: 16,
                    }}
                >
                    <SearchForm />
                </Flex>
            )}
        </>
    );
};
