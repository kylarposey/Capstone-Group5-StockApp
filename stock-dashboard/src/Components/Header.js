import { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { NotificationContext } from "../App";
import "../assets/css/style.css";
import "../assets/css/PortfolioPopup.css";

function Header() {
    const [user, setUser] = useState(null);
    const [portfolio, setPortfolio] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [showInbox, setShowInbox] = useState(false);
    const {notifications, addNotification, removeNotification } = useContext(NotificationContext);
    //const inboxRef = useRef(null);
    const popupRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                addNotification("✅ Successfully Logged In!", false);
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    //
    const handleSignOut = async() => {
        try {
            await signOut(auth);
            setUser(null);
            //addNotification("🔓 Successfully Logged Out!", false);
            navigate("/");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <nav className="header">
            <Link to="/" className="title" id="home">Stock App</Link>
            <ul className="nav-links">
                {user && (
                    <li className="nav-item">
                        <button className="nav-link-button" onClick={() => setShowInbox(!showInbox)}>
                            Inbox {notifications.length > 0 && `(${notifications.length})`}
                        </button>
                        {showInbox && (
                            <div className="inbox-dropdown">
                                <h3>Inbox</h3>
                                {notifications.length > 0 ? (
                                    notifications.map((note) => (
                                        <div key={note.id} className="inbox-item">
                                            <span dangerouslySetInnerHTML={{ __html: note.message }} />
                                            <button className="delete-btn" onClick={() => removeNotification(note.id)}>✖</button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="inbox-empty">No notifications yet.</p>
                                )}
                            </div>
                        )}
                    </li>
                )}

                <li><Link to="/about" id="about-link">About</Link></li>

                {user && (
                    <li>
                        <button className="nav-link-button" onClick={handlePortfolioClick}>
                            Portfolio
                        </button>
                    </li>
                )}
                {user ? (
                    <li><button onClick={handleSignOut} className="nav-link-button">Logout</button></li>
                ) : (
                    <>
                       {/*  <li><Link to="/login">Login</Link></li>
                        <li><Link to="/newUser">Register</Link></li> */}
                        <li><Link to="/signUpSignIn">Signup or Sign in with Google</Link></li>

                    </>
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
                                    <li key={index} className="portfolio-item">
                                        <span>{stock.symbol}</span>
                                        <span className={`change-percent ${parseFloat(stock.changePercent) >= 0 ? "green" : "red"}`}>
                                            {stock.changePercent}
                                        </span>
                                    </li>
                                ))}
                            </>
                        )}

                        {/* ETFs */}
                        {portfolio.etfs && portfolio.etfs.length > 0 && (
                            <>
                                <h3>ETFs</h3>
                                {portfolio.etfs.map((etf, index) => (
                                    <li key={index} className="portfolio-item">
                                        <span>{etf.symbol}</span>
                                        <span className={`change-percent ${parseFloat(etf.changePercent) >= 0 ? "green" : "red"}`}>
                                            {etf.changePercent}
                                        </span>
                                    </li>
                                ))}
                            </>
                        )}

                        {/* Cryptocurrency */}
                        {portfolio.crypto && portfolio.crypto.length > 0 && (
                            <>
                                <h3>Cryptocurrency</h3>
                                {portfolio.crypto.map((coin, index) => (
                                    <li key={index} className="portfolio-item">
                                        <span>{coin.symbol}</span>
                                        <span className={`change-percent ${parseFloat(coin.changePercent) >= 0 ? "green" : "red"}`}>
                                            {coin.changePercent}
                                        </span>
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
