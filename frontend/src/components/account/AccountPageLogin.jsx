// react
import React, { useEffect, useState } from 'react';

// third-party
import { Helmet } from 'react-helmet-async';
import { Link, useHistory } from 'react-router-dom';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';
import PageHeader from '../shared/PageHeader';
import { Check9x7Svg } from '../../svg';

// application

// data stubs
import theme from '../../data/theme';

import { signin } from '../../store/auth';

export default function AccountPageLogin() {
    const schema = yup.object().shape({
        email: yup.string().email('Email is not valid').required('Email is required!'),
        password: yup.string().required('Password is required'),
    });

    const { register, handleSubmit, errors } = useForm({
        resolver: yupResolver(schema),
    });

    const history = useHistory();
    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth);
    const { loading, error, user } = auth;

    useEffect(() => {
        localStorage.removeItem('state');
        localStorage.removeItem('user');
    }, []);

    const onSubmit = (data) => {
        dispatch(signin(history, data));
    };

    return (
        <React.Fragment>
            <Helmet>
                <title>{`Login — ${theme.name}`}</title>
            </Helmet>

            <div className="block">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-6 d-flex">
                            <div className="card flex-grow-1 mb-md-0">
                                <div className="card-body">
                                    <h3 className="card-title text-center">Login</h3>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className="form-group">
                                            <label htmlFor="register-email">Email address</label>
                                            <input
                                                id="register-email"
                                                type="text"
                                                className={classNames('form-control', { error: errors.name?.message })}
                                                placeholder="Enter email"
                                                name="email"
                                                ref={register}
                                            />
                                            <p className="input-error-text">{errors.email?.message}</p>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="register-password">Password</label>
                                            <input
                                                id="register-password"
                                                type="password"
                                                className={classNames('form-control', { error: errors.name?.message })}
                                                placeholder="Password"
                                                name="password"
                                                ref={register}
                                            />
                                            <p className="input-error-text">{errors.password?.message}</p>
                                        </div>
                                        <div className="form-group">
                                            <div className="form-check">
                                                <span className="form-check-input input-check">
                                                    <span className="input-check__body">
                                                        <input
                                                            id="login-remember"
                                                            type="checkbox"
                                                            className="input-check__input"
                                                        />
                                                        <span className="input-check__box" />
                                                        <Check9x7Svg className="input-check__icon" />
                                                    </span>
                                                </span>
                                                <label className="form-check-label" htmlFor="login-remember">
                                                    Remember Me
                                                </label>
                                            </div>
                                        </div>
                                        <div className="d-flex  mt-2 mt-md-3 mt-lg-4">
                                            <button type="submit" className="btn btn-primary">
                                                Login
                                            </button>
                                            <Link to="/register" className="ml-auto">register</Link>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
