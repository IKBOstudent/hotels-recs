import { AppThunk } from '~/store/store';
import { setError, setLoading } from './userSlice';
import { auth } from '~/firebaseConfig';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';

export const signUp =
    (email: string, password: string): AppThunk =>
    async (dispatch) => {
        try {
            dispatch(setLoading(true));
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (error) {
            let message = 'Unexpected registration error';
            if (error instanceof FirebaseError) {
                message = error.message;
            }
            dispatch(setError(message));
        }
    };

export const signIn =
    (email: string, password: string): AppThunk =>
    async (dispatch) => {
        try {
            dispatch(setLoading(true));
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            let message = 'Unexpected login error';
            if (error instanceof FirebaseError) {
                message = error.message;
            }
            dispatch(setError(message));
        }
    };

export const logout = (): AppThunk => async (dispatch) => {
    try {
        await auth.signOut();
    } catch (error) {
        let message = 'Unexpected logout error';
        if (error instanceof FirebaseError) {
            message = error.message;
        }
        dispatch(setError(message));
    }
};
