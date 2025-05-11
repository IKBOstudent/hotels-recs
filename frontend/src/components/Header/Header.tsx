import { Flex } from '@gravity-ui/uikit';
import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import ProfilePopup from './components/ProfilePopup/ProfilePopup';

import SearchPopup from './components/SearchPopup/SearchPopup';

import styles from './Header.module.scss';

interface IHeaderProps {
    isVisible?: boolean;
}

export const Header: React.FC<IHeaderProps> = ({ isVisible }) => {
    return (
        <AnimatePresence initial={false}>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
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
                </motion.div>
            )}
        </AnimatePresence>
    );
};
