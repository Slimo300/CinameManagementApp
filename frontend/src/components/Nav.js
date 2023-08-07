import React from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";

import logo from "../images/logo.png";

const Nav = ({ user, setUser }) => {

    const Logout = async () => {
        try {
            await axios.post("http://www.spellcinema.com/api/users/logout");
            setUser(null);
        } catch(err) {
            alert(err);
        }
    }

    return (
        <nav className="violet navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <a className="navbar-brand" href="/">
                    <img src={logo} alt="Logo" width="250" height="50" className="d-inline-block align-text-top" />
                </a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <a className="nav-link" href="/">Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/repertoire">Repertoire</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/pricing">Pricing</a>
                        </li>
                    </ul>
                    {!user?<NavLink className="nav-item nav-link px-2" to="/login">Login</NavLink>:null}
                    {!user?<NavLink className="nav-item nav-link px-2" to="/register">Register</NavLink>:null}
                    {user?<button className="btn violet btn-primary" onClick={Logout}>Log Out</button>:null}
                </div>
            </div>
        </nav>
    )
}

export default Nav;