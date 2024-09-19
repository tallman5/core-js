import React, { useEffect, useRef, useState } from 'react';
import Layout from '../../components/layout';
import { loadKlipperLanguage, loadMonaco, Monaco } from '../../core-js';
import { editor } from 'monaco-editor';

const MonacoIndex = () => {
    const colARef = useRef<HTMLDivElement>(null);
    const [monaco, setMonaco] = useState<Monaco>();
    const [mEditor, setMEditor] = useState<editor.IStandaloneCodeEditor>();

    useEffect(() => {
        if (monaco) return;
        if (!colARef.current) return;

        loadMonaco().then((m) => {
            loadKlipperLanguage(m);
            const sae = m.editor.create(colARef.current!,
                {
                    language: 'klipper-cfg',
                    theme: 'klip-dark'
                });
            setMonaco(m);
            setMEditor(sae);
        });
    }, [monaco, colARef]);

    useEffect(() => {
        if (!mEditor) return;

        const loadContent = async () => {
            const txt = await (await fetch(`${process.env.PUBLIC_URL || ''}/hmtk.cfg`)).text();
            mEditor.setValue(txt);
        };

        loadContent();

    }, [mEditor]);

    return (
        <Layout>
            <div className='container'>
                <div className='row'>
                    <div className='col'>
                        <h1>Monaco Grammers</h1>
                    </div>
                </div>
            </div>
            <div className='container-fluid'>
                <div className='row'>
                    <div className='col'>
                        <div className='container'>
                            <h2>Klipper</h2>
                        </div>
                        <div ref={colARef} style={{ height: '300px' }}></div>
                    </div>
                    <div className='col'>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default MonacoIndex;