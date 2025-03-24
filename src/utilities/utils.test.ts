import { describe, it, expect } from 'vitest';
import { generateUuid } from './utils';

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
});
