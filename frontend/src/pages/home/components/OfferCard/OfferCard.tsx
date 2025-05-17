import { Button, Divider, Flex, Icon, Text } from '@gravity-ui/uikit';
import { IOffer } from '~/store/features/hotels/types';
import React, { useEffect, useState } from 'react';
import { Comments, Heart, StarFill } from '@gravity-ui/icons';

import styles from './OfferCard.module.scss';
import { CollapsibleText } from './components/CollapsibleText/CollapsibleText';
import { Gallery } from './components/Gallery/Gallery';
import BookPopup from './components/BookPopup/BookPopup';
import { useInView } from 'react-intersection-observer';

interface OfferCardProps {
    offer: IOffer;
    setCurrentOffer: (id: number) => void;
}

const OfferCard: React.FC<OfferCardProps> = ({ offer, setCurrentOffer }) => {
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const { ref, inView } = useInView({
        threshold: 0.1,
    });

    useEffect(() => {
        if (inView) {
            setCurrentOffer(offer.id);
        }
    }, [inView]);

    return (
        <div ref={ref}>
            <BookPopup
                offer={offer}
                isOpen={isModalOpen}
                setOpen={setModalOpen}
            />
            <Flex
                direction="column"
                justifyContent="end"
                className={styles.card}
            >
                <Flex
                    direction="column"
                    gap={4}
                    style={{
                        width: '100%',
                        padding: 12,
                        zIndex: 2,
                        pointerEvents: 'none',
                    }}
                >
                    <Button
                        view="flat"
                        size="xl"
                        style={{ alignSelf: 'end', pointerEvents: 'auto' }}
                    >
                        <Icon data={Heart} size={24} />
                    </Button>

                    <Button
                        view="flat"
                        size="xl"
                        style={{ alignSelf: 'end', pointerEvents: 'auto' }}
                    >
                        <Icon data={Comments} size={24} />
                    </Button>

                    <Flex direction="column" gap={2}>
                        <Text variant="header-2">{offer.hotel.name}</Text>

                        <Flex alignItems="center" gap={4}>
                            <Flex alignItems="center" gap={1}>
                                <Text color="brand">
                                    <Icon data={StarFill} size={16} />
                                </Text>

                                <Text variant="subheader-2">
                                    {offer.hotel.rating}
                                </Text>
                            </Flex>

                            <Text variant="body-2" color="secondary">
                                {45} reviews
                            </Text>
                        </Flex>

                        <Text variant="subheader-3">{offer.hotel.address}</Text>

                        <Divider orientation="horizontal" />

                        <Flex
                            direction="row"
                            gap={2}
                            alignItems="center"
                            justifyContent="space-between"
                        >
                            <Flex gap={1} direction="column" alignItems="start">
                                <Text variant="header-1" whiteSpace="nowrap">
                                    RUB {offer.price}
                                </Text>

                                <Text variant="body-2" color="secondary">
                                    {offer.nights > 1
                                        ? `For ${offer.nights} nights`
                                        : 'For one night'}
                                </Text>
                            </Flex>

                            <Button
                                view="action"
                                size="xl"
                                style={{ pointerEvents: 'auto' }}
                            >
                                <Text
                                    variant="subheader-2"
                                    onClick={() => setModalOpen(true)}
                                >
                                    Select
                                </Text>
                            </Button>
                        </Flex>

                        <Divider orientation="horizontal" />

                        <Flex direction="column" gap={2}>
                            <Text variant="body-2" color="secondary">
                                About
                            </Text>

                            <CollapsibleText text={offer.hotel.description} />
                        </Flex>
                    </Flex>
                </Flex>
                <Gallery images={offer.hotel.images} />
            </Flex>
        </div>
    );
};

export default OfferCard;
