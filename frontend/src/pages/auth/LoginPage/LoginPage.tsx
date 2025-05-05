import React from 'react';
import { useAppDispatch } from '~/store/store';
import { Flex, Text } from '@gravity-ui/uikit';
import { Link } from 'react-router-dom';
import URLs from '~/constants/URLs';
import { IAuthData } from '~/store/features/user/types';
import { AuthForm } from '../components/AuthForm';
import { signIn } from '~/store/features/user/thunk';

export const LoginPage: React.FC = () => {
    const dispatch = useAppDispatch();

    const handleLogin = async ({ email, password }: IAuthData) =>
        dispatch(signIn(email, password));

    return (
        <Flex justifyContent="center">
            <Flex
                style={{ paddingTop: 48, minWidth: 240, width: 320 }}
                direction="column"
                gap={3}
            >
                <Text variant="header-1">Log in to your account</Text>
                <AuthForm actionText="Log in" onSubmit={handleLogin} />
                <Text variant="body-1">
                    No account yet?
                    <Link
                        to={URLs.Register}
                        style={{ marginLeft: 4, textDecoration: 'underline' }}
                    >
                        Sign up
                    </Link>
                </Text>
            </Flex>
        </Flex>
    );
};
