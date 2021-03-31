// react
import React from 'react';

// application
import NavPanel from './NavPanel';
import Topbar from './Topbar';

function Header(props) {
    return (
        <div className="site-header">
            <Topbar />
            <div className="site-header__nav-panel">
                <NavPanel />
            </div>
        </div>
    );
}

export default Header;
