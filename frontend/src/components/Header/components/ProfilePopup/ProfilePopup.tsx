import {
    ArrowRightFromSquare,
    Bookmark,
    BookOpen,
    ChevronRight,
    Heart,
    Person,
} from '@gravity-ui/icons';
import { Button, Divider, Flex, Icon, Popup, Text } from '@gravity-ui/uikit';
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
                size="l"
                onClick={() => setOpen((prev) => !prev)}
            >
                {user ? <Icon data={Person} size={18} /> : 'Login'}
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
                    style={{
                        top: 8,
                        borderRadius: 'var(--g-border-radius-l)',
                    }}
                    onOpenChange={(open) => setOpen(open)}
                >
                    <Flex
                        direction="column"
                        // alignItems="end"
                        gap={2}
                        style={{ padding: 16, maxWidth: 240 }}
                    >
                        {user?.email && (
                            <>
                                <Flex alignItems="center" gap={4}>
                                    <Text
                                        style={{
                                            display: 'inline-block',
                                            minWidth: 50,
                                        }}
                                        variant="body-2"
                                        color="secondary"
                                    >
                                        Email
                                    </Text>
                                    <Text ellipsis variant="body-2">
                                        {user.email}
                                    </Text>
                                </Flex>

                                <Button size="l">
                                    Account <Icon data={Person} />
                                </Button>
                            </>
                        )}
                        <Divider orientation="horizontal" />
                        <Button size="l" view="outlined-action">
                            Bookings <Icon data={BookOpen} />
                        </Button>
                        <Divider orientation="horizontal" />
                        <Button size="l" view="normal-contrast">
                            Favorites <Icon data={Heart} />
                        </Button>

                        {/* <Button
                            view="flat-danger"
                            onClick={handleLogout}
                            style={{ width: 'fit-content' }}
                        >
                            <Text>Log out</Text>
                            <Icon data={ArrowRightFromSquare} />
                        </Button> */}
                    </Flex>
                </Popup>
            )}
        </>
    );
};

export default memo(ProfilePopup);
