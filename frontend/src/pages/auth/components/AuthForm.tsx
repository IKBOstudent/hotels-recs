import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Text, Flex, TextInput, Alert } from '@gravity-ui/uikit';
import { IAuthData } from '~/store/features/user/types';
import { useAppSelector } from '~/store/store';

type AuthFormProps = {
    actionText: string;
    onSubmit: (data: IAuthData) => Promise<void>;
};

export const AuthForm: React.FC<AuthFormProps> = ({ actionText, onSubmit }) => {
    const { loading, error } = useAppSelector((state) => state.user);
    const {
        register: registerField,
        handleSubmit,
        reset,
        formState: { isValid },
    } = useForm<IAuthData>();

    useEffect(() => {
        if (!loading && error) {
            reset();
        }
    }, [loading, error, reset]);

    const internalOnSubmit = async (data: IAuthData) => {
        if (isValid) {
            await onSubmit(data);
        }
    };

    return (
        <form onSubmit={handleSubmit(internalOnSubmit)}>
            <Flex gap={3} direction="column">
                {error && (
                    <Alert
                        theme="danger"
                        title="Authentication failed"
                        message={error}
                    />
                )}
                <TextInput
                    {...registerField('email', { required: true })}
                    size="xl"
                    type="text"
                    placeholder="Email"
                />
                <TextInput
                    {...registerField('password', { required: true })}
                    size="xl"
                    type="password"
                    placeholder="Password"
                />
                <Button
                    size="xl"
                    view={loading ? 'normal' : 'action'}
                    loading={loading}
                    type="submit"
                    disabled={!isValid}
                >
                    <Text variant="subheader-2">{actionText}</Text>
                </Button>
            </Flex>
        </form>
    );
};
