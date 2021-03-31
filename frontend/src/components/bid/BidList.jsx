import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import categoryApi from '../../api/category';
import { API_URL } from '../../api/config';
import bidsApi from '../../api/bids';
import PageHeader from '../shared/PageHeader';
import theme from '../../data/theme';

function UserBidsPage(props) {
    const [categories, setCategories] = useState([]);
    const [bids, setBids] = useState([]);

    const history = useHistory();
    const { user } = useSelector((state) => state.auth);

    const getCategories = async () => {
        const array = await categoryApi.getCategoryList();
        setCategories(array);
    };

    // const renderCategory = (id) => {
    //     // eslint-disable-next-line no-underscore-dangle
    //     const index = categories.findIndex((item) => item._id === id);
    //     if (index > -1) {
    //         return categories[index].name;
    //     }
    //     return '';
    // };

    // Load Categories
    useEffect(() => {
        getCategories();
    }, []);

    // Load bids
    useEffect(() => {
        // eslint-disable-next-line no-underscore-dangle
        bidsApi.getUserBids(user._id).then(
            (res) => setBids(res),
        );
    }, [user]);

    const onAddClick = () => {
        history.push('/admin/product/new');
    };

    if (!bids) {
        return null;
    }

    return (
        <React.Fragment>
            <Helmet>
                <title>My bids</title>
            </Helmet>
            <PageHeader header="My bids" />
            <div className="container">
                <div className="products-view__content">
                    <div className="card-table d-flex flex-column">
                        <div className="table-responsive-sm">
                            <table>
                                <thead>
                                    <tr>
                                        <th>id</th>
                                        <th>Offer title</th>
                                        <th>Offer category</th>
                                        <th>Bid Amount</th>
                                        <th>Bid status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bids?.length > 0 && bids.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            {/* eslint-disable-next-line no-underscore-dangle */}
                                            <td><Link to={`/product/${item.product.slug}`}>{item.product.name}</Link></td>
                                            <td>{item.product.category}</td>
                                            <td>{item.amount}</td>
                                            <td>{item.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="products-view__pagination">
                    {/* <Pagination */}
                    {/*    current={options.page || productsList.page} */}
                    {/*    siblings={2} */}
                    {/*    total={productsList.pages} */}
                    {/*    onPageChange={handlePageChange} */}
                    {/* /> */}
                </div>
            </div>
        </React.Fragment>
    );
}

export default UserBidsPage;
