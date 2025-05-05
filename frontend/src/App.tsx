import React from 'react';
import { Provider } from 'react-redux';
import RootComponent from './RootComponent';
import { store } from './store/store';

import {
    ThemeProvider,
    Toaster,
    ToasterComponent,
    ToasterProvider,
} from '@gravity-ui/uikit';
import ErrorBoundary from './pages/error/ErrorBoundary';

const toaster = new Toaster();

const App: React.FC = () => {
    return (
        <ErrorBoundary>
            <React.StrictMode>
                <Provider store={store}>
                    <ThemeProvider theme="dark">
                        <ToasterProvider toaster={toaster}>
                            <RootComponent />
                            <ToasterComponent />
                        </ToasterProvider>
                    </ThemeProvider>
                </Provider>
            </React.StrictMode>
        </ErrorBoundary>
    );
};

export default App;
