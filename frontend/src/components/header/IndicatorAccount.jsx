// react
import React from 'react';

// third-party
import { Link, useHistory } from 'react-router-dom';

// application
import { useDispatch } from 'react-redux';
import Indicator from './Indicator';
import { Person20Svg } from '../../svg';
import { logout } from '../../store/auth';

export default function IndicatorAccount(props) {
    const { user } = props;
    const dispatch = useDispatch();
    const history = useHistory();

    const handleLogout = () => {
        dispatch(logout());
        history.push('/login');
    };

    const dropdown = (
        <div className="account-menu">
            <div className="account-menu__divider" />
            <Link to="/account/dashboard" className="account-menu__user">
                <div className="account-menu__user-avatar">
                    <img src="images/avatars/avatar-3.jpg" alt="" />
                </div>
                <div className="account-menu__user-info">
                    <div className="account-menu__user-name">{user.name}</div>
                    <div className="account-menu__user-email">{user.email}</div>
                </div>
            </Link>
            <div className="account-menu__divider" />
            <ul className="account-menu__links">
                <li><Link to="/account/dashboard">Account</Link></li>
                <li><Link to="/account/profile">Edit Profile</Link></li>
                <li><Link to="/account/password">Password</Link></li>
            </ul>
            <div className="account-menu__divider" />
            <ul className="account-menu__links">
                <li><Link to="/login" onClick={handleLogout}>Logout</Link></li>
            </ul>
        </div>
    );

    return (
        <Indicator url="/account" dropdown={dropdown} icon={<Person20Svg />} user={user} />
    );
}
