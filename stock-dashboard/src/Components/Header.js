import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
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
            const userDocRef = doc(db, "Users", user.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                console.log("Fetched Portfolio:", userDoc.data().generatedPortfolio);
                setPortfolio(userDoc.data().generatedPortfolio);
            }
        } catch (error) {
            console.error("Error fetching portfolio:", error);
        }
    };

    const handlePortfolioClick = async () => {
        await fetchPortfolio();
        setShowPopup(true);
    };

    useEffect(() => {
        if (!showPopup || !popupRef.current) return;

        const popup = popupRef.current;
        let offsetX, offsetY, isDragging = false;

        const onMouseDown = (e) => {
            isDragging = true;
            offsetX = e.clientX - popup.getBoundingClientRect().left;
            offsetY = e.clientY - popup.getBoundingClientRect().top;
            popup.style.cursor = "grabbing";
        };

        const onMouseMove = (e) => {
            if (!isDragging) return;
            popup.style.left = `${e.clientX - offsetX}px`;
            popup.style.top = `${e.clientY - offsetY}px`;
            popup.style.transform = "none";
        };

        const onMouseUp = () => {
            isDragging = false;
            popup.style.cursor = "grab";
        };

        popup.addEventListener("mousedown", onMouseDown);
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);

        return () => {
            popup.removeEventListener("mousedown", onMouseDown);
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };
    }, [showPopup]);

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

            {/* Portfolio Popup */}
            {showPopup && portfolio && (
                <div ref={popupRef} className="popup" style={{ position: "absolute", cursor: "grab" }}>
                    <div className="popup-header">
                        Your Portfolio
                        <span className="close" onClick={() => setShowPopup(false)}>&times;</span>
                    </div>
                    <ul className="portfolio-list">
                        {/* Stocks */}
                        {portfolio.stocks && portfolio.stocks.length > 0 && (
                            <>
                                <h3>Stocks</h3>
                                {portfolio.stocks.map((stock, index) => (
                                    <li key={index}>{stock}</li>
                                ))}
                            </>
                        )}

                        {/* ETFs */}
                        {portfolio.etfs && portfolio.etfs.length > 0 && (
                            <>
                                <h3>ETFs</h3>
                                {portfolio.etfs.map((etf, index) => (
                                    <li key={index}>{etf}</li>
                                ))}
                            </>
                        )}

                        {/* Cryptocurrency */}
                        {portfolio.crypto && portfolio.crypto.length > 0 && (
                            <>
                                <h3>Cryptocurrency</h3>
                                {portfolio.crypto.map((coin, index) => (
                                    <li key={index}>{coin}</li>
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
