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

export default function AccountPageProfile() {
    const schema = yup.object().shape({
        email: yup.string().email('Email is not valid').required('Email is required'),
        name: yup.string().min(5, 'Name should be at least 4 characters')
            .required('Name is required'),
    });

    const {
        register, handleSubmit, errors, reset,
    } = useForm({
        resolver: yupResolver(schema),
    });

    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (user) {
            reset({ name: user.name, email: user.email });
        }
    }, []);

    const onSubmit = (data) => {
        dispatch(updateUserProfile(data));
    };

    return (
        <div className="card">
            <Helmet>
                <title>Profile</title>
            </Helmet>

            <div className="card-header">
                <h5>Edit Profile</h5>
            </div>
            <div className="card-divider" />
            <div className="card-body">
                <div className="row no-gutters">
                    <div className="col-12 col-lg-7 col-xl-6">
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
