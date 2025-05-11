import React from 'react';
import { Button, Flex, Icon, Text } from '@gravity-ui/uikit';
import { Link } from 'react-router-dom';
import URLs from '~/constants/URLs';
import { ArrowUpRightFromSquare } from '@gravity-ui/icons';

export const NotFoundPage: React.FC = () => {
    return (
        <Flex
            justifyContent="center"
            alignItems="center"
            direction="column"
            style={{
                paddingTop: 48,
                paddingBottom: 48,
                minHeight: '100vh',
                paddingLeft: 16,
                paddingRight: 16,
            }}
            gap={4}
        >
            <Text variant="header-1">404 | Page not found</Text>
            <Link role="button" to={URLs.HomeRoot}>
                <Button size="l">
                    <Text>Back to home</Text>
                    <Icon data={ArrowUpRightFromSquare} />
                </Button>
            </Link>
        </Flex>
    );
};
