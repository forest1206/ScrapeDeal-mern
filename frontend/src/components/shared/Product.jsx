// react
import React from 'react';

// third-party
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

// application
import AsyncAction from './AsyncAction';
import Currency from './Currency';
import ProductGallery from './ProductGallery';
import { compareAddItem } from '../../store/compare';
import { Compare16Svg, Wishlist16Svg } from '../../svg';
import { wishlistAddItem } from '../../store/wishlist';

function Product(props) {
    const {
        status,
        product,
        layout,
        wishlistAddItem,
        compareAddItem,
    } = props;

    const renderStatusBadge = (status) => {
        if (status === 'PENDING') return (<div className="badge badge-info  p-2 rounded-sm">Open</div>);
        if (status === 'ACCEPTED') return (<div className="badge badge-dark p-2 rounded-sm">ACCEPTED</div>);
        return 'Open';
    };

    return (
        <div className={`product product--layout--${layout}`}>
            <div className="product__content">
                <ProductGallery layout={layout} images={product.images} />

                <div className="product__info">
                    <div className="product__wishlist-compare">
                        <AsyncAction
                            action={() => wishlistAddItem(product)}
                            render={({ run, loading }) => (
                                <button
                                    type="button"
                                    data-toggle="tooltip"
                                    data-placement="right"
                                    title="Wishlist"
                                    onClick={run}
                                    className={classNames('btn btn-sm btn-light btn-svg-icon', {
                                        'btn-loading': loading,
                                    })}
                                >
                                    <Wishlist16Svg />
                                </button>
                            )}
                        />
                        <AsyncAction
                            action={() => compareAddItem(product)}
                            render={({ run, loading }) => (
                                <button
                                    type="button"
                                    data-toggle="tooltip"
                                    data-placement="right"
                                    title="Compare"
                                    onClick={run}
                                    className={classNames('btn btn-sm btn-light btn-svg-icon', {
                                        'btn-loading': loading,
                                    })}
                                >
                                    <Compare16Svg />
                                </button>
                            )}
                        />
                    </div>
                    <div className="row">
                        <div className="col-sm-12 col-lg-8">
                            <h1 className="product__name">{product.name}</h1>
                        </div>
                        <div className="col-sm-12 col-lg-4">
                            {
                                renderStatusBadge(status)
                            }
                        </div>
                    </div>
                    <div className="product__description">
                        {product.description}
                    </div>
                </div>
            </div>
        </div>
    );
}

Product.propTypes = {
    product: PropTypes.object.isRequired,
    layout: PropTypes.oneOf(['standard', 'sidebar', 'columnar', 'quickview']),
    status: PropTypes.string,
};

Product.defaultProps = {
    layout: 'standard',
    status: 'PENDING',
};

const mapDispatchToProps = {
    wishlistAddItem,
    compareAddItem,
};

export default connect(
    () => ({}),
    mapDispatchToProps,
)(Product);
