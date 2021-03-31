// react
import React from 'react';

// third-party
import { Helmet } from 'react-helmet-async';
import {
    Redirect, Route, Switch, useHistory,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

// application
import { useSelector } from 'react-redux';
import Footer from './footer';
import Header from './header';
import MobileHeader from './mobile/MobileHeader';
import MobileMenu from './mobile/MobileMenu';

// pages
import BidList from './bid/BidList';
import HomePage from './home/HomePage';
import AccountLayout from './account/AccountLayout';
import AccountPageLogin from './account/AccountPageLogin';
import AccountPageRegister from './account/AccountPageRegister';
import ShopPage from './shop/ShopPage';
import ShopPageProduct from './shop/ShopPageProduct';
import SitePageNotFound from './site/SitePageNotFound';
import ProductEdit from './product/ProductEdit';
import ProductCreate from './product/ProductCreate';
import ProductList from './product/ProductList';

// data stubs
import theme from '../data/theme';
import Search from './header/Search';
import UserList from './user/UserList';
import PrivateRoute from './shared/PrivateRoute';

function Layout(props) {
    const { match } = props;
    const isAuthenticated = localStorage.getItem('user') !== null;

    return (
        <React.Fragment>
            <Helmet>
                <title>{theme.name}</title>
                <meta name="description" content={theme.fullName} />
            </Helmet>

            <ToastContainer autoClose={3000} />

            <MobileMenu />

            <div className="site">
                <header className="site__header d-lg-none">
                    <MobileHeader />
                </header>

                <header className="site__header d-lg-block d-none">
                    <Header />
                </header>

                <div className="site__body">
                    <div className="container mt-4 mb-4">
                        <Search context="header" />
                    </div>

                    <Switch>
                        <Route exact path={`${match.path}`} component={HomePage} />
                        <Route exact path="/login" component={AccountPageLogin} />
                        <Route exact path="/register" component={AccountPageRegister} />
                        {/*
                        // Product
                        */}
                        <Route
                            exact
                            path="/product"
                            render={(props) => (
                                <ShopPage {...props} columns={3} viewMode="grid" sidebarPosition="start" />
                            )}
                        />
                        <Route
                            exact
                            path="/product/:productSlug"
                            render={(props) => (isAuthenticated
                                ? (
                                    <ShopPageProduct
                                        {...props}
                                        layout="standard"
                                        productSlug={props.match.params.productSlug}
                                    />
                                ) : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />)}
                        />

                        {/*
                        // Bid
                        */}
                        <Route
                            exact
                            path="/bids"
                            component={BidList}
                            render={(props) => (isAuthenticated
                                ? <BidList />
                                : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />)}
                        />

                        {/*
                        // Account
                        */}
                        <PrivateRoute path="/account" component={AccountLayout} />

                        {/*
                        // Product admin
                        */}
                        <PrivateRoute exact path="/admin/product" component={ProductList} />
                        <PrivateRoute
                            exact
                            path="/admin/product/new"
                            component={ProductCreate}
                        />
                        <Route
                            path="/admin/product/:productSlug"
                            render={(props) => (isAuthenticated
                                ? (
                                    <ProductEdit
                                        {...props}
                                        productSlug={props.match.params.productSlug}
                                    />
                                )
                                : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />)}
                        />

                        {/*
                        // User
                        */}
                        <PrivateRoute exact path="/admin/user" component={UserList} />
                        {/*
                        // Page Not Found
                        */}
                        <Route component={SitePageNotFound} />
                    </Switch>
                </div>

                <footer className="site__footer">
                    <Footer />
                </footer>
            </div>
        </React.Fragment>
    );
}

export default Layout;
