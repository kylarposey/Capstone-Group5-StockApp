import React from "react";
import { Link } from "react-router-dom";
import "../assets/css/style.css";  

function Header() {
    return (
        <nav className="header">
            <Link to="/" className="title">Stock App</Link>
            <ul className="nav-links">
                <li><Link to="/about">About</Link></li>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/newUser">Register</Link></li>
            </ul>
        </nav>
    );
}

export default Header;
