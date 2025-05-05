import { ArrowRotateRight } from '@gravity-ui/icons';
import { Button, Container, Flex, Icon, Text } from '@gravity-ui/uikit';
import { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error('Error Boundary caught:', error, errorInfo);
    }

    resetError = (): void => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        const { hasError } = this.state;
        const { children } = this.props;

        if (hasError) {
            return (
                <Container maxWidth="m">
                    <Flex gap={4} direction="column" style={{ marginTop: 72 }}>
                        <Text variant="header-1">
                            Something went wrong {':('}
                        </Text>
                        <Text variant="subheader-3">Try again later...</Text>
                        <Button
                            size="l"
                            onClick={() => window.location.reload()}
                        >
                            <Text>Reload page</Text>
                            <Icon data={ArrowRotateRight} />
                        </Button>
                    </Flex>
                </Container>
            );
        }

        return children;
    }
}

export default ErrorBoundary;
