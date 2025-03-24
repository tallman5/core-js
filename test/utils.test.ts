import { describe, it, expect } from 'vitest';
import { decodeJwt, generateUuid, getLongDate, isNullOrWhitespace } from '../src/utilities/utils';

describe('utils', () => {
    it('should generate a valid UUID v4', () => {
        const uuid = generateUuid();
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        expect(uuid).toMatch(uuidRegex);
    });

    it('should generate unique UUIDs', () => {
        const uuid1 = generateUuid();
        const uuid2 = generateUuid();
        expect(uuid1).not.toBe(uuid2);
    });

    it('should generate a UUID of correct length', () => {
        const uuid = generateUuid();
        expect(uuid.length).toBe(36);
    });
    
    it('token screen name should be decoded', () => {
        const accessToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiam9zZXBoQG1jZ3Vya2luLm5ldCIsIm5iZiI6IjE3MjA3MDIxMjciLCJleHAiOjE3MjMyOTQxMjcsInN1YiI6Impvc2VwaEBtY2d1cmtpbi5uZXQiLCJqdGkiOiJjNjNlOWJmZS0zNjcyLTQyNDYtYjg2OS1lODllNjE0N2FhMGYiLCJTY3JlZW5OYW1lIjoidGFsbG1hbiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluaXN0cmF0b3IiLCJpc3MiOiJodHRwczovL3d3dy5raXh2dS5jb20iLCJhdWQiOiJodHRwczovL3d3dy5raXh2dS5jb20ifQ.sbElWoQ55-5ec_lPSwwOenkdIEDYxV023xnGgjmjiBE`;
        const decodedPayload = decodeJwt(accessToken);
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
});
