// react
import React, { useEffect, useMemo, useState } from 'react';

// third-party
import { Helmet } from 'react-helmet-async';

import axios from 'axios';
import { useSelector } from 'react-redux';
import { API_URL } from '../../api/config';

function AdminDashboard() {
    const { user } = useSelector((state) => state.auth);
    const [data, setData] = useState(null);

    const getDashboardData = async () => {
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };
        console.log('getDashboardData', user, config);

        // eslint-disable-next-line no-underscore-dangle
        const { data } = await axios.post(`${API_URL}/api/dashboard`, { user: user._id }, config);
        setData(data);
    };

    useEffect(() => {
        if (!user) return;
        console.log('user', user);
        if (user.role === 'ROLE_ADMIN') getDashboardData();
    }, [user]);

    return (
        <React.Fragment>
            <Helmet>
                <title>Electronics</title>
            </Helmet>

            <div className="container-fluid">
                <div className="container">
                    {
                        data && (
                            <div className="row text-center">
                                <div className="col-lg-4 col-sm-12">
                                    <h3>
                                        Total Customers
                                        <br />
                                        <span>{data.countCustomer}</span>
                                    </h3>
                                </div>
                                <div className="col-lg-4 col-sm-12">
                                    <h3>
                                        Total Sellers
                                        <br />
                                        <span>{data.countSeller}</span>
                                    </h3>
                                </div>
                                <div className="col-lg-4 col-sm-12">
                                    <h3>
                                        Total Offers
                                        <br />
                                        <span>{data.countProduct}</span>
                                    </h3>
                                </div>
                            </div>
                        )
                    }

                </div>
            </div>
        </React.Fragment>
    );
}

export default AdminDashboard;
