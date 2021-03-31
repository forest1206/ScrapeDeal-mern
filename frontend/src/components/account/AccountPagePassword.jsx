// react
import React, { useEffect } from 'react';

// third-party
import { Helmet } from 'react-helmet-async';

// data stubs
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile } from '../../store/auth';

export default function AccountPagePassword() {
    const schema = yup.object().shape({
        currentPassword: yup.string().required('Current password is required'),
        password: yup.string().required('New password is required')
            .min(6, `Password has to be at least ${6} characters!`),
        confirmPassword: yup.string()
            .min(6, `Password has to be at least ${6} characters!`)
            .oneOf([yup.ref('password'), null], 'Passwords must match'),
    });

    const {
        register, handleSubmit, errors,
    } = useForm({
        resolver: yupResolver(schema),
    });

    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const onSubmit = (data) => {
        console.log('updateUserProfile', data);
        const user = {
            password: data.password,
            currentPassword: data.currentPassword,
        };

        dispatch(updateUserProfile(user));
    };

    return (
        <div className="card">
            <Helmet>
                <title>Profile</title>
            </Helmet>

            <div className="card-header">
                <h5>Change Password</h5>
            </div>
            <div className="card-divider" />
            <div className="card-body">
                <div className="row no-gutters">
                    <div className="col-12 col-lg-7 col-xl-6">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="form-group">
                                <label htmlFor="current-password">Current Password</label>
                                <input
                                    id="current-password"
                                    type="password"
                                    className={classNames('form-control', { error: errors.currentPassword?.message })}
                                    placeholder="Current Password"
                                    name="currentPassword"
                                    ref={register}
                                />
                                <p className="input-error-text">{errors.currentPassword?.message}</p>
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">New Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    className={classNames('form-control', { error: errors.password?.message })}
                                    placeholder="New Password"
                                    name="password"
                                    ref={register}
                                />
                                <p className="input-error-text">{errors.password?.message}</p>
                            </div>
                            <div className="form-group">
                                <label htmlFor="confirm-password">Repeat Password</label>
                                <input
                                    id="confirm-password"
                                    type="password"
                                    className={classNames('form-control', { error: errors.confirmPassword?.message })}
                                    placeholder="Confirm Password"
                                    name="confirmPassword"
                                    ref={register}
                                />
                                <p className="input-error-text">{errors.confirmPassword?.message}</p>
                            </div>
                            <div className="form-group" />
                            <div className="d-flex  mt-2 mt-md-3 mt-lg-4">
                                <button type="submit" className="btn btn-primary">
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
