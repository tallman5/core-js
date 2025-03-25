import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { ICustomMonacoConfig } from './monaco-languages';
import { loadCustomConfiguration, loadOnigasm, Monaco } from './monacoUtilities';
import { Registry } from 'monaco-textmate';
import { wireTmGrammars } from 'monaco-editor-textmate';

// Mock external dependencies
vi.mock('onigasm', () => ({
    loadWASM: vi.fn(() => Promise.resolve()),
    OnigRegExp: class MockOnigRegExp { }
}));

vi.mock('monaco-editor', () => ({
    editor: {
        defineTheme: vi.fn()
    },
    languages: {
        register: vi.fn(),
        setLanguageConfiguration: vi.fn()
    }
}));

vi.mock('monaco-editor-textmate', () => ({
    wireTmGrammars: vi.fn(() => Promise.resolve())
}));

vi.mock('./utils', () => ({
    loadScript: vi.fn()
}));

describe('Monaco Loader Utilities', () => {
    const mockMonaco = {
        editor: {
            defineTheme: vi.fn()
        },
        languages: {
            register: vi.fn(),
            setLanguageConfiguration: vi.fn()
        }
    } as unknown as Monaco;

    const mockConfig: ICustomMonacoConfig = {
        themes: new Map([['themeId', { base: 'vs', inherit: true, colors: {}, rules: [] }]]),
        languages: [
            {
                id: 'javascript',
                scope: 'source.js',
                grammer: '{}',
                configuration: {}
            }
        ]
    };

    beforeEach(() => {
        // Reset mocks
        vi.clearAllMocks();

        // Setup window mocks
        global.window = {
            require: undefined,
            monaco: undefined
        } as any;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('loadOnigasm()', () => {
        it('should load WASM and verify OnigRegExp', async () => {
            const { loadWASM } = await import('onigasm');
            const result = await loadOnigasm();

            expect(loadWASM).toHaveBeenCalledWith(
                'https://cdn.jsdelivr.net/npm/onigasm@latest/lib/onigasm.wasm'
            );
            expect(result).toBe(true);
        });

        // it('should throw error if OnigRegExp is not available', async () => {
        //     vi.doMock('onigasm', () => ({
        //         loadWASM: vi.fn(() => Promise.resolve()),
        //         OnigRegExp: undefined
        //     }));

        //     await expect(loadOnigasm()).rejects.toThrow('OnigRegExp is not loaded');
        // });
    });

    describe('loadCustomConfiguration()', () => {
        it('should register themes', async () => {
            await loadCustomConfiguration(mockMonaco, mockConfig);
            expect(mockMonaco.editor.defineTheme).toHaveBeenCalledWith(
                'themeId',
                mockConfig.themes.get('themeId')
            );
        });

        it('should register languages', async () => {
            await loadCustomConfiguration(mockMonaco, mockConfig);
            expect(mockMonaco.languages.register).toHaveBeenCalledWith({
                id: 'javascript'
            });
            expect(mockMonaco.languages.setLanguageConfiguration).toHaveBeenCalledWith(
                'javascript',
                mockConfig.languages[0].configuration
            );
        });

        // it('should wire TM grammars', async () => {
        //     await loadCustomConfiguration(mockMonaco, mockConfig);
        //     expect(wireTmGrammars).toHaveBeenCalled();

        //     // Verify registry was created with correct grammar definition
        //     const registryCall = (Registry as any).mock.calls[0][0];
        //     const grammarDef = await registryCall.getGrammarDefinition('source.js');
        //     expect(grammarDef).toEqual({
        //         format: 'json',
        //         content: '{}'
        //     });
        // });

        it('should return true on success', async () => {
            const result = await loadCustomConfiguration(mockMonaco, mockConfig);
            expect(result).toBe(true);
        });

        // it('should throw errors from wireTmGrammars', async () => {
        //     (wireTmGrammars as vi.Mock).mockRejectedValue(new Error('Grammar error'));
        //     await expect(loadCustomConfiguration(mockMonaco, mockConfig))
        //         .rejects.toThrow('Grammar error');
        // });
    });

    // describe('loadMonaco()', () => {
    //     const mockRequire = vi.fn((deps, callback) => {
    //         callback(mockMonaco);
    //     });
    //     mockRequire.config = vi.fn();

    //     beforeEach(() => {
    //         vi.mocked(loadOnigasm).mockResolvedValue(true);
    //     });

    //     it('should resolve immediately if Monaco is already loaded', async () => {
    //         global.window.monaco = mockMonaco;
    //         const result = await loadMonaco();
    //         expect(result).toBe(mockMonaco);
    //     });

    //     it('should load via require if loader.js is present', async () => {
    //         global.window.require = mockRequire;
    //         vi.mocked(loadScript).mockResolvedValue(undefined);

    //         const result = await loadMonaco();
    //         expect(loadScript).toHaveBeenCalledWith(
    //             'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.0/min/vs/loader.js'
    //         );
    //         expect(mockRequire.config).toHaveBeenCalledWith({
    //             paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.0/min/vs' }
    //         });
    //         expect(result).toBe(mockMonaco);
    //     });

    //     it('should poll for require if not immediately available', async () => {
    //         vi.useFakeTimers();
    //         let requireSet = false;

    //         // Mock require to appear after a delay
    //         vi.mocked(loadScript).mockImplementation(() => {
    //             setTimeout(() => {
    //                 global.window.require = mockRequire;
    //                 requireSet = true;
    //             }, 100);
    //             return Promise.resolve();
    //         });

    //         const loadPromise = loadMonaco();

    //         // Advance time until require is set
    //         while (!requireSet) {
    //             await vi.advanceTimersByTimeAsync(50);
    //         }

    //         const result = await loadPromise;
    //         expect(result).toBe(mockMonaco);
    //         vi.useRealTimers();
    //     });

    //     it('should load onigasm before loading Monaco', async () => {
    //         global.window.monaco = mockMonaco;
    //         await loadMonaco();
    //         expect(loadOnigasm).toHaveBeenCalled();
    //     });

    //     it('should reject if script loading fails', async () => {
    //         vi.mocked(loadScript).mockRejectedValue(new Error('Load failed'));
    //         await expect(loadMonaco()).rejects.toThrow('Load failed');
    //     });
    // });
});
