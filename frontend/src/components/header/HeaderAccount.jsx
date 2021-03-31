// react
import React from 'react';

// third-party
import { Link } from 'react-router-dom';

export default function HeaderAccount() {
    return (
        <div className="d-flex ml-auto ">
            <Link to="/login" className="p-2 mt-2">Login</Link>
            <Link to="/register" className="p-2 mt-2">Register</Link>
        </div>
    );
}
