import * as monaco from 'monaco-editor';
export type Monaco = typeof monaco;

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

export function loadMonaco(): Promise<Monaco> {
    return new Promise((resolve, reject) => {
        const monacoBaseUrl = `https://cdn.jsdelivr.net/npm/monaco-editor@0.50.0/min/vs`;

        const requireMonaco = () => {
            const require = (window as any).require;
            if (require) {
                require.config({
                    paths: {
                        vs: monacoBaseUrl,
                    }
                });

                require(['vs/editor/editor.main'], function (monaco: Monaco) {
                    if (monaco)
                        resolve(monaco);
                });
            } else {
                // Sometimes 'require' is undefined ?????
                setTimeout(requireMonaco, 1);
            }
        };

        let m: Monaco = (window as any).monaco;
        if (m) {
            resolve(m);
        }
        else {
            loadScript(`${monacoBaseUrl}/loader.js`)
                .then(() => {
                    m = (window as any).monaco;
                    if (m) {
                        resolve(m);
                    }
                    else {
                        requireMonaco();
                    }
                })
                .catch((err) => {
                    reject(err);
                });
        }
    });
};

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
