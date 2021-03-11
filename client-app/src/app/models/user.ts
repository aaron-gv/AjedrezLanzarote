
export interface User {
    username: string;
    displayName: string;
    token: string;
    email: string;
    image?:string;
    roles?: string[];
}

export interface UserFormValues {
    email: string;
    password: string;
    username?: string;
    displayName?: string;
    token?: string;
}