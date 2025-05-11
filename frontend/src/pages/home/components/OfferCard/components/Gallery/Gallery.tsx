import { ChevronLeft, ChevronRight } from '@gravity-ui/icons';
import { Button, Icon } from '@gravity-ui/uikit';
import { useState } from 'react';

interface GalleryProps {
    images?: string[];
    className?: string;
}

export function Gallery({ images, className }: GalleryProps) {
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

    if (!images || images.length === 0) {
        return null;
    }

    return (
        <>
            <div className={className}>
                <img
                    src={images[currentPhotoIndex]}
                    style={{
                        position: 'absolute',
                        height: '100%',
                        width: '100%',
                        objectFit: 'fill',
                        zIndex: -1,
                    }}
                />
            </div>

            {/* <LeftGalleryButton
                currentPhotoIndex={currentPhotoIndex}
                totalImages={images.length}
                onIndexUpdate={setCurrentPhotoIndex}
            />

            <RightGalleryButton
                currentPhotoIndex={currentPhotoIndex}
                totalImages={images.length}
                onIndexUpdate={setCurrentPhotoIndex}
            /> */}
        </>
    );
}

interface GalleryButtonProps {
    currentPhotoIndex: number;
    totalImages: number;
    onIndexUpdate: (index: number) => void;
}

function LeftGalleryButton({
    currentPhotoIndex,
    totalImages,
    onIndexUpdate,
}: GalleryButtonProps) {
    if (currentPhotoIndex === 0 || totalImages < 1) {
        return null;
    }

    return (
        <Button
            style={{
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%)',
                left: 0,
                marginLeft: 8,
            }}
            view="raised"
            onClick={() => {
                let nextIndex = currentPhotoIndex - 1;

                if (nextIndex < 0) {
                    nextIndex = totalImages;
                }

                onIndexUpdate(nextIndex);
            }}
        >
            <Icon data={ChevronLeft} size={16} />
        </Button>
    );
}

function RightGalleryButton({
    currentPhotoIndex,
    totalImages,
    onIndexUpdate,
}: GalleryButtonProps) {
    if (totalImages < 1) {
        return null;
    }

    return (
        <Button
            style={{
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%)',
                right: 0,
                marginRight: 8,
            }}
            view="raised"
            onClick={() => {
                let nextIndex = currentPhotoIndex + 1;

                if (nextIndex >= totalImages) {
                    nextIndex = 0;
                }

                onIndexUpdate(nextIndex);
            }}
        >
            <Icon data={ChevronRight} size={16} />
        </Button>
    );
}
