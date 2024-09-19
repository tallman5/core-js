import { loadWASM, OnigRegExp, } from "onigasm";
import * as monaco from 'monaco-editor';
export type Monaco = typeof monaco;
import { loadScript } from "./utils";
import { editor, languages } from "monaco-editor";
import klipDark from './monaco-languages/klipper/klipper-theme-dark-web.json';
import cfgConfig from './monaco-languages/klipper/klipper-cfg.config.json';
import gcodeConfig from './monaco-languages/klipper/klipper-gcode.config.json';
import { Registry } from "monaco-textmate";
import cfgLanguage from './monaco-languages/klipper/klipper-cfg.tmLanguage.json';
import gcodeLanguage from './monaco-languages/klipper/klipper-gcode.tmLanguage.json';
import scriptLanguage from './monaco-languages/klipper/klipper-script.tmLanguage.json';
import { wireTmGrammars } from "monaco-editor-textmate";

export function loadKlipperLanguage(m: Monaco): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
        try {
            m.editor.defineTheme('klip-dark', klipDark as editor.IStandaloneThemeData);

            m.languages.register({ id: 'klipper-cfg' });
            m.languages.register({ id: 'klipper-gcode' });
            m.languages.register({ id: 'klipper-script' });

            m.languages.setLanguageConfiguration('klipper-cfg', cfgConfig as languages.LanguageConfiguration);
            m.languages.setLanguageConfiguration('klipper-gcode', gcodeConfig as languages.LanguageConfiguration);

            const registry = new Registry({
                getGrammarDefinition: async (scopeName: string): Promise<any> => {

                    let content: any;
                    switch (scopeName) {
                        case "source.klipper-cfg":
                            content = cfgLanguage;
                            break;
                        case "source.klipper-gcode":
                            content = gcodeLanguage;
                            break;
                        case "source.klipper-script":
                            content = scriptLanguage;
                            break;
                    };

                    const res: any = {
                        format: 'json',
                        content: content,
                    };
                    return res;
                },
            });

            wireTmGrammars(m, registry, new Map([
                ['klipper-cfg', 'source.klipper-cfg'],
                ['klipper-gcode', 'source.klipper-gcode'],
                ['klipper-script', 'source.klipper-script']
              ]));
          
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
