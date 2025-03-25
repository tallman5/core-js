import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
    assertNotNull,
    base64urlDecode,
    copyToClipboard,
    decodeJwt,
    delay,
    // emptyUuid,
    // fallbackCopyToClipboard,
    generateUuid,
    getLongDate,
    getStorageItem,
    getRandomValues,
    getQueryParam,
    isBrowser,
    isNullOrWhitespace,
    loadScript,
    setStorageItem,
    toValidHtmlId
} from './utils';

import { Jwt } from '../models';

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

describe('Utility Functions', () => {
    describe('assertNotNull()', () => {
        it('should return value when not null/undefined', () => {
            const value = 'test';
            const result = assertNotNull(value, 'Should not throw');
            expect(result).toBe(value);
        });

        it('should throw error when value is null', () => {
            expect(() => assertNotNull(null, 'Test error')).toThrow('Test error');
        });

        it('should throw error when value is undefined', () => {
            expect(() => assertNotNull(undefined, 'Test error')).toThrow('Test error');
        });
    });

    describe('base64urlDecode()', () => {
        it('should decode base64url string', () => {
            const encoded = 'SGVsbG8gV29ybGQh';
            const result = base64urlDecode(encoded);
            expect(result).toBe('Hello World!');
        });

        it('should handle base64url with padding', () => {
            const encoded = 'SGVsbG8gV29ybA==';
            const result = base64urlDecode(encoded);
            expect(result).toBe('Hello Worl');
        });

        // it('should handle base64url with replacements', () => {
        //     const encoded = 'SGVsbG8gV29ybGQh-_';
        //     const result = base64urlDecode(encoded);
        //     expect(result).toBe('Hello World!+/');
        // });
    });

    describe('copyToClipboard()', () => {
        beforeEach(() => {
            vi.stubGlobal('navigator', {
                clipboard: {
                    writeText: vi.fn().mockResolvedValue(undefined)
                }
            });
            vi.stubGlobal('window', { isSecureContext: true });
            vi.spyOn(console, 'log').mockImplementation(() => { });
            vi.spyOn(console, 'error').mockImplementation(() => { });
        });

        afterEach(() => {
            vi.unstubAllGlobals();
        });

        it('should use Clipboard API when available', async () => {
            await copyToClipboard('test');
            expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test');
        });

        // it('should fallback when Clipboard API fails', async () => {
        //     vi.mocked(navigator.clipboard.writeText).mockRejectedValue(new Error('Failed'));
        //     const fallbackSpy = vi.spyOn(document, 'execCommand').mockReturnValue(true);
        //     await copyToClipboard('test');
        //     expect(fallbackSpy).toHaveBeenCalledWith('copy');
        // });

        // it('should fallback when not secure context', async () => {
        //     window.isSecureContext = false;
        //     const fallbackSpy = vi.spyOn(document, 'execCommand').mockReturnValue(true);
        //     await copyToClipboard('test');
        //     expect(fallbackSpy).toHaveBeenCalledWith('copy');
        // });
    });

    describe('decodeJwt()', () => {
        it('should decode valid JWT', () => {
            const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
            const result = decodeJwt(token);
            expect(result).toEqual({
                sub: '1234567890',
                name: 'John Doe',
                iat: 1516239022
            } as Jwt);
        });

        it('should throw error for invalid token format', () => {
            expect(() => decodeJwt('invalid.token')).toThrow('Invalid token format');
        });

        it('should throw error for invalid JSON payload', () => {
            const token = 'a.b.c'; // b is not valid base64url JSON
            expect(() => decodeJwt(token)).toThrow('Failed to decode JWT');
        });
    });

    describe('delay()', () => {
        it('should resolve after specified time', async () => {
            vi.useFakeTimers();
            const delayPromise = delay(100);
            vi.advanceTimersByTime(100);
            await delayPromise;
            vi.useRealTimers();
        });
    });

    // describe('fallbackCopyToClipboard()', () => {
    //     // it('should use execCommand to copy text', () => {
    //     //     const execSpy = vi.spyOn(document, 'execCommand').mockReturnValue(true);
    //     //     const createSpy = vi.spyOn(document, 'createElement').mockReturnValue({
    //     //         style: {},
    //     //         value: '',
    //     //         focus: vi.fn(),
    //     //         select: vi.fn()
    //     //     } as any);
    //     //     const appendSpy = vi.spyOn(document.body, 'appendChild');
    //     //     const removeSpy = vi.spyOn(document.body, 'removeChild');

    //     //     fallbackCopyToClipboard('test');

    //     //     expect(execSpy).toHaveBeenCalledWith('copy');
    //     //     expect(createSpy).toHaveBeenCalledWith('textarea');
    //     //     expect(appendSpy).toHaveBeenCalled();
    //     //     expect(removeSpy).toHaveBeenCalled();
    //     // });
    // });

    describe('generateUuid()', () => {
        it('should generate valid UUID v4 format', () => {
            const uuid = generateUuid();
            expect(uuid).toMatch(uuidRegex);
        });

        it('should use crypto.getRandomValues when available', () => {
            const mockBuffer = new Uint8Array(16);
            vi.stubGlobal('crypto', {
                getRandomValues: vi.fn().mockImplementation((buf) => {
                    buf.set(mockBuffer);
                    return buf;
                })
            });

            generateUuid();
            expect(crypto.getRandomValues).toHaveBeenCalled();
        });

        it('should fallback to Math.random when crypto not available', () => {
            vi.stubGlobal('crypto', undefined);
            const mathSpy = vi.spyOn(Math, 'random').mockReturnValue(0.5);

            const uuid = generateUuid();
            expect(mathSpy).toHaveBeenCalled();
            expect(uuid).toMatch(uuidRegex);
        });
    });

    describe('getLongDate()', () => {
        it('should return date in correct format', () => {
            vi.useFakeTimers();
            const fixedDate = new Date(2023, 5, 15, 12, 30, 45);
            vi.setSystemTime(fixedDate);

            const result = getLongDate();
            expect(result).toBe('2023-06-15-12-30-45');
            vi.useRealTimers();
        });
    });

    describe('storage functions', () => {
        beforeEach(() => {
            vi.stubGlobal('window', {
                localStorage: {
                    getItem: vi.fn(),
                    setItem: vi.fn()
                },
                location: {
                    search: '?test=value&other=123'
                }
            });
        });

        afterEach(() => {
            vi.unstubAllGlobals();
        });

        describe('getStorageItem()', () => {
            it('should return parsed value from localStorage', () => {
                vi.mocked(window.localStorage.getItem).mockReturnValue('{"key":"value"}');
                const result = getStorageItem('test');
                expect(result).toEqual({ key: 'value' });
            });

            it('should return null for non-existent key', () => {
                vi.mocked(window.localStorage.getItem).mockReturnValue(null);
                const result = getStorageItem('nonexistent');
                expect(result).toBeNull();
            });
        });

        describe('setStorageItem()', () => {
            it('should stringify and store value', () => {
                setStorageItem('test', { key: 'value' });
                expect(window.localStorage.setItem).toHaveBeenCalledWith(
                    'test',
                    '{"key":"value"}'
                );
            });
        });
    });

    describe('getQueryParam()', () => {
        // it('should return value for existing param (case insensitive)', () => {
        //     const result = getQueryParam('TEST');
        //     expect(result).toBe('value');
        // });

        it('should return default value for non-existent param', () => {
            const result = getQueryParam('missing', 'default');
            expect(result).toBe('default');
        });
    });

    // describe('isBrowser', () => {
    //     // it('should be true in browser environment', () => {
    //     //     expect(isBrowser).toBe(true);
    //     // });
    // });

    describe('isNullOrWhitespace()', () => {
        it('should return true for null/undefined/empty string', () => {
            expect(isNullOrWhitespace(null)).toBe(true);
            expect(isNullOrWhitespace(undefined)).toBe(true);
            expect(isNullOrWhitespace('')).toBe(true);
            expect(isNullOrWhitespace('   ')).toBe(true);
        });

        it('should return false for non-empty strings', () => {
            expect(isNullOrWhitespace('test')).toBe(false);
            expect(isNullOrWhitespace('  test  ')).toBe(false);
        });
    });

    describe('loadScript()', () => {
        beforeEach(() => {
            vi.stubGlobal('document', {
                querySelector: vi.fn(),
                createElement: vi.fn(() => ({
                    src: '',
                    onload: null,
                    onerror: null
                })),
                body: {
                    appendChild: vi.fn()
                }
            });
        });

        it('should resolve immediately if script already loaded', async () => {
            vi.mocked(document.querySelector).mockReturnValue({} as any);
            const result = await loadScript('test.js');
            expect(result).toBe(true);
        });

        it('should load new script and resolve on load', async () => {
            const script = { onload: null, onerror: null } as any;
            vi.mocked(document.createElement).mockReturnValue(script);

            const loadPromise = loadScript('test.js');
            script.onload();

            const result = await loadPromise;
            expect(result).toBe(true);
            expect(document.body.appendChild).toHaveBeenCalledWith(script);
        });

        it('should reject on script error', async () => {
            const script = { onload: null, onerror: null } as any;
            vi.mocked(document.createElement).mockReturnValue(script);

            const loadPromise = loadScript('test.js');
            script.onerror();

            await expect(loadPromise).rejects.toThrow('Script load error for test.js');
        });
    });

    describe('toValidHtmlId()', () => {
        it('should replace invalid characters with underscores', () => {
            const result = toValidHtmlId('test@id#123');
            expect(result).toBe('test_id_123');
        });

        it('should ensure ID starts with letter', () => {
            const result = toValidHtmlId('123test');
            expect(result).toBe('id_123test');
        });

        it('should preserve valid characters', () => {
            const result = toValidHtmlId('valid-id:test_123');
            expect(result).toBe('valid-id:test_123');
        });
    });
});