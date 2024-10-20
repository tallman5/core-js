import { Jwt } from "../models";

/**
 * Decodes a base64url string.
 * @param base64url - The base64url encoded string.
 * @returns The decoded string.
 */
export function base64urlDecode(base64url: string): string {
    // Add padding if necessary
    const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
    const paddedBase64 = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');

    // Decode base64 string
    const decoded = Buffer.from(paddedBase64, 'base64').toString('utf-8');
    return decoded;
}

export async function copyToClipboard(text: string): Promise<void> {
    if (navigator.clipboard && window.isSecureContext) {
        // Use the modern Clipboard API if available and the site is running on HTTPS
        try {
            await navigator.clipboard.writeText(text);
            console.log('Text copied to clipboard successfully (via Clipboard API)');
        } catch (error) {
            console.error('Clipboard API failed, falling back to execCommand:', error);
            fallbackCopyToClipboard(text);
        }
    } else {
        // Fallback for non-HTTPS sites or browsers without Clipboard API support
        fallbackCopyToClipboard(text);
    }
}

/**
 * Decodes a JWT and returns the payload as a JavaScript object.
 * @param token - The JWT string.
 * @returns The decoded payload as a Jwt.
 */
export function decodeJWT(token: string): Jwt {
    try {
        const [header, payload, signature] = token.split('.');
        if (!header || !payload || !signature) {
            throw new Error('Invalid token format');
        }

        const decodedPayload = base64urlDecode(payload);
        return JSON.parse(decodedPayload) as Jwt;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error('Failed to decode JWT: ' + error.message);
        } else {
            throw new Error('Failed to decode JWT: Unknown error');
        }
    }
}

export function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const emptyGuid = "00000000-0000-0000-0000-000000000000";

export function fallbackCopyToClipboard(text: string): void {
    const textArea = document.createElement("textarea");
    textArea.value = text;

    // Make the textarea invisible and append it to the document
    textArea.style.position = "fixed";  // Avoid scrolling to the bottom of the page
    textArea.style.opacity = "0";       // Hide the textarea
    document.body.appendChild(textArea);

    textArea.focus();
    textArea.select();

    try {
        const successful = document.execCommand('copy');
        console.log(successful ? 'Fallback: Text copied successfully!' : 'Fallback: Text copy failed.');
    } catch (error) {
        console.error('Fallback: Could not copy text', error);
    }

    document.body.removeChild(textArea);  // Clean up the DOM
}

/**
 * Generates a UUID according to v4 spec.
 * @returns A string in the format of 00000000-0000-0000-0000-000000000000.
 */
export function generateGUID(): string {
    const hexValues = "0123456789abcdef";

    // Create an array to hold the random values
    let octets = new Uint8Array(16);
    getRandomValues(octets);

    // Adjust specific bits according to the UUID v4 standard
    octets[6] = (octets[6] & 0x0f) | 0x40; // Set bits 4-7 of the 7th byte to 0100
    octets[8] = (octets[8] & 0x3f) | 0x80; // Set bits 6-7 of the 9th byte to 10

    // Convert octets to a hex string
    let guid = "";
    for (let i = 0; i < 16; i++) {
        guid += hexValues[octets[i] >> 4];
        guid += hexValues[octets[i] & 0x0f];

        if (i === 3 || i === 5 || i === 7 || i === 9) {
            guid += "-";
        }
    }

    return guid;
}

export function getStorageItem(key: string) {
    let returnValue = null;
    if (isBrowser) {
        const storageItem = window.localStorage.getItem(key);
        if (storageItem) {
            returnValue = JSON.parse(storageItem);
        }
    }
    return returnValue;
}

/**
 * Loads a buffer with random values.
 * @param buffer The buffer to load
 */
export function getRandomValues(buffer: Uint8Array) {
    if (typeof crypto !== "undefined" && crypto.getRandomValues) {
        crypto.getRandomValues(buffer);
    } else {
        // Fallback for environments without crypto API
        for (let i = 0; i < buffer.length; i++) {
            buffer[i] = Math.floor(Math.random() * 256);
        }
    }
}

/**
 * Gets a value from the current browser's location.
 * @param key - Key of the value to get.
 * @param defaultValue - The value returned if the key does not exist
 * @returns The key's value, the default value or null.
 */
export function getQueryParam(key: string, defaultValue?: string) {
    if (!isBrowser) return defaultValue || '';

    const urlParams = new URLSearchParams(window.location.search);
    for (const [k, v] of urlParams) {
        if (k.toLowerCase() === key.toLowerCase()) {
            return v;
        }
    }
    return defaultValue || '';
}

export const isBrowser = typeof window !== "undefined" && window;

export function isNullOrWhitespace(input: string | null | undefined): boolean {
    return input === undefined || input === null || input.trim() === '';
}

export function loadScript(url: string): Promise<boolean> {
    return new Promise((resolve, reject) => {

        const existingScript = document.querySelector(`script[src="${url}"]`);
        if (existingScript) {
            resolve(true);
            return;
        }

        const script = document.createElement('script');
        script.src = url;
        script.onload = () => {
            resolve(true);
        }
        script.onerror = () => {
            reject(new Error(`Script load error for ${url}`));
        }
        document.body.appendChild(script);
    });
};

export function setStorageItem(key: string, obj: any) {
    const serializedObj = JSON.stringify(obj);
    window.localStorage.setItem(key, serializedObj);
}

export function toValidHtmlId(str: string): string {
    // Replace invalid characters with underscores
    const sanitized = str.replace(/[^a-zA-Z0-9\-_:]/g, '_');

    // Ensure the ID starts with a letter
    if (/^[a-zA-Z]/.test(sanitized)) {
        return sanitized;
    }

    // Starts with an invalid character
    return 'id_' + sanitized;
};
