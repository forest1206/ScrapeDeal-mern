// react
import React, { useEffect, useReducer } from 'react';

// third-party
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { connect, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';

// application
import BlockLoader from '../blocks/BlockLoader';
import CategorySidebar from './CategorySidebar';
import CategorySidebarItem from './CategorySidebarItem';
import PageHeader from '../shared/PageHeader';
import ProductsView from './ProductsView';
import shopApi from '../../api/shop';
import WidgetFilters from '../widgets/WidgetFilters';
import { sidebarClose } from '../../store/sidebar';

// data stubs
import theme from '../../data/theme';

function parseQueryOptions(location) {
    const query = queryString.parse(location);
    const optionValues = {};

    if (typeof query.page === 'string') {
        optionValues.page = parseFloat(query.page);
    }
    if (typeof query.limit === 'string') {
        optionValues.limit = parseFloat(query.limit);
    }
    if (typeof query.sort === 'string') {
        optionValues.sort = query.sort;
    }

    return optionValues;
}

function parseQueryFilters(location) {
    const query = queryString.parse(location);
    const filterValues = {};

    Object.keys(query).forEach((param) => {
        const mr = param.match(/^filter_([-_A-Za-z0-9]+)$/);

        if (!mr) {
            return;
        }

        const filterSlug = mr[1];

        filterValues[filterSlug] = query[param];
    });

    return filterValues;
}

function parseQuery(location) {
    return [
        parseQueryOptions(location),
        parseQueryFilters(location),
    ];
}

function buildQuery(options, filters) {
    const params = {};

    if (options.page !== 1) {
        params.page = options.page;
    }

    if (options.limit !== 10) {
        params.limit = options.limit;
    }

    if (options.sort !== 'default') {
        params.sort = options.sort;
    }

    Object.keys(filters).forEach((filterSlug) => {
        params[`filter_${filterSlug}`] = filters[filterSlug];
    });
    return queryString.stringify(params, { encode: false });
}

const initialState = {
    init: false,
    filterListIsLoading: true,
    filterList: null,
    productsListIsLoading: true,
    productsList: null,
    options: {},
    filters: {},
};

function reducer(state, action) {
    switch (action.type) {
    case 'FETCH_FILTERS':
        return { ...state, filterListIsLoading: true };
    case 'FETCH_FILTERS_SUCCESS':
        return { ...state, filterListIsLoading: false, filterList: action.filterList };
    case 'FETCH_PRODUCTS_LIST':
        return { ...state, productsListIsLoading: true };
    case 'FETCH_PRODUCTS_LIST_SUCCESS':
        return { ...state, productsListIsLoading: false, productsList: action.productsList };
    case 'SET_OPTION_VALUE':
        return {
            ...state,
            options: { ...state.options, page: 1, [action.option]: action.value },
        };
    case 'SET_FILTER_VALUE':
        return {
            ...state,
            options: { ...state.options, page: 1 },
            filters: { ...state.filters, [action.filter]: action.value },
        };
    case 'RESET_FILTERS':
        return { ...state, options: { ...state.options, page: 1 }, filters: {} };
    case 'RESET':
        return state.init ? initialState : state;
    default:
        throw new Error();
    }
}

function init(state) {
    const [options, filters] = parseQuery(window.location.search);

    return { ...state, options, filters };
}

function ShopPage(props) {
    const {
        columns,
        viewMode,
        sidebarPosition,
    } = props;
    const offcanvas = columns === 3 ? 'mobile' : 'always';
    const [state, dispatch] = useReducer(reducer, initialState, init);

    const { user } = useSelector((state) => state.auth);

    // Replace current url.
    useEffect(() => {
        const query = buildQuery(state.options, state.filters);
        const location = `${window.location.pathname}${query ? '?' : ''}${query}`;

        window.history.replaceState(null, '', location);
    }, [state.options, state.filters]);

    // Load filters list
    useEffect(() => {
        let canceled = false;
        dispatch({ type: 'FETCH_FILTERS' });
        shopApi.getFilterList().then((filterList) => {
            if (canceled) {
                return;
            }
            dispatch({ type: 'FETCH_FILTERS_SUCCESS', filterList });
        });
        return () => {
            canceled = true;
        };
    }, [dispatch]);

    // Load product.
    useEffect(() => {
        let canceled = false;
        dispatch({ type: 'FETCH_PRODUCTS_LIST' });
        shopApi.getProductsList(
            state.options,
            { ...state.filters },
            user,
        ).then((productsList) => {
            if (canceled) {
                return;
            }
            dispatch({ type: 'FETCH_PRODUCTS_LIST_SUCCESS', productsList });
        });

        return () => {
            canceled = true;
        };
    }, [dispatch, state.options, state.filters]);

    if (state.filterListIsLoading || (state.productsListIsLoading && !state.productsList)) {
        return <BlockLoader />;
    }

    const productsView = (
        <ProductsView
            isLoading={state.productsListIsLoading}
            productsList={state.productsList}
            options={state.options}
            filters={state.filters}
            dispatch={dispatch}
            layout={viewMode}
            grid={`grid-${columns}-${columns > 3 ? 'full' : 'sidebar'}`}
            offcanvas={offcanvas}
        />
    );

    const sidebarComponent = (
        <CategorySidebar offcanvas={offcanvas}>
            <CategorySidebarItem>
                <WidgetFilters
                    title="Filters"
                    offcanvas={offcanvas}
                    filters={state.filterList}
                    values={state.filters}
                    dispatch={dispatch}
                />
            </CategorySidebarItem>
        </CategorySidebar>
    );

    const renderContent = () => {
        if (columns > 3) {
            return (
                <div className="container">
                    <div className="block">{productsView}</div>
                    {sidebarComponent}
                </div>
            );
        }

        const sidebar = (
            <div className="shop-layout__sidebar">
                {sidebarComponent}
            </div>
        );

        return (
            <div className="container">
                <div className={`shop-layout shop-layout--sidebar--${sidebarPosition}`}>
                    {sidebarPosition === 'start' && sidebar}
                    <div className="shop-layout__content">
                        <div className="block">{productsView}</div>
                    </div>
                    {sidebarPosition === 'end' && sidebar}
                </div>
            </div>
        );
    };

    return (
        <React.Fragment>
            <Helmet>
                <title>{`Scrap Deals — ${theme.name}`}</title>
            </Helmet>

            <PageHeader header="Scrap Deals" />

            {renderContent()}
        </React.Fragment>
    );
}

ShopPage.propTypes = {
    columns: PropTypes.number,
    viewMode: PropTypes.oneOf(['grid', 'grid-with-features', 'list']),
    sidebarPosition: PropTypes.oneOf(['start', 'end']),
};

ShopPage.defaultProps = {
    columns: 3,
    viewMode: 'grid',
    sidebarPosition: 'start',
};

const mapStateToProps = (state) => ({
    sidebarState: state.sidebar,
    page: state.category,
});

const mapDispatchToProps = () => ({
    sidebarClose,
});

export default connect(mapStateToProps, mapDispatchToProps)(ShopPage);
