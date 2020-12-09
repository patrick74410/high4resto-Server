export interface UserI {
    id?: string;
    username: string;
    password: string;
    email: string;
    active: boolean;
    roles: string[];
}