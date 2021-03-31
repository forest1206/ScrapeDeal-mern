import React, {
    useCallback, useEffect, useReducer, useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import queryString from 'query-string';
import { toast } from 'react-toastify';
import categoryApi from '../../api/category';
import { API_URL } from '../../api/config';
import Pagination from '../shared/Pagination';
import BlockLoader from '../blocks/BlockLoader';
import productsApi from '../../api/products';

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

function buildQuery(options) {
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

    return queryString.stringify(params, { encode: false });
}

const initialState = {
    init: false,
    productsListIsLoading: true,
    productsList: null,
    options: {},
};

function reducer(state, action) {
    switch (action.type) {
    case 'FETCH_PRODUCTS_LIST':
        return { ...state, productsListIsLoading: true };
    case 'FETCH_PRODUCTS_LIST_SUCCESS':
        return { ...state, productsListIsLoading: false, productsList: action.productsList };
    case 'DELETE_PRODUCT':
        return { ...state, productsListIsLoading: true };
    case 'DELETE_PRODUCT_SUCCESS':
        return { ...state, productsListIsLoading: false };
    case 'SET_OPTION_VALUE':
        return {
            ...state,
            options: { ...state.options, page: 1, [action.option]: action.value },
        };
    case 'RESET':
        return state.init ? initialState : state;
    default:
        throw new Error();
    }
}

function init(state) {
    const [options] = parseQuery(window.location.search);

    return { ...state, options };
}

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

function ProductList(props) {
    const [categories, setCategories] = useState([]);
    const [state, dispatch] = useReducer(reducer, initialState, init);

    const handlePageChange = useSetOption('page', parseFloat, dispatch);
    const handleSortChange = useSetOption('sort', (event) => event.target.value, dispatch);
    const handleLimitChange = useSetOption('limit', (event) => parseFloat(event.target.value), dispatch);

    const { user } = useSelector((state) => state.auth);

    const history = useHistory();

    const getCategories = async () => {
        const array = await categoryApi.getCategoryList();
        setCategories(array);
    };

    // Replace current url.
    useEffect(() => {
        const query = buildQuery(state.options);
        const location = `${window.location.pathname}${query ? '?' : ''}${query}`;

        window.history.replaceState(null, '', location);
    }, [state.options, state.filters]);

    // Load Categories
    useEffect(() => {
        getCategories();
    }, []);

    // Load product.
    useEffect(() => {
        let canceled = false;
        dispatch({ type: 'FETCH_PRODUCTS_LIST' });
        productsApi.getProducts(
            user,
            state.options,
            { ...state.filters },
        ).then((productsList) => {
            if (canceled) {
                return;
            }
            dispatch({ type: 'FETCH_PRODUCTS_LIST_SUCCESS', productsList });
        });

        return () => {
            canceled = true;
        };
    }, [dispatch, state.options]);

    const onAddClick = () => {
        history.push('/admin/product/new');
    };

    const onDeleteClick = (id) => {
        if (window.confirm('Are you sure?')) {
            dispatch({ type: 'DELETE_PRODUCT' });
            productsApi.deleteProduct(user, id)
                .then(
                    (res) => {
                        dispatch({ type: 'DELETE_PRODUCT_SUCCESS' });
                        toast.success('One product has been deleted!');
                        dispatch({
                            type: 'SET_OPTION_VALUE',
                            option: 'page',
                            value: 1,
                        });
                    },
                );
        }
    };

    if (state.productsListIsLoading && !state.productsList) {
        return <BlockLoader />;
    }

    if (state.productsList.items.length > 0) {
        const { productsList, options } = state;
        return (
            <div className="container">
                <h4 className="mb-4 text-center">My Offers</h4>
                <div className="products-view__content">
                    <div className="card-table d-flex flex-column">
                        <button type="submit" className="btn btn-primary ml-auto mt-4 mb-4" onClick={onAddClick}>
                            Add
                        </button>
                        <div className="products-view__options">
                            <div className="view-options">
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
                                        <th>**</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productsList.items.map((product, index) => (
                                        <tr key={product._id}>
                                            <td>{index + 1}</td>
                                            <td><Link to={`/admin/product/${product.slug}`}>{product.name}</Link></td>
                                            <td>{product.category.name}</td>
                                            <td>{product.description}</td>
                                            <td>{product.price}</td>
                                            <td>
                                                <img style={{ maxWidth: 200 }} src={`${API_URL}${product?.images[0]}`} alt={product.name} />
                                            </td>
                                            <td>
                                                <div className="d-flex action-btns">
                                                    <Link to={`/admin/product/${product.slug}`} className="btn-sm btn-primary">
                                                        <i className="fas fa-edit" />
                                                    </Link>
                                                    {/* eslint-disable-next-line no-underscore-dangle */}
                                                    <button
                                                        type="button"
                                                        className="btn-sm btn btn-danger"
                                                        onClick={() => onDeleteClick(product._id)}
                                                    >
                                                        <i className="fas fa-trash" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
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
    }
    return (
        <div className="products-view__empty">
            <div className="products-view__empty-title">No matching items</div>
            <div className="products-view__empty-subtitle">Try resetting the filters</div>
        </div>
    );
}

export default ProductList;
