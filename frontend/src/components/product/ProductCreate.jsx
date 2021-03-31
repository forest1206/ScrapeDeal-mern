import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';
import categoryApi from '../../api/category';
import BlockLoader from '../blocks/BlockLoader';
// import DropZone from './DropZone';
import DropzoneUploader from './DropzoneUploader';
import productsApi from '../../api/products';

const initProduct = {
    name: '',
    category: '',
    description: '',
    price: '',
};

function ProductCreate() {
    const [categories, setCategories] = useState([]);
    const [currentProduct, setCurrentProduct] = useState(initProduct);
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);

    const schema = yup.object().shape({
        name: yup.string().required('Name is required'),
        category: yup.string().required('Category is required'),
        description: yup.string().required('Description is required'),
        price: yup.number().required('Price is required'),
    });

    const { register, handleSubmit, errors } = useForm({
        resolver: yupResolver(schema),
    });

    const history = useHistory();
    const { user } = useSelector((state) => state.auth);

    const getCategories = async () => {
        const array = await categoryApi.getCategoryList();
        setCategories(array);
        // eslint-disable-next-line no-underscore-dangle
        setCurrentProduct({ ...currentProduct, category: array[0]._id });
    };

    const handlReset = () => {
        setCurrentProduct(initProduct);
    };

    // Load Categories
    useEffect(() => {
        getCategories();
    }, []);

    const onUploadImage = (res) => {
        files.push(res);
        setFiles(files);
    };

    const onSubmit = (data) => {
        const product = { ...data, images: files };
        setLoading(true);
        productsApi.createProduct(user, product);
        toast.success('Product has been created successfully!');
        setLoading(false);
        history.push('/admin/product');
    };

    if (loading) return <BlockLoader />;

    return (
        <div className="container py-4 d-flex justify-content-md-center">
            <div className="col-md-6 col-12">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <h3>Add a new Electronic</h3>
                    <div className="form-group">
                        <label htmlFor="product-name">Product Name</label>
                        <input
                            id="product-name"
                            type="text"
                            name="name"
                            ref={register}
                            className={classNames('form-control', { error: errors.name?.message })}
                            placeholder="Enter product name"
                            value={currentProduct?.name}
                            onChange={(e) => setCurrentProduct({
                                ...currentProduct,
                                name: e.target.value,
                            })}
                        />
                        <p className="input-error-text">{errors.name?.message}</p>
                    </div>
                    <div className="form-group">
                        <label htmlFor="product-category">Category</label>
                        <select
                            id="product-category"
                            name="category"
                            ref={register}
                            className={classNames('form-control', 'form-control-sm', { error: errors.category?.message })}
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
                        <p className="input-error-text">{errors.category?.message}</p>
                    </div>
                    <div className="form-group">
                        <label htmlFor="product-description">Product Description</label>
                        <textarea
                            id="product-description"
                            name="description"
                            ref={register}
                            className={classNames('form-control', 'form-control-sm', { error: errors.description?.message })}
                            placeholder="Enter product description"
                            rows="5"
                            value={currentProduct?.description}
                            onChange={(e) => setCurrentProduct({
                                ...currentProduct,
                                description: e.target.value,
                            })}
                        />
                        <p className="input-error-text">{errors.description?.message}</p>
                    </div>
                    <div className="form-group">
                        <label htmlFor="product-price">Price ($)</label>
                        <input
                            id="product-price"
                            type="text"
                            name="price"
                            ref={register}
                            className={classNames('form-control', { error: errors.price?.message })}
                            placeholder="Product price"
                            value={currentProduct?.price}
                            onChange={(e) => setCurrentProduct({
                                ...currentProduct,
                                price: e.target.value,
                            })}
                        />
                        <p className="input-error-text">{errors.price?.message}</p>
                    </div>
                    {/* eslint-disable-next-line react/jsx-no-undef */}
                    <DropzoneUploader onUploadSuccess={(res) => onUploadImage(res)} />
                    {/* <DropZone files={files} onFilesChange={(files) => setFiles(files)} /> */}
                    <div className="d-flex justify-content-around  mt-2 mt-md-3 mt-lg-4">
                        <button type="submit" className="btn btn-primary">
                            Save
                        </button>
                        <button type="submit" className="btn btn-dark" onClick={handlReset}>
                            Reset
                        </button>
                    </div>
                </form>
            </div>

        </div>
    );
}

export default ProductCreate;
