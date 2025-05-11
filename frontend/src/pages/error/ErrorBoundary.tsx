import { ArrowRotateRight } from '@gravity-ui/icons';
import { Button, Flex, Icon, Text } from '@gravity-ui/uikit';
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
                <Flex
                    justifyContent="center"
                    alignItems="center"
                    direction="column"
                    style={{
                        paddingTop: 48,
                        paddingBottom: 48,
                        minHeight: '100vh',
                        paddingLeft: 16,
                        paddingRight: 16,
                    }}
                    gap={4}
                >
                    <Text variant="header-2">Something went wrong {':('}</Text>
                    <Text variant="subheader-3">Try again later...</Text>
                    <Button
                        size="l"
                        style={{ width: 'fit-content' }}
                        onClick={() => window.location.reload()}
                    >
                        <Text>Reload page</Text>
                        <Icon data={ArrowRotateRight} />
                    </Button>
                </Flex>
            );
        }

        return children;
    }
}

export default ErrorBoundary;
