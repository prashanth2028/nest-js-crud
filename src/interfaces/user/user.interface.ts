export interface User {
    name: string;
    email: string;
    role?: 'intern' | 'student' | 'professor';
}

export interface updateUser {
    name?: string;
    email?: string;
    role?: 'intern' | 'student' | 'professor';
}
