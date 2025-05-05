import { Flex } from '@gravity-ui/uikit';
import React from 'react';
import ProfilePopup from './components/ProfilePopup/ProfilePopup';

import SearchPopup from './components/SearchPopup/SearchPopup';

import styles from './Header.module.scss';

export const Header: React.FC = () => {
    return (
        <Flex
            alignItems="center"
            justifyContent="space-between"
            className={styles.container}
        >
            <div>
                <SearchPopup />
            </div>
            <div>
                <ProfilePopup />
            </div>
        </Flex>
    );
};
