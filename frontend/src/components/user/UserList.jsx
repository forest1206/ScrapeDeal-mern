import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Modal from 'react-modal';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';
import usersApi from '../../api/user';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        minWidth: '500px',
    },
    overlay: { zIndex: 9999 },
};

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root');

function UserList(props) {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    const { user } = useSelector((state) => state.auth);
    const [modalIsOpen, setIsOpen] = React.useState(false);

    const schema = yup.object().shape({
        email: yup.string().email('Email is not valid').required('Email is required'),
        name: yup.string().min(5, 'Name should be at least 4 characters')
            .required('Name is required'),
        status: yup.number().required('Status is required'),
        // role: yup.string().required('Role is required'),
    });
    const {
        register, handleSubmit, errors, setValue, reset,
    } = useForm({
        resolver: yupResolver(schema),
    });

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    async function getUsers() {
        const array = await usersApi.getUsers(user);
        setUsers(array);
    }

    // Load Categories
    useEffect(() => {
        getUsers();
    }, []);

    function onSubmit(data) {
        if (selectedUser) {
            const userObj = {
                id: selectedUser._id,
                ...data,
            };
            usersApi.updateUser(user, userObj).then(
                (res) => {
                    const updatedUsers = users.map((item) => {
                        if (item._id === selectedUser._id) {
                            return res;
                        }
                        return item;
                    });
                    setUsers(updatedUsers);
                    closeModal();
                },
            );
        }
        // usersApi.createUser()
    }

    function renderUserForm() {
        return (
            <React.Fragment>
                <h3 className="card-title text-center">{selectedUser?._id ? 'Edit user' : 'Add user'}</h3>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label htmlFor="email">Name</label>
                        <input
                            id="name"
                            type="text"
                            className={classNames('form-control', { error: errors.name?.message })}
                            placeholder="Enter name"
                            name="name"
                            ref={register}
                        />
                        <p className="input-error-text">{errors.name?.message}</p>
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email address</label>
                        <input
                            id="email"
                            type="text"
                            className={classNames('form-control', { error: errors.email?.message })}
                            placeholder="Enter email"
                            name="email"
                            ref={register}
                        />
                        <p className="input-error-text">{errors.email?.message}</p>
                    </div>
                    <div className="form-group">
                        <label htmlFor="status">Status</label>
                        <select
                            name="status"
                            ref={register}
                            className={classNames('form-control', { error: errors.status?.message })}
                        >
                            <option value="2">ALLOWED</option>
                            <option value="3">BLOCKED</option>
                        </select>
                        <p className="input-error-text">{errors.status?.message}</p>
                    </div>
                    <div className="d-flex  mt-2 mt-md-3 mt-lg-4">
                        <button type="submit" className="btn btn-primary">
                            Save
                        </button>
                    </div>
                </form>
            </React.Fragment>
        );
    }

    function renderModal() {
        return (
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >
                {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                <i className="fas fa-close" onClick={closeModal} />
                {renderUserForm()}
            </Modal>
        );
    }

    function onAddClick() {
        // history.push('/admin/product/new');
    }

    function onEditClick(id) {
        const userObj = users.find((user) => user._id === id);
        setSelectedUser(userObj);
        // setValue('name', userObj.name);
        const statusOption = ['PENDING', 'ALLOWED', 'BLOCKED'].indexOf(userObj.status) + 1;
        reset({ name: userObj.name, email: userObj.email, status: statusOption });
        openModal();
    }

    function onDeleteClick(id) {
        if (window.confirm('Are you sure?')) {
            usersApi.deleteUser(user, id).then(
                (res) => {
                    setUsers(users.filter((item) => item._id !== id));
                },
            );
        }
    }

    function renderRole(role) {
        return role.split('_')[1];
    }

    function renderStatus(status) {
        return (
            <div className={classNames('badge',
                {
                    'badge-info': status === 'ALLOWED',
                    'badge-primary': status === 'PENDING',
                    'badge-danger': status === 'BLOCKED',
                })}
            >
                {status}
            </div>
        );
    }

    if (!users) {
        return null;
    }

    return (
        <div className="container">
            <h4 className="mb-4 text-center">Users</h4>
            <div className="products-view__content">
                <div className="card-table d-flex flex-column">
                    {/* <button type="submit" className="btn btn-primary ml-auto mt-4 mb-4" onClick={onAddClick}> */}
                    {/*    Add */}
                    {/* </button> */}
                    <div className="table-responsive-sm">
                        <table>
                            <thead>
                                <tr>
                                    <th>id</th>
                                    <th>Name</th>
                                    <th>email</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>**</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users?.length > 0 && users.map((user, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{renderRole(user.role)}</td>
                                        <td>{renderStatus(user.status)}</td>
                                        <td>
                                            <div className="d-flex action-btns">
                                                <button
                                                    type="button"
                                                    className="btn-sm btn-primary"
                                                    onClick={() => onEditClick(user._id)}
                                                >
                                                    <i className="fas fa-edit" />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn-sm btn btn-danger"
                                                    onClick={() => onDeleteClick(user._id)}
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
                    {renderModal()}
                </div>
            </div>
        </div>
    );
}

export default UserList;
