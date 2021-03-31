// react
import React, { useEffect, useState } from 'react';

// third-party
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';

// application
import { useSelector } from 'react-redux';
import className from 'classnames';
import moment from 'moment';
import { toast } from 'react-toastify';
import PageHeader from '../shared/PageHeader';
import Product from '../shared/Product';
import shopApi from '../../api/shop';

// blocks
import BlockLoader from '../blocks/BlockLoader';

// data stubs
import theme from '../../data/theme';
import bidsApi from '../../api/bids';

const initBid = {
    _id: null,
    amount: '',
    description: '',
    product: null,
};

function ShopPageProduct(props) {
    const { productSlug, layout, sidebarPosition } = props;
    const [isLoading, setIsLoading] = useState(true);
    const [product, setProduct] = useState(null);
    const [productStatus, setProductStatus] = useState(null);

    const [bids, setBids] = useState(null);
    const [showBidForm, setShowBidForm] = useState(true);
    const [bid, setBid] = useState(initBid);

    const userBid = null;
    const { user } = useSelector((state) => state.auth);

    // Load product.
    useEffect(() => {
        let canceled = false;

        setIsLoading(true);

        shopApi.getProductBySlug(productSlug).then((product) => {
            console.log('getProductBySlug', product);
            setBid({
                ...bid,
                amount: product.price,
                // eslint-disable-next-line no-underscore-dangle
                product: product._id,
            });

            if (canceled) {
                return;
            }

            setProduct(product);
            setIsLoading(false);
        });

        return () => {
            canceled = true;
        };
    }, [productSlug, setIsLoading]);

    // Load bids
    useEffect(() => {
        if (product) {
            // eslint-disable-next-line no-underscore-dangle
            bidsApi.getProductBids(product._id).then((bids) => {
                setBids(bids);
            });
        }
    }, [product]);

    useEffect(() => {
        if (!bids) {
            setProductStatus('PENDING');
            return;
        }
        const index = bids.findIndex((item) => item.user.email === user?.email);
        if (index > -1) {
            setBid(bids[index]);
            setShowBidForm(false);
        }

        if (bids.findIndex((bid) => bid.status === 'ACCEPTED') > -1) {
            setProductStatus('ACCEPTED');
            setShowBidForm(false);
        }
    }, [bids]);

    if (isLoading) {
        return <BlockLoader />;
    }

    const breadcrumb = [
        { title: 'Scrap Deals', url: '/product' },
        { title: product.name, url: `/product/${product.slug}` },
    ];

    const handleEditClick = () => {
        setShowBidForm(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // eslint-disable-next-line no-underscore-dangle
        if (bid._id === null) {
            bidsApi.createBid(user, bid).then(
                (data) => {
                    setBids([...bids, data]);
                    toast.success('Bid has been placed successfully!');
                },
                (error) => {
                    toast.warning('Server error!');
                },
            );
        } else {
            bidsApi.updateBid(user, bid).then(
                (data) => {
                    const array = bids;
                    const index = array.indexOf(bid);
                    array[index] = bid;
                    setBids(array);
                    setShowBidForm(false);
                    toast.success('Bid has been updated successfully!');
                },
                (error) => {
                    toast.warning('Server error!');
                },
            );
        }
    };

    const renderBids = () => (
        <React.Fragment>
            <h3 className="my-4 font-weight-bold">Proposals</h3>
            <ul className="list-unstyled">
                {
                    showBidForm !== true && bids.findIndex((item) => item.user.email === user.email) > -1 && (
                        <li className={className('bids-list__item active',
                            {
                                accepted: bid.status === 'ACCEPTED',
                            })}
                        >
                            <div className="bid">
                                <div className="d-flex justify-content-between">
                                    <div className=" bid__author">{bid.user.name}</div>
                                    <div className=" bid__amount">
                                        $
                                        {bid.amount}
                                    </div>
                                </div>
                                <div className=" bid__text">{bid.description}</div>
                                <div className="d-flex justify-content-between">
                                    <div className="bid__date">{moment(bid.createdAt).format('YYYY-MM-DD')}</div>
                                    {
                                        productStatus !== 'ACCEPTED'
                                        && <button type="button" className="btn btn-primary" onClick={handleEditClick}>Edit</button>
                                    }
                                </div>
                            </div>
                        </li>
                    )
                }
                {
                    bids && bids.map((item, index) => {
                        if (item.user.email === user?.email) return null;

                        return (
                            <li
                                key={index}
                                className={className('bids-list__item',
                                    {
                                        active: item.user.email === user?.email,
                                        accepted: item.status === 'ACCEPTED',
                                    })}
                            >
                                <div className="bid">
                                    <div className="d-flex justify-content-between">
                                        <div className=" bid__author">{item.user.name}</div>
                                        <div className=" bid__amount">
                                            $
                                            {item.amount}
                                        </div>
                                    </div>
                                    <div className=" bid__text">{item.description}</div>
                                    <div className="d-flex">
                                        <div className="bid__date">{moment(item.createdAt).format('YYYY-MM-DD')}</div>
                                    </div>
                                </div>
                            </li>
                        );
                    })
                }
            </ul>
        </React.Fragment>
    );

    const renderBidForm = () => (
        <form className="bids-view__form" onSubmit={handleSubmit}>
            <h3 className="bids-view__header">
                {console.log('__bid', bid)}
                {/* eslint-disable-next-line no-underscore-dangle */}
                {bid._id === null ? 'Place a bid' : 'Edit your bid'}
            </h3>
            <div className="row">
                <div className="col-12 col-lg-9 col-xl-8">
                    <div className="form-row">
                        <div className="form-group col-md-4">
                            <label htmlFor="bidder-amount">Bid Amount </label>
                            <input
                                type="number"
                                className="form-control"
                                id="bidder-amount"
                                value={bid.amount}
                                placeholder="Bid Amount"
                                onChange={(e) => setBid({
                                    ...bid,
                                    amount: e.target.value,
                                })}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="bid-text">Describe your proposal </label>
                        <textarea
                            className="form-control"
                            id="bid-text"
                            rows="6"
                            value={bid.description}
                            onChange={(e) => setBid({
                                ...bid,
                                description: e.target.value,
                            })}
                        />
                    </div>
                    <div className="form-group mb-0">
                        <button type="submit" className="btn btn-primary btn-lg">Save</button>
                    </div>
                </div>
            </div>
        </form>
    );

    return (
        <React.Fragment>
            <Helmet>
                <title>{`${product.name} — ${theme.name}`}</title>
            </Helmet>

            <PageHeader breadcrumb={breadcrumb} />

            <div className="block">
                <div className="container">
                    <Product product={product} layout={layout} status={productStatus} />
                    {renderBids()}
                    {showBidForm && renderBidForm()}
                </div>
            </div>
        </React.Fragment>
    );
}

ShopPageProduct.propTypes = {
    productSlug: PropTypes.string,
    /** one of ['standard', 'sidebar', 'columnar', 'quickview'] (default: 'standard') */
    layout: PropTypes.oneOf(['standard', 'sidebar', 'columnar', 'quickview']),
    /**
     * sidebar position (default: 'start')
     * one of ['start', 'end']
     * for LTR scripts "start" is "left" and "end" is "right"
     */
    sidebarPosition: PropTypes.oneOf(['start', 'end']),
};

ShopPageProduct.defaultProps = {
    layout: 'standard',
    sidebarPosition: 'start',
};

export default ShopPageProduct;
