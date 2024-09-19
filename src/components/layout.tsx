import React, { ComponentPropsWithoutRef } from 'react'
import Header from './header';

export interface ILayout extends ComponentPropsWithoutRef<'div'> { }

const Layout = ({ children }: ILayout) => {
    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />
            <main style={{ flexGrow: 1 }}>
                {children}
            </main>
        </div>
    )
}

export default Layout
