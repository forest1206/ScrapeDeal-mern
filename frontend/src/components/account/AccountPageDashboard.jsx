// react
import React from 'react';

// third-party
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

// data stubs
import { useSelector } from 'react-redux';
import theme from '../../data/theme';

export default function AccountPageDashboard() {
    const { user } = useSelector((state) => state.auth);

    return (
        <div className="dashboard">
            <Helmet>
                <title>{`My Account — ${theme.name}`}</title>
            </Helmet>

            <div className="dashboard__profile card profile-card">
                <div className="card-body profile-card__body">
                    <div className="profile-card__avatar">
                        <img src="images/avatars/avatar-3.jpg" alt="" />
                    </div>
                    <div className="profile-card__name">{user && user?.name}</div>
                    <div className="profile-card__email">{user && user.email}</div>
                    <div className="profile-card__edit">
                        <Link to="profile" className="btn btn-secondary btn-sm">Edit Profile</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
