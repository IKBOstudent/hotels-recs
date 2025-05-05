import { Flex, Spin } from '@gravity-ui/uikit';
import React from 'react';

export const MainLoader: React.FC = () => {
    return (
        <Flex
            justifyContent="center"
            alignItems="center"
            style={{ height: '60vh', width: '100vw', zIndex: 999 }}
        >
            <Spin size="xl" />
        </Flex>
    );
};
