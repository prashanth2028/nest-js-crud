export interface Admin {
    name: string;
    email: string;
    password: string;
}

export interface UpdateAdmin {
    name?: string;
    email?: string;
    password?: string;
}