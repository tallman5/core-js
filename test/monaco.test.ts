import { describe, it, expect } from 'vitest';

describe('utilities/monaco-languages', () => {
    it('should export all members from models', async () => {
        const exports = await import('../src/utilities/monaco-languages');
        const models = await import('../src/utilities/monaco-languages/models');

        Object.keys(models).forEach((key) => {
            expect(exports).toHaveProperty(key);
        });
    });
});