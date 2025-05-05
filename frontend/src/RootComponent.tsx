import React, { useEffect } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate,
} from 'react-router-dom';
import URLs from './constants/URLs';
import { NotFoundPage } from './pages/error/NotFoundPage';
import { HomePage } from './pages/home/HomePage';
import { LoginPage } from './pages/auth/LoginPage/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage/RegisterPage';
import { useAppDispatch, useAppSelector } from './store/store';
import { onAuthStateChanged } from 'firebase/auth';
import { setError, setUser } from './store/features/user/userSlice';
import { auth } from './firebaseConfig';

const RootComponent: React.FC = () => {
    const dispatch = useAppDispatch();

    const user = useAppSelector((state) => state.user.user);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(
            auth,
            (user) => {
                let userData = null;
                if (user) {
                    const {
                        displayName,
                        email,
                        photoURL,
                        phoneNumber,
                        providerId,
                        uid,
                        metadata: { lastSignInTime, creationTime },
                    } = user;

                    userData = {
                        displayName,
                        email,
                        photoURL,
                        phoneNumber,
                        providerId,
                        uid,
                        creationTime,
                        lastSignInTime,
                    };
                }
                dispatch(setUser(userData));
            },
            (error) => dispatch(setError(error.message)),
        );

        return () => unsubscribe();
    }, [dispatch]);

    return (
        <Router>
            <Routes>
                <Route
                    path={URLs.Login}
                    element={
                        user ? (
                            <Navigate to={URLs.HomeRoot} replace />
                        ) : (
                            <LoginPage />
                        )
                    }
                />
                <Route
                    path={URLs.Register}
                    element={
                        user ? (
                            <Navigate to={URLs.HomeRoot} replace />
                        ) : (
                            <RegisterPage />
                        )
                    }
                />
                <Route path={URLs.HomeRoot} element={<HomePage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Router>
    );
};

export default RootComponent;
