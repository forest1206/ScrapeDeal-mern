// react
import React, { useState } from 'react';

// third-party
import { Helmet } from 'react-helmet-async';
import { Link, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// application
import { useDispatch, useSelector } from 'react-redux';
// import { Check9x7Svg } from '../../svg';

import classNames from 'classnames';
import PageHeader from '../shared/PageHeader';

// data stubs
import theme from '../../data/theme';
import { signup } from '../../store/auth';

export default function AccountPageRegister() {
    const schema = yup.object().shape({
        email: yup.string().email('Email is not valid').required('Email is required'),
        name: yup.string().min(5, 'Name should be at least 4 characters')
            .required('Name is required'),
        password: yup.string().required('Password is required'),
        repeatPassword: yup.string()
            .min(8, `Password has to be at least ${8} characters!`)
            .oneOf([yup.ref('password'), null], 'Passwords must match'),
    });

    const { register, handleSubmit, errors } = useForm({
        resolver: yupResolver(schema),
    });

    const [isMerchant, setIsMerchant] = React.useState(false);

    const dispatch = useDispatch();
    const history = useHistory();
    const onSubmit = (data) => {
        dispatch(signup(history, { ...data, role: isMerchant }));
    };

    const handleCheckboxChange = (e) => {
        if (e.target.value === '1') {
            setIsMerchant(e.target.checked === true);
            return;
        }
        setIsMerchant(e.target.checked === false);
    };

    return (
        <React.Fragment>
            <Helmet>
                <title>{`Login — ${theme.name}`}</title>
            </Helmet>

            <div className="block">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-6 d-flex mt-4 mt-md-0">
                            <div className="card flex-grow-1 mb-0">
                                <div className="card-body">
                                    <h3 className="card-title text-center">Register</h3>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className="form-group">
                                            <label htmlFor="register-email">Name</label>
                                            <input
                                                id="register-name"
                                                type="text"
                                                className={classNames('form-control', { error: errors.name?.message })}
                                                placeholder="Enter name"
                                                name="name"
                                                ref={register}
                                            />
                                            <p className="input-error-text">{errors.name?.message}</p>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="register-email">Email address</label>
                                            <input
                                                id="register-email"
                                                type="text"
                                                className={classNames('form-control', { error: errors.email?.message })}
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
                                                className={classNames('form-control', { error: errors.password?.message })}
                                                placeholder="Password"
                                                name="password"
                                                ref={register}
                                            />
                                            <p className="input-error-text">{errors.password?.message}</p>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="register-confirm">Repeat Password</label>
                                            <input
                                                id="register-confirm"
                                                type="password"
                                                className={classNames('form-control', { error: errors.repeatPassword?.message })}
                                                placeholder="Confirm Password"
                                                name="repeatPassword"
                                                ref={register}
                                            />
                                            <p className="input-error-text">{errors.repeatPassword?.message}</p>
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-6 col-sm-12">
                                                <div className="form-check">
                                                    <input
                                                        id="seller-check"
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        value="1"
                                                        checked={isMerchant === true}
                                                        onChange={handleCheckboxChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="seller-check">Supplier</label>
                                                </div>
                                            </div>
                                            <div className="col-lg-6 col-sm-12">
                                                <div className="form-check">
                                                    <input
                                                        id="customer-check"
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        value="2"
                                                        checked={isMerchant === false}
                                                        onChange={handleCheckboxChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="customer-check">Customer</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group" />
                                        <div className="d-flex  mt-2 mt-md-3 mt-lg-4">
                                            <button type="submit" className="btn btn-primary">
                                                Register
                                            </button>
                                            <Link to="/login" className="ml-auto">Login</Link>
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
