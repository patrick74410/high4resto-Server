export interface ConnexionI {
    // Interface de connection simple
    username: string;
    password: string;
    // JWT
    access_token?: string;
}