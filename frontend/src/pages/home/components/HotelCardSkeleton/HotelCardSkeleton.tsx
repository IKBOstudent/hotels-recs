import { Flex, Skeleton } from '@gravity-ui/uikit';
import { FC, memo } from 'react';

export interface IHotelCardSkeletonProps {}

const HotelCardSkeleton: FC<IHotelCardSkeletonProps> = () => {
    return (
        <Flex
            direction="column"
            justifyContent="end"
            style={{
                height: '100vh',
                width: '100%',
                position: 'relative',
                scrollSnapAlign: 'start',
                padding: 12,
            }}
        >
            <Flex direction="column" gap={4} style={{ width: '100%' }}>
                <Skeleton style={{ alignSelf: 'end', width: 50, height: 50 }} />
                <Skeleton style={{ alignSelf: 'end', width: 50, height: 50 }} />
                <Flex direction="column" gap={2}>
                    <Skeleton style={{ width: '60%', height: 28 }} />
                    <Skeleton style={{ width: '40%', height: 24 }} />

                    <Flex direction="row" gap={2} alignItems="center">
                        <Skeleton
                            style={{
                                width: '100%',
                                height: 36,
                            }}
                        />
                        <Skeleton
                            style={{
                                width: '40%',
                                height: 44,
                            }}
                        />
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default memo(HotelCardSkeleton);
