import { Button, Flex, Icon, Text } from '@gravity-ui/uikit';
import { IHotel } from '~/store/features/hotels/types';
import React from 'react';
import { Comments, Heart } from '@gravity-ui/icons';

import styles from './HotelCard.module.scss';

interface HotelCardProps {
    // hotel: IHotel;
}

const HotelCard: React.FC<HotelCardProps> = ({}) => {
    const hotel = {
        id: 125,
        name: 'Hotel Name',
        city: 'moscow',
        address: '14, 5hdsfhfh, 555',
        description:
            'asdf pwoi hepsodjf lasdhfljkashdofiuasd lorem50sdflhasdlkfipsum dolor sit amet',
        aspects: 'Nice Stay Good Classy',
    };

    return (
        <Flex
            direction="column"
            justifyContent="end"
            style={{
                height: '100vh',
                width: '100%',
                position: 'relative',
                scrollSnapAlign: 'start',
            }}
        >
            <Flex
                direction="column"
                gap={4}
                style={{ width: '100%', padding: 12, zIndex: 2 }}
            >
                <Button view="flat" size="xl" style={{ alignSelf: 'end' }}>
                    <Icon data={Heart} size={24} />
                </Button>
                <Button view="flat" size="xl" style={{ alignSelf: 'end' }}>
                    <Icon data={Comments} size={24} />
                </Button>
                <Flex direction="column" gap={2}>
                    <Text variant="header-2">{hotel.name}</Text>
                    <Text variant="header-1">{hotel.address}</Text>

                    <Flex direction="row" gap={2} alignItems="center">
                        <Text variant="display-1">From 33,404 ₽</Text>
                        <Button view="action" size="xl">
                            Select
                        </Button>
                    </Flex>
                </Flex>
            </Flex>
            <div className={styles.imageContainer}>
                <img
                    src={''}
                    style={{
                        position: 'absolute',
                        height: '100%',
                        objectFit: 'fill',
                        zIndex: -1,
                    }}
                />
            </div>
        </Flex>
    );
};

export default HotelCard;
