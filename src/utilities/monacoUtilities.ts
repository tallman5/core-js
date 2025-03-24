import { loadWASM, OnigRegExp } from "onigasm";
import * as monaco from 'monaco-editor';
export type Monaco = typeof monaco;
import { loadScript } from "./utils";
import { Registry } from "monaco-textmate";
import { wireTmGrammars } from "monaco-editor-textmate";
import { ICustomMonacoConfig } from "./monaco-languages";

export async function loadCustomConfiguration(m: Monaco, config: ICustomMonacoConfig): Promise<boolean> {
    try {
        if (config.themes) {
            config.themes.forEach((value, key) => {
                m.editor.defineTheme(key, value);
            });
        }

        if (config.languages) {
            config.languages.forEach(lang => {
                m.languages.register({ id: lang.id });
                lang.configuration && m.languages.setLanguageConfiguration(lang.id, lang.configuration);
            });
        }

        const registry = new Registry({
            getGrammarDefinition: async (scopeName: string): Promise<any> => {
                const lang = config.languages.find(lang => lang.scope === scopeName);
                return lang ? { format: 'json', content: lang.grammer } : null;
            },
        });

        const languagesMap = config.languages.reduce((map, lang) => {
            map.set(lang.id, lang.scope);
            return map;
        }, new Map<string, string>());

        await wireTmGrammars(m, registry, languagesMap);
        return true;
    } catch (err) {
        throw err;
    }
}

export async function loadMonaco(): Promise<Monaco> {
    const monacoBaseUrl = `https://cdn.jsdelivr.net/npm/monaco-editor@0.52.0/min/vs`;

    return new Promise(async (resolve, reject) => {
        const requireMonaco = () => {
            const require = (window as any).require;
            if (require) {
                require.config({
                    paths: { vs: monacoBaseUrl }
                });

                require(['vs/editor/editor.main'], function (monaco: Monaco) {
                    if (monaco) {
                        resolve(monaco); // Now resolve is properly defined
                    }
                });
            } else {
                setTimeout(requireMonaco, 50);
            }
        };

        let m: Monaco = (window as any).monaco;
        if (m) {
            resolve(m);  // Resolve the promise if Monaco is already loaded
        } else {
            await loadOnigasm();
            loadScript(`${monacoBaseUrl}/loader.js`)
                .then(() => {
                    m = (window as any).monaco;
                    if (m) {
                        resolve(m); // Resolve after loading script
                    } else {
                        requireMonaco(); // Try to load Monaco using require
                    }
                })
                .catch((err) => {
                    reject(err); // Reject the promise in case of failure
                });
        }
    });
}

export async function loadOnigasm(): Promise<boolean> {
    await loadWASM('https://cdn.jsdelivr.net/npm/onigasm@latest/lib/onigasm.wasm');
    if (typeof OnigRegExp !== 'undefined') {
        return true;
    } else {
        throw new Error('OnigRegExp is not loaded');
    }
}
