import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import axios from "axios";
import "../assets/css/style.css";
import "../assets/css/PortfolioPopup.css";

function Header() {
    const [user, setUser] = useState(null);
    const [portfolio, setPortfolio] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const popupRef = useRef(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const fetchPortfolio = async () => {
        if (!user) return;

        try {
            // Fetch updated portfolio with market status
            const response = await axios.get(`https://capstone-group5-stockapp.onrender.com/api/fetchPortfolioData?userId=${user.uid}`);
            const updatedPortfolio = response.data;

            console.log("Fetched Updated Portfolio:", updatedPortfolio);
            setPortfolio(updatedPortfolio);
        } catch (error) {
            console.error("Error fetching portfolio:", error);
        }
    };

    const handlePortfolioClick = async () => {
        await fetchPortfolio();
        setShowPopup(true);
    };

    return (
        <nav className="header">
            <Link to="/" className="title">Stock App</Link>
            <ul className="nav-links">
                <li><Link to="/about">About</Link></li>

                {user && (
                    <li>
                        <button className="nav-link-button" onClick={handlePortfolioClick}>
                            Portfolio
                        </button>
                    </li>
                )}

                {!user ? (
                    <>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/newUser">Register</Link></li>
                    </>
                ) : (
                    <li><button onClick={() => signOut(auth)} className="nav-link-button">Logout</button></li>
                )}
            </ul>

            {showPopup && portfolio && (
                <div ref={popupRef} className="popup">
                    <div className="popup-header">
                        Your Portfolio
                        <span className="close" onClick={() => setShowPopup(false)}>&times;</span>
                    </div>
                    <ul className="portfolio-list">
                        {portfolio.stocks?.length > 0 && (
                            <>
                                <h3>Stocks</h3>
                                {portfolio.stocks.map(({ symbol, changePercent }, index) => (
                                    <li key={index} className="portfolio-item">
                                        <span>{symbol}</span>
                                        <span className={`change-percent ${changePercent.includes('-') ? 'red' : 'green'}`}>
                                            {changePercent}
                                        </span>
                                    </li>
                                ))}
                            </>
                        )}
                        {portfolio.etfs?.length > 0 && (
                            <>
                                <h3>ETFs</h3>
                                {portfolio.etfs.map(({ symbol, changePercent }, index) => (
                                    <li key={index} className="portfolio-item">
                                        <span>{symbol}</span>
                                        <span className={`change-percent ${changePercent.includes('-') ? 'red' : 'green'}`}>
                                            {changePercent}
                                        </span>
                                    </li>
                                ))}
                            </>
                        )}
                        {portfolio.crypto?.length > 0 && (
                            <>
                                <h3>Cryptocurrency</h3>
                                {portfolio.crypto.map(({ symbol }, index) => (
                                    <li key={index} className="portfolio-item">
                                        <span>{symbol}</span>
                                        <span className="crypto-placeholder">N/A</span>
                                    </li>
                                ))}
                            </>
                        )}
                    </ul>
                </div>
            )}
        </nav>
    );
}

export default Header;
