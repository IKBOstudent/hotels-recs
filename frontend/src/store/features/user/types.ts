import { UserInfo, UserMetadata } from 'firebase/auth';

export interface IAuthData {
    email: string;
    password: string;
}

export type IUser = UserInfo & UserMetadata;
