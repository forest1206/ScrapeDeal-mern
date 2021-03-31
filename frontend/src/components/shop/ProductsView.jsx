// react
import React, { useCallback, useState } from 'react';

// third-party
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// application
import Pagination from '../shared/Pagination';
import ProductCard from '../shared/ProductCard';
import {
    Filters16Svg,
    LayoutGrid16x16Svg,
    LayoutGridWithDetails16x16Svg,
    LayoutList16x16Svg,
} from '../../svg';
import { sidebarOpen } from '../../store/sidebar';

function useSetOption(option, filter, dispatch) {
    const callback = useCallback(filter, []);

    return useCallback((data) => {
        dispatch({
            type: 'SET_OPTION_VALUE',
            option,
            value: callback(data),
        });
    }, [option, callback, dispatch]);
}

function ProductsView(props) {
    const {
        isLoading,
        productsList,
        options,
        filters,
        dispatch,
        layout: propsLayout,
        grid,
        offcanvas,
        sidebarOpen,
    } = props;
    const [layout, setLayout] = useState(propsLayout);

    const handlePageChange = useSetOption('page', parseFloat, dispatch);
    const handleSortChange = useSetOption('sort', (event) => event.target.value, dispatch);
    const handleLimitChange = useSetOption('limit', (event) => parseFloat(event.target.value), dispatch);

    const handleResetFilters = useCallback(() => {
        dispatch({ type: 'RESET_FILTERS' });
    }, [dispatch]);

    const filtersCount = Object.keys(filters).map((x) => filters[x]).filter((x) => x).length;
    let viewModes = [
        { key: 'grid', title: 'Grid', icon: <LayoutGrid16x16Svg /> },
        { key: 'grid-with-features', title: 'Grid With Features', icon: <LayoutGridWithDetails16x16Svg /> },
        { key: 'list', title: 'List', icon: <LayoutList16x16Svg /> },
    ];

    viewModes = viewModes.map((viewMode) => {
        const className = classNames('layout-switcher__button', {
            'layout-switcher__button--active': layout === viewMode.key,
        });

        return (
            <button
                key={viewMode.key}
                title={viewMode.title}
                type="button"
                className={className}
                onClick={() => setLayout(viewMode.key)}
            >
                {viewMode.icon}
            </button>
        );
    });

    const productsListItems = productsList.items.map((product) => (
        <div key={product._id} className="products-list__item">
            <ProductCard product={product} />
        </div>
    ));

    const rootClasses = classNames('product-view', {
        'products-view--loading': isLoading,
    });

    const viewOptionsClasses = classNames('view-options', {
        'view-options--offcanvas--always': offcanvas === 'always',
        'view-options--offcanvas--mobile': offcanvas === 'mobile',
    });

    let content;

    if (productsListItems.length > 0) {
        content = (
            <div className="products-view__content">
                <div className="products-view__options">
                    <div className={viewOptionsClasses}>
                        <div className="view-options__filters-button">
                            <button type="button" className="filters-button" onClick={() => sidebarOpen()}>
                                <Filters16Svg className="filters-button__icon" />
                                <span className="filters-button__title">Filters</span>
                                {!!filtersCount && <span className="filters-button__counter">{filtersCount}</span>}
                            </button>
                        </div>
                        <div className="view-options__layout">
                            <div className="layout-switcher">
                                <div className="layout-switcher__list">
                                    {viewModes}
                                </div>
                            </div>
                        </div>
                        <div className="view-options__legend">
                            {`Showing ${productsList.from}—${productsList.to} of ${productsList.total} products`}
                        </div>
                        <div className="view-options__divider" />
                        <div className="view-options__control">
                            <label htmlFor="view-options-sort">Sort By</label>
                            <div>
                                <select
                                    id="view-options-sort"
                                    className="form-control form-control-sm"
                                    value={options.sort || productsList.sort}
                                    onChange={handleSortChange}
                                >
                                    <option value="default">Default</option>
                                    <option value="name_asc">Name (A-Z)</option>
                                    <option value="name_desc">Name (Z-A)</option>
                                </select>
                            </div>
                        </div>
                        <div className="view-options__control">
                            <label htmlFor="view-options-limit">Show</label>
                            <div>
                                <select
                                    id="view-options-limit"
                                    className="form-control form-control-sm"
                                    value={options.limit || productsList.limit}
                                    onChange={handleLimitChange}
                                >
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="20">20</option>
                                    <option value="30">30</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className="products-view__list products-list"
                    data-layout={layout !== 'list' ? grid : layout}
                    data-with-features={layout === 'grid-with-features' ? 'true' : 'false'}
                >
                    <div className="products-list__body">
                        {productsListItems}
                    </div>
                </div>

                <div className="products-view__pagination">
                    <Pagination
                        current={options.page || productsList.page}
                        siblings={2}
                        total={productsList.pages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        );
    } else {
        content = (
            <div className="products-view__empty">
                <div className="products-view__empty-title">No matching items</div>
                <div className="products-view__empty-subtitle">Try resetting the filters</div>
                <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={handleResetFilters}
                >
                    Reset filters
                </button>
            </div>
        );
    }

    return (
        <div className={rootClasses}>
            <div className="products-view__loader" />
            {content}
        </div>
    );
}

ProductsView.propTypes = {
    /**
     * Indicates that product is loading.
     */
    isLoading: PropTypes.bool,
    /**
     * ProductsList object.
     */
    productsList: PropTypes.object,
    /**
     * Products list options.
     */
    options: PropTypes.object,
    /**
     * Products list filters.
     */
    filters: PropTypes.object,
    /**
     * Category page dispatcher.
     */
    dispatch: PropTypes.func,
    /**
     * product list layout (default: 'grid')
     * one of ['grid', 'grid-with-features', 'list']
     */
    layout: PropTypes.oneOf(['grid', 'grid-with-features', 'list']),
    /**
     * product list layout (default: 'grid')
     * one of ['grid-3-sidebar', 'grid-4-full', 'grid-5-full']
     */
    grid: PropTypes.oneOf(['grid-3-sidebar', 'grid-4-full', 'grid-5-full']),
    /**
     * indicates when sidebar should be off canvas
     */
    offcanvas: PropTypes.oneOf(['always', 'mobile']),
};

ProductsView.defaultProps = {
    layout: 'grid',
    grid: 'grid-3-sidebar',
    offcanvas: 'mobile',
};

const mapDispatchToProps = {
    sidebarOpen,
};

export default connect(
    () => ({}),
    mapDispatchToProps,
)(ProductsView);
