import { Divider, Flex, Skeleton } from '@gravity-ui/uikit';
import { FC, memo } from 'react';

import styles from './OfferCard.module.scss';

export interface IOfferCardSkeletonProps {}

const OfferCardSkeleton: FC<IOfferCardSkeletonProps> = () => {
    return (
        <Flex direction="column" justifyContent="end" className={styles.card}>
            <Flex
                direction="column"
                gap={4}
                style={{ width: '100%', padding: 12, zIndex: 2 }}
            >
                <Skeleton style={{ alignSelf: 'end', width: 44, height: 44 }} />
                <Skeleton style={{ alignSelf: 'end', width: 44, height: 44 }} />
                <Flex direction="column" gap={2}>
                    <Skeleton style={{ width: '60%', height: 28 }} />
                    <Skeleton style={{ width: '40%', height: 20 }} />
                    <Skeleton style={{ width: '40%', height: 24 }} />
                    <Divider orientation="horizontal" />
                    <Flex
                        direction="row"
                        gap={2}
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Flex direction="column" gap={1}>
                            <Skeleton style={{ width: 120, height: 24 }} />
                            <Skeleton style={{ width: 80, height: 20 }} />
                        </Flex>
                        <Skeleton
                            style={{
                                width: 92,
                                height: 44,
                                borderRadius: 'var(--g-border-radius-xl)',
                            }}
                        />
                    </Flex>
                    <Divider orientation="horizontal" />

                    <Skeleton style={{ width: '10%', height: 20 }} />
                    <Flex direction="column" gap={1}>
                        <Skeleton style={{ width: '100%', height: 20 }} />
                        <Skeleton style={{ width: 66, height: 24 }} />
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default memo(OfferCardSkeleton);
