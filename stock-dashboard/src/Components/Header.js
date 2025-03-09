import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import "../assets/css/style.css"; 

function Header() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Listen for auth state changes
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe(); // Cleanup listener on unmount
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setUser(null); // Reset user state after logout
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    return (
        <nav className="header">
            <Link to="/" className="title">Stock App</Link>

            <ul className="nav-links">
                <li><Link to="/about">About</Link></li>

                {/* Show Login/Register if user is NOT logged in */}
                {!user ? (
                    <>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/newUser">Register</Link></li>
                    </>
                ) : (
                    // Styled Logout button like a navigation link
                    <li><button onClick={handleLogout} className="nav-link-button">Logout</button></li>
                )}
            </ul>
        </nav>
    );
}

export default Header;
