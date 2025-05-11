import { Magnifier } from '@gravity-ui/icons';
import { Button, Icon, Popup } from '@gravity-ui/uikit';
import { FC, memo, useState } from 'react';
import { SearchForm } from '~/components/SearchForm/SearchForm';
import { searchParamsSelector } from '~/store/features/hotels/hotelsSearchSlice';
import { useAppSelector } from '~/store/store';

export interface ISearchPopupProps {}

const SearchPopup: FC<ISearchPopupProps> = () => {
    const searchParams = useAppSelector(searchParamsSelector);
    const [isOpen, setOpen] = useState(false);
    const [anchor, setAnchor] = useState<HTMLDivElement | null>(null);

    return (
        <>
            <div ref={setAnchor}>
                {searchParams && (
                    <Button
                        view="raised"
                        size="l"
                        onClick={() => setOpen((prev) => !prev)}
                    >
                        <Icon data={Magnifier} size={18} />
                    </Button>
                )}
            </div>
            <Popup
                open={isOpen}
                placement="bottom-start"
                anchorElement={anchor}
                style={{
                    top: 8,
                    borderRadius: 'var(--g-border-radius-l)',
                }}
                onOpenChange={(open) => setOpen(open)}
            >
                <SearchForm />
            </Popup>
        </>
    );
};

export default memo(SearchPopup);
