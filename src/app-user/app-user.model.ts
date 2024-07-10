export interface IAppUser {
    username?: string
    oauthToken?: IOauthToken
};

export interface IOauthToken {
    access_token: string
    expires_at: Date
    expires_in: number
    issued_at: number
};
