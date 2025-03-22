import { decodeJWT, generateUuid, getLongDate, isNullOrWhitespace } from "../src/core-js/utilities";

describe('Utilites', () => {
    it('token screen name should be decoded', () => {
        const accessToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiam9zZXBoQG1jZ3Vya2luLm5ldCIsIm5iZiI6IjE3MjA3MDIxMjciLCJleHAiOjE3MjMyOTQxMjcsInN1YiI6Impvc2VwaEBtY2d1cmtpbi5uZXQiLCJqdGkiOiJjNjNlOWJmZS0zNjcyLTQyNDYtYjg2OS1lODllNjE0N2FhMGYiLCJTY3JlZW5OYW1lIjoidGFsbG1hbiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluaXN0cmF0b3IiLCJpc3MiOiJodHRwczovL3d3dy5raXh2dS5jb20iLCJhdWQiOiJodHRwczovL3d3dy5raXh2dS5jb20ifQ.sbElWoQ55-5ec_lPSwwOenkdIEDYxV023xnGgjmjiBE`;
        const decodedPayload = decodeJWT(accessToken);
        expect(decodedPayload.ScreenName).toEqual(`tallman`);
    });

    it('should get long date', () => {
        const rs = getLongDate();
        expect(rs).toBeTruthy();
    });

    it('string should return false', () => {
        const rs = isNullOrWhitespace('fred');
        expect(rs).toBeFalsy();
    });

    it('string should return true', () => {
        const rs = isNullOrWhitespace(' ');
        expect(rs).toBeTruthy();
    });

    it('string should return true', () => {
        const rs = isNullOrWhitespace('\t');
        expect(rs).toBeTruthy();
    });

    it('string should return true', () => {
        const rs = isNullOrWhitespace(undefined);
        expect(rs).toBeTruthy();
    });

    it('string should return true', () => {
        const rs = isNullOrWhitespace(null);
        expect(rs).toBeTruthy();
    });

    it('should create a UUID', () => {
        const id = generateUuid();
        expect(id.length).toEqual('00000000-0000-0000-0000-000000000000'.length);
    });
});
