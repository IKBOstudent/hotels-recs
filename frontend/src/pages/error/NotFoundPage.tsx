import React from 'react';
import { Button, Container, Flex, Icon, Text } from '@gravity-ui/uikit';
import { Link } from 'react-router-dom';
import URLs from '~/constants/URLs';
import { ArrowUpRightFromSquare } from '@gravity-ui/icons';

export const NotFoundPage: React.FC = () => {
    return (
        <Container maxWidth="m">
            <Flex gap={2} direction="column" style={{ marginTop: 72 }}>
                <Text variant="header-1">404 | Page not found</Text>
                <Link role="button" to={URLs.HomeRoot}>
                    <Button size="l">
                        <Text>Back to home</Text>
                        <Icon data={ArrowUpRightFromSquare} />
                    </Button>
                </Link>
            </Flex>
        </Container>
    );
};
