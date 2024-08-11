import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import FChatContext from '../context/FChatContext';
import '../css/Header.css';

export const Header = () => {
    const { userData, loadingUser, logout } = useContext(FChatContext);

    return (
        <header id="header" className="header bg-primary text-white py-3">
            {!loadingUser && (
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-6 col-md-4 text-start d-flex align-items-center">
                            <img src="https://res.cloudinary.com/dgrhyyuef/image/upload/v1723362469/ad9gef3q2taag1sjeakj.png" alt="Logo" className="header-logo" />
                            <span className="brand ms-2">Chatdi</span>
                        </div>
                        <div className="col-6 col-md-4 text-end text-md-center">
                            <nav className="d-flex justify-content-end justify-content-md-center">
                                {userData && (
                                    <>
                                        <NavLink to="/chat" className={({ isActive }) => 'nav-link ' + (isActive ? 'active fw-bold' : '')}>Chat</NavLink>
                                        <NavLink to="/profile" className={({ isActive }) => 'nav-link ' + (isActive ? 'active fw-bold' : '')}>Perfil</NavLink>
                                    </>
                                )}
                                {!userData && (
                                    <NavLink to="/login" className={({ isActive }) => 'nav-link ' + (isActive ? 'active fw-bold' : '')}>Login</NavLink>
                                )}
                                <NavLink to="/about" className={({ isActive }) => 'nav-link ' + (isActive ? 'active fw-bold' : '')}>About</NavLink>
                            </nav>
                        </div>
                        <div className="col-12 col-md-4 text-end mt-3 mt-md-0">
                            {userData && (
                                <button className="btn btn-sm btn-light" onClick={() => logout()}>Logout <i className="fa-solid fa-arrow-right-from-bracket"></i></button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};
