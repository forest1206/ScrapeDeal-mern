import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import className from 'classnames';
import moment from 'moment';
import { toast } from 'react-toastify';
import categoryApi from '../../api/category';
import BlockLoader from '../blocks/BlockLoader';
import bidsApi from '../../api/bids';
import productsApi from '../../api/products';

function ProductDetailPage(props) {
    const { productSlug } = props;
    const [currentProduct, setCurrentProduct] = useState(null);
    const [productStatus, setProductStatus] = useState(null);
    const [bids, setBids] = useState(null);

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);

    const [categories, setCategories] = useState([]);

    const { user } = useSelector((state) => state.auth);

    const history = useHistory();

    const getCategories = async () => {
        const array = await categoryApi.getCategoryList();
        setCategories(array);
    };

    const handlReset = () => {
        setCurrentProduct({
            name: '',
            category: '',
            description: '',
            price: '',
            image: '',
        });
    };

    const renderError = () => (
        errors.map((error, index) => (
            <p key={index}>{error}</p>
        ))
    );

    // Load Categories
    useEffect(() => {
        getCategories();
    }, []);

    // Load product.
    useEffect(() => {
        setLoading(true);
        productsApi.getProductById(user, productSlug)
            .then(
                (res) => {
                    setCurrentProduct(res);
                },
                (error) => {
                    toast.warning('Error while loading product detail');
                },
            );
        setLoading(false);
    }, [productSlug]);

    // Load bids.
    useEffect(() => {
        if (currentProduct === null || currentProduct === undefined) return;
        // eslint-disable-next-line no-underscore-dangle
        bidsApi.getProductBids(currentProduct._id).then((bids) => {
            setBids(bids);
        });
    }, [currentProduct]);

    useEffect(() => {
        if (!bids) {
            setProductStatus('PENDING');
            return;
        }
        if (bids.findIndex((bid) => bid.status === 'ACCEPTED') > -1) {
            setProductStatus('ACCEPTED');
        }
    }, [bids]);

    const handleAward = (bidId) => {
        // eslint-disable-next-line no-underscore-dangle
        bidsApi.awardBid(user, bidId).then(
            (data) => {
                toast.success('Bid has been awarded!');
                const updatedBids = bids.map((bid) => {
                    if (bid._id === bidId) {
                        // eslint-disable-next-line no-param-reassign
                        bid.status = 'ACCEPTED';
                    }
                    return bid;
                });
                setBids(updatedBids);
            },
            (error) => {
                toast.warning('Server error!');
            },
        );
    };

    const cancelAward = (bidId) => {
        // eslint-disable-next-line no-underscore-dangle
        bidsApi.cancelAward(user, bidId).then(
            (data) => {
                toast.success('Award has been canceled');
                const updatedBids = bids.map((bid) => {
                    if (bid._id === bidId) {
                        // eslint-disable-next-line no-param-reassign
                        bid.status = 'PENDING';
                    }
                    return bid;
                });
                setBids(updatedBids);
            },
            (error) => {
                toast.warning('Server error!');
            },
        );
    };

    const renderActionButton = (bid) => {
        if (productStatus === 'ACCEPTED') {
            if (bid.status === 'ACCEPTED') {
                // eslint-disable-next-line no-underscore-dangle
                return <button type="button" className="ml-auto btn btn-danger" onClick={() => cancelAward(bid._id)}>Cancel</button>;
            }
            return null;
        }
        return <button type="button" className="ml-auto btn btn-primary" onClick={() => handleAward(bid._id)}>Award</button>;
    };

    const renderBids = () => (
        <React.Fragment>
            <h3 className="my-4 font-weight-bold">Proposals</h3>
            <ul className="list-unstyled">
                {
                    bids && bids.map((bid, index) => (
                        <li key={index} className="bids-list__item">
                            <div className="bid">
                                <div className="d-flex justify-content-between">
                                    <div className=" bid__author">{bid.user.name}</div>
                                    <div className=" bid__amount">
                                        $
                                        {bid.amount}
                                    </div>
                                </div>
                                <div className=" bid__text">{bid.description}</div>
                                <div className=" bid__date">{moment(bid.createdAt).format('YYYY-MM-DD')}</div>
                                <div className="d-flex">
                                    {renderActionButton(bid)}
                                </div>
                            </div>
                        </li>
                    ))
                }
            </ul>
        </React.Fragment>
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        if (currentProduct.name === '') {
            setErrors([...errors, 'Name is required!']);
        }
        if (currentProduct.category === '') {
            setErrors([...errors, 'Select category']);
        }
        if (currentProduct.description === '') {
            setErrors([...errors, 'Description is required!']);
        }
        if (currentProduct.price === '') {
            setErrors([...errors, 'Price is required!']);
        }
        productsApi.updateProduct(currentProduct, user)
            .then(
                (res) => {
                    toast.success('One Product has been updated!');
                    history.push('/admin/product');
                },
            );
    };

    if (loading) return <BlockLoader />;

    return (
        <div className="container py-4 d-flex justify-content-md-center">
            <div className="col-md-6 col-12">
                {
                    renderError()
                }
                {
                    setCurrentProduct && (
                        <form onSubmit={handleSubmit}>
                            <h3>Edit Offer</h3>
                            <div className="form-group">
                                <label htmlFor="product-name">Name</label>
                                <input
                                    id="product-name"
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter product name"
                                    value={currentProduct?.name}
                                    onChange={(e) => setCurrentProduct({
                                        ...currentProduct,
                                        name: e.target.value,
                                    })}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="product-category">Category</label>
                                <select
                                    id="product-category"
                                    className="form-control form-control-sm"
                                    value={currentProduct?.category}
                                    onChange={(e) => setCurrentProduct({
                                        ...currentProduct,
                                        category: e.target.value,
                                    })}
                                >
                                    {
                                        categories?.length > 0 && categories.map((item, index) => (
                                            // eslint-disable-next-line no-underscore-dangle
                                            <option key={index} value={item._id}>{item.name}</option>
                                        ))
                                    }
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="product-description">Product Description</label>
                                <textarea
                                    id="product-description"
                                    className="form-control"
                                    placeholder="Enter product description"
                                    rows="5"
                                    value={currentProduct?.description}
                                    onChange={(e) => setCurrentProduct({
                                        ...currentProduct,
                                        description: e.target.value,
                                    })}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="product-price">Price ($)</label>
                                <input
                                    id="product-price"
                                    type="text"
                                    className="form-control"
                                    placeholder="Product price"
                                    value={currentProduct?.price}
                                    onChange={(e) => setCurrentProduct({
                                        ...currentProduct,
                                        price: e.target.value,
                                    })}
                                />
                            </div>
                            <div className="d-flex justify-content-around  mt-2 mt-md-3 mt-lg-4">
                                <button type="submit" className="btn btn-primary">
                                    Save
                                </button>
                                <button type="submit" className="btn btn-dark" onClick={handlReset}>
                                    Reset
                                </button>
                            </div>
                        </form>
                    )
                }
                {
                    renderBids()
                }
            </div>

        </div>
    );
}

export default ProductDetailPage;
