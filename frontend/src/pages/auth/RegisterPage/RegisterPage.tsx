import React from 'react';
import { useAppDispatch } from '~/store/store';
import { Flex, Text } from '@gravity-ui/uikit';
import { Link } from 'react-router-dom';
import URLs from '~/constants/URLs';
import { AuthForm } from '../components/AuthForm';
import { signUp } from '~/store/features/user/thunk';
import { IAuthData } from '~/store/features/user/types';

export const RegisterPage: React.FC = () => {
    const dispatch = useAppDispatch();

    const handleSignUp = async ({ email, password }: IAuthData) =>
        dispatch(signUp(email, password));

    return (
        <Flex justifyContent="center">
            <Flex
                style={{ paddingTop: 48, minWidth: 240, width: 320 }}
                direction="column"
                gap={3}
            >
                <Text variant="header-1">Create a new account</Text>
                <AuthForm actionText="Sign up" onSubmit={handleSignUp} />
                <Text variant="body-1">
                    Already have an account?
                    <Link
                        to={URLs.Login}
                        style={{ marginLeft: 4, textDecoration: 'underline' }}
                    >
                        Log in
                    </Link>
                </Text>
            </Flex>
        </Flex>
    );
};
