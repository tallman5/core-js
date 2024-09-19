import { editor, languages } from "monaco-editor";
import { IGrammarDefinition } from "monaco-textmate";

export interface CustomLanguageConfig {
    id: string;
    configuration: languages.LanguageConfiguration;
    grammer: IGrammarDefinition;
}

export interface CustomMonacoConfig {
    themes: editor.IStandaloneThemeData[];
    languages: CustomLanguageConfig[];
}
