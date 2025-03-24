import { editor, languages } from "monaco-editor";
import klipperDark from './klipper/klipper-theme-dark-web.json';
import cfgConfig from './klipper/klipper-cfg.config.json';
import cfgLanguage from './klipper/klipper-cfg.tmLanguage.json';
import gcodeConfig from './klipper/klipper-gcode.config.json';
import gcodeLanguage from './klipper/klipper-gcode.tmLanguage.json';
import scriptLanguage from './klipper/klipper-script.tmLanguage.json';

export interface ICustomLanguageConfig {
    id: string;
    configuration?: languages.LanguageConfiguration;
    grammer: any;
    scope: string;
}

export interface ICustomMonacoConfig {
    themes: Map<string, editor.IStandaloneThemeData>;
    languages: ICustomLanguageConfig[];
}

export const klipperCfgLanguage: ICustomLanguageConfig = {
    id: "klipper-cfg",
    configuration: cfgConfig as languages.LanguageConfiguration,
    grammer: cfgLanguage,
    scope: "source.klipper-cfg"
}

export const klipperGcodeLanguage: ICustomLanguageConfig = {
    id: "klipper-gcode",
    configuration: gcodeConfig as languages.LanguageConfiguration,
    grammer: gcodeLanguage,
    scope: "source.klipper-gcode"
}

export const klipperScriptLanguage: ICustomLanguageConfig = {
    id: "klipper-script",
    grammer: scriptLanguage,
    scope: "source.klipper-script"
}

export const klipperCustomConfig: ICustomMonacoConfig = {
    themes: new Map<string, editor.IStandaloneThemeData>([
        ["klip-dark", klipperDark as editor.IStandaloneThemeData],
    ]),
    languages: [
        klipperCfgLanguage,
        klipperGcodeLanguage,
        klipperScriptLanguage
    ]
}