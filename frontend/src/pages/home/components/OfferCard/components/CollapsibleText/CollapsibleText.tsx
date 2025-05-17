import { ChevronDown, ChevronUp } from '@gravity-ui/icons';
import { Button, Flex, Icon, Text } from '@gravity-ui/uikit';
import React, { useState } from 'react';

interface ICollapsibleTextProps {
    text: string;
}

export const CollapsibleText: React.FC<ICollapsibleTextProps> = ({ text }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <Flex gap={1} direction="column" alignItems="flex-start">
            <Text
                variant="body-2"
                style={{
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: isExpanded ? 10 : 1,
                    WebkitBoxOrient: 'vertical',
                    textOverflow: 'ellipsis',
                }}
                dangerouslySetInnerHTML={{ __html: text }}
            ></Text>
            <Button
                view="normal"
                size="s"
                style={{ marginTop: 4, pointerEvents: 'auto' }}
                onClick={() => setIsExpanded((value) => !value)}
            >
                {isExpanded ? 'Hide' : 'More'}
                <Icon data={isExpanded ? ChevronUp : ChevronDown} size={12} />
            </Button>
        </Flex>
    );
};
