export interface Jwt {
    aud: string;        // Audience
    email?: string;     // Email of the user (optional)
    exp: number;        // Expiration time (as a UNIX timestamp)
    iat: number;        // Issued at time (as a UNIX timestamp)
    iss: string;        // Issuer
    jti?: string;       // JWT ID (optional)
    name?: string;      // Name of the user (optional)
    nbf?: number;       // Not before time (optional, as a UNIX timestamp)
    sub: string;        // Subject (usually a user ID)
    [key: string]: any; // Additional claims not previously defined
}

export interface Size {
    height: number;
    width: number;
};
