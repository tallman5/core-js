import { describe, it, vi, expect, beforeEach } from 'vitest';
import * as utils from './utils';
import * as onigasm from 'onigasm';
import { loadCustomConfiguration, loadMonaco, loadOnigasm } from './monacoUtilities';
import type { ICustomMonacoConfig } from './monaco-languages';
// import type { Monaco } from 'monaco-editor';

vi.mock('onigasm', () => ({
    loadWASM: vi.fn(),
    OnigRegExp: class { },
}));

vi.mock('monaco-editor', () => {
    return {
        editor: {
            defineTheme: vi.fn(),
        },
        languages: {
            register: vi.fn(),
            setLanguageConfiguration: vi.fn(),
        },
    };
});

vi.mock('monaco-textmate', () => ({
    Registry: vi.fn().mockImplementation(({ getGrammarDefinition }) => ({
        getGrammarDefinition,
    })),
}));

vi.mock('monaco-editor-textmate', () => ({
    wireTmGrammars: vi.fn().mockResolvedValue(true),
}));

vi.mock('./utils', () => ({
    loadScript: vi.fn().mockResolvedValue(true),
}));

describe('monacoUtilities', () => {
    beforeEach(() => {
        (globalThis as any).window = {};
    });

    it('loads Onigasm successfully', async () => {
        const result = await loadOnigasm();
        expect(result).toBe(true);
        expect(onigasm.loadWASM).toHaveBeenCalled();
    });

    it('throws error if OnigRegExp is not defined', async () => {
        (onigasm as any).OnigRegExp = undefined;
        await expect(loadOnigasm()).rejects.toThrow('OnigRegExp is not loaded');
    });

    it('loads custom Monaco configuration', async () => {
        const config: ICustomMonacoConfig = {
            themes: new Map([['dark', { base: 'vs-dark', inherit: true, rules: [], colors: {} }]]),
            languages: [
                {
                    id: 'customLang',
                    scope: 'source.custom',
                    configuration: {},
                    grammer: JSON.stringify({}),
                },
            ],
        };

        // const monacoMock = await import('monaco-editor') as Monaco;
        // const result = await loadCustomConfiguration(monacoMock, config);
        // expect(result).toBe(true);
        // expect(monacoMock.editor.defineTheme).toHaveBeenCalled();
        // expect(monacoMock.languages.register).toHaveBeenCalled();
        // expect(monacoMock.languages.setLanguageConfiguration).toHaveBeenCalled();
    });

    // it('loads monaco if already present on window', async () => {
    //     const fakeMonaco = await import('monaco-editor');
    //     (window as any).monaco = fakeMonaco;
    //     const result = await loadMonaco();
    //     expect(result).toBe(fakeMonaco);
    // });

    // it('loads monaco via loader.js', async () => {
    //     delete (window as any).monaco;
    //     let requireCalled = false;

    //     (window as any).require = vi.fn().mockImplementation(({ paths }, callback) => {
    //         requireCalled = true;
    //         callback(import('monaco-editor'));
    //     });

    //     const result = await loadMonaco();
    //     expect(result).toBeDefined();
    //     expect(requireCalled).toBe(true);
    // });

    // it('fails to load monaco if script fails', async () => {
    //     vi.spyOn(utils, 'loadScript').mockRejectedValueOnce(new Error('Script load error'));
    //     delete (window as any).monaco;

    //     await expect(loadMonaco()).rejects.toThrow('Script load error');
    // });
});
