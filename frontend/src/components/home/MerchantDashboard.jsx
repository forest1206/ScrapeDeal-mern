// react
import React, { useEffect, useMemo, useState } from 'react';

import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { API_URL } from '../../api/config';
import shopApi from '../../api/shop';

function MerchantDashboard() {
    const [products, setProducts] = useState(null);

    const { user } = useSelector((state) => state.auth);

    const getDashboardData = () => {
        shopApi.getAdminProducts(user).then(
            (res) => setProducts(res.items),
        );
    };

    useEffect(() => {
        if (!user) return;
        getDashboardData();
    }, [user]);

    return (
        <React.Fragment>
            <div className="container-fluid">
                <div className="container">
                    <div className="products-view__content">
                        <div className="card-table d-flex flex-column">
                            <div className="table-responsive-sm">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>id</th>
                                            <th>Name</th>
                                            <th>Category</th>
                                            <th>description</th>
                                            <th>price</th>
                                            <th>images</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products?.length > 0 && products.map((item, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td><Link to={`/admin/product/${item.slug}`}>{item.name}</Link></td>
                                                <td>{item.category.name}</td>
                                                <td>{item.description}</td>
                                                <td>{item.price}</td>
                                                <td>
                                                    <img style={{ maxWidth: 200 }} src={`${API_URL}${item?.images[0]}`} alt={item.name} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default MerchantDashboard;
