import { loadWASM, OnigRegExp, } from "onigasm";
import * as monaco from 'monaco-editor';
export type Monaco = typeof monaco;
import { loadScript } from "./utils";
import { Registry } from "monaco-textmate";
import { wireTmGrammars } from "monaco-editor-textmate";
import { ICustomMonacoConfig } from "./monaco-languages";

export function loadCustomConfiguration(m: Monaco, config: ICustomMonacoConfig) {
    return new Promise(async (resolve, reject) => {
        try {
            if (config.themes) {
                config.themes.forEach((value, key) => {
                    m.editor.defineTheme(key, value);
                });
            }

            if (config.languages) {
                config.languages.forEach((lang) => {
                    m.languages.register({ id: lang.id });
                    if (lang.configuration)
                        m.languages.setLanguageConfiguration(lang.id, lang.configuration);
                });
            }

            const registry = new Registry({
                getGrammarDefinition: async (scopeName: string): Promise<any> => {
                    let content: any;
                    config.languages.forEach((lang) => {
                        if (lang.scope === scopeName)
                            content = lang.grammer;
                    });
                    const res: any = {
                        format: 'json',
                        content: content,
                    };
                    return res;
                },
            });

            const languagesMap = config.languages.reduce((map, lang) => {
                map.set(lang.id, lang.scope);
                return map;
            }, new Map<string, string>());

            wireTmGrammars(m, registry, languagesMap);

            resolve(true);
        }
        catch (err) {
            reject(err);
        }
    });
}

export function loadMonaco(): Promise<Monaco> {
    return new Promise(async (resolve, reject) => {
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
                    if (monaco) {
                        resolve(monaco);
                    }
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
            await loadOnigasm();
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

export async function loadOnigasm(): Promise<boolean> {
    try {
        await loadWASM('https://cdn.jsdelivr.net/npm/onigasm@latest/lib/onigasm.wasm');

        if (typeof OnigRegExp !== 'undefined') {
            return true;
        } else {
            throw new Error('OnigRegExp is not loaded');
        }
    } catch (error) {
        throw error;
    }
}
