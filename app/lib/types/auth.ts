import { User } from './users';
import { ObjectId } from "mongodb";

export interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    pageTitle: string;
    setPageTitle: (title: string) => void;
}

export type Auth = string | ObjectId; // Useful if Auth can be either string or ObjectId
