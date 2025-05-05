import { ArrowRightFromSquare, Person } from '@gravity-ui/icons';
import { Button, Flex, Icon, Popup, Text } from '@gravity-ui/uikit';
import { FC, memo, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import URLs from '~/constants/URLs';
import { logout } from '~/store/features/user/thunk';
import { userSelector } from '~/store/features/user/userSlice';
import { useAppDispatch, useAppSelector } from '~/store/store';

export interface IProfilePopupProps {}

const ProfilePopup: FC<IProfilePopupProps> = () => {
    const dispatch = useAppDispatch();
    const [anchor, setAnchor] = useState<HTMLDivElement | null>(null);
    const [isOpen, setOpen] = useState(false);

    const user = useAppSelector(userSelector);
    const isLoading = useAppSelector((state) => state.user.loading);

    const handleLogout = async () => dispatch(logout());

    const button = useMemo(() => {
        return (
            <Button
                view="raised"
                size="xl"
                onClick={() => setOpen((prev) => !prev)}
            >
                {user ? <Icon data={Person} size={24} /> : 'Login'}
            </Button>
        );
    }, [user]);

    if (isLoading) {
        return null;
    }

    return (
        <>
            <div ref={setAnchor}>
                {user ? button : <Link to={URLs.Login}>{button}</Link>}
            </div>
            {user && (
                <Popup
                    open={isOpen}
                    placement="bottom-end"
                    anchorElement={anchor}
                    onOpenChange={(open) => setOpen(open)}
                >
                    <Flex
                        direction="column"
                        gap={4}
                        style={{ padding: 16, maxWidth: 240 }}
                    >
                        {user?.displayName && (
                            <Flex alignItems="аlex-start" gap={4}>
                                <Text
                                    style={{
                                        display: 'inline-block',
                                        width: '50px',
                                    }}
                                    variant="body-2"
                                    color="secondary"
                                >
                                    Name
                                </Text>
                                <Text ellipsis variant="body-2">
                                    {user.displayName}
                                </Text>
                            </Flex>
                        )}
                        {user?.email && (
                            <Flex alignItems="аlex-start" gap={4}>
                                <Text
                                    style={{
                                        display: 'inline-block',
                                        width: '50px',
                                    }}
                                    variant="body-1"
                                    color="secondary"
                                >
                                    Email
                                </Text>
                                <Text ellipsis variant="body-1">
                                    {user.email}
                                </Text>
                            </Flex>
                        )}
                        <Button view="outlined-danger" onClick={handleLogout}>
                            <Text>Log out</Text>
                            <Icon data={ArrowRightFromSquare} />
                        </Button>
                    </Flex>
                </Popup>
            )}
        </>
    );
};

export default memo(ProfilePopup);
