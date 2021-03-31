// react
import React, { useEffect, useMemo, useState } from 'react';

import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import MerchantDashboard from './MerchantDashboard';
import MemberDashboard from './MemberDashboard';
import AdminDashboard from './AdminDashboard';
import PageHeader from '../shared/PageHeader';
import ProductListPage from '../product/ProductList';

function HomePage() {
    const { user } = useSelector((state) => state.auth);

    const renderContent = () => {
        if (!user) return (<MemberDashboard />);
        if (user?.role === 'ROLE_MEMBER') return (<MemberDashboard />);
        if (user?.role === 'ROLE_MERCHANT') return (<ProductListPage />);
        if (user?.role === 'ROLE_ADMIN') return (<AdminDashboard />);
        return null;
    };

    return (
        <React.Fragment>
            <Helmet>
                <title>Dashboard</title>
            </Helmet>
            {renderContent()}
        </React.Fragment>
    );
}

export default HomePage;
