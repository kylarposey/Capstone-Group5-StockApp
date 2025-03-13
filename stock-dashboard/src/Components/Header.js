import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import "../assets/css/style.css";

function Header() {
    const [user, setUser] = useState(null);
    const [portfolio, setPortfolio] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);

            if (currentUser) {
                const userDocRef = doc(db, "Users", currentUser.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    setPortfolio(userDoc.data().portfolio);
                }
            }
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setUser(null);
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    return (
        <nav className="header">
            <Link to="/" className="title">Stock App</Link>
            <ul className="nav-links">
                <li><Link to="/about">About</Link></li>

                {user && portfolio && (
                    <li className="dropdown">
                        <button className="nav-link-button" onClick={() => setShowDropdown(!showDropdown)}>
                            Portfolio
                        </button>
                        {showDropdown && (
                            <ul className="dropdown-menu">
                                {Object.keys(portfolio).map((key) => (
                                    <li key={key}>{key}: {portfolio[key] ? "✔️" : "❌"}</li>
                                ))}
                            </ul>
                        )}
                    </li>
                )}

                {!user ? (
                    <>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/newUser">Register</Link></li>
                    </>
                ) : (
                    <li><button onClick={handleLogout} className="nav-link-button">Logout</button></li>
                )}
            </ul>
        </nav>
    );
}

export default Header;
