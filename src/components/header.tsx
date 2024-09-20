import { Link } from 'gatsby'
import React, { useEffect, useState } from 'react'
import { isBrowser } from '../core-js/utilities/utils'

const Header = () => {
    const [navMenuVisible, setNavMenuVisible] = useState(false)
    const [pathname, setPathname] = useState('')

    useEffect(() => {
        if (isBrowser) {
            setPathname(window.location.pathname.toLowerCase())
        }
    }, [])

    return (
        <header>
            <nav className="navbar navbar-expand-md">
                <div className="container">
                    <Link className="navbar-brand" to='/'>
                        <img src='/icon.png' alt={'m'} width={32} />
                        <span style={{ marginLeft: '10px' }}>core-js Test Site</span>
                    </Link>
                    <button className={"navbar-toggler"} type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation"
                        onClick={() => { setNavMenuVisible(!navMenuVisible) }}>
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div style={{ justifyContent: 'space-between' }} className={(navMenuVisible === true) ? 'collapse navbar-collapse show' : 'collapse navbar-collapse'} id="navbarNavAltMarkup">
                        <div className={'navbar-nav'}>
                            {/* <Link className={(pathname.startsWith('/monaco')) ? 'nav-link active' : 'nav-link'} to="/monaco/">MONACO</Link>
                            <Link className={(pathname.startsWith('/posts/about')) ? 'nav-link active' : 'nav-link'} to="/posts/about/">ABOUT</Link>
                            {
                                (process.env.NAME === "DEV")
                                    ? <Link className={(pathname.startsWith('/scratch')) ? 'nav-link active' : 'nav-link'} to="/scratch/">SCRATCH</Link>
                                    : null
                            } */}
                        </div>
                        <div className='d-flex'>

                        </div>
                    </div>
                </div>
            </nav>
            <hr className='p-0 m-0' />
        </header>
    )
}

export default Header