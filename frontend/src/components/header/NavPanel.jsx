// react
import React from 'react';

// third-party
import { connect, useSelector } from 'react-redux';

// application
import { Link } from 'react-router-dom';
import IndicatorAccount from './IndicatorAccount';
import NavLinks from './NavLinks';
import HeaderAccount from './HeaderAccount';
import Logo from '../Logo';
import { LogoSmallSvg } from '../../svg';

function NavPanel() {
    const { user } = useSelector((state) => state.auth);

    return (
        <div className="nav-panel">
            <div className="nav-panel__container container">
                <div className="nav-panel__row">
                    <div className="nav-panel__logo">
                        <Link to="/" className="mobile-header__logo"><Logo /></Link>
                    </div>
                    <div className="nav-panel__nav-links nav-links">
                        <NavLinks user={user} />
                    </div>
                    <div className="nav-panel__indicators">
                        {
                            user
                                ? <IndicatorAccount user={user} />
                                : <HeaderAccount />
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = (state) => ({
    wishlist: state.wishlist,
});

const mapDispatchToProps = {};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(NavPanel);
