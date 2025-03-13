import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import "../assets/css/style.css";

function Home() {
    const [ticker, setTicker] = useState("");
    const [stockData, setStockData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [position, setPosition] = useState({ x: 50, y: 50 });
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // Track user authentication state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            console.log("Auth state changed: ", currentUser); // Debugging
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    const fetchStockPrice = async () => {
        setLoading(true);
        setError("");
        setStockData(null);
        setShowPopup(false);

        const API_URL = process.env.NODE_ENV === "development"
        ? "http://localhost:5000/api/stock"
        : "https://capstone-group5-stockapp.onrender.com/api/stock";

    try {
        const response = await axios.get(`${API_URL}?symbol=${ticker}`);

            const data = response.data;
            if (!data["Global Quote"] || !data["Global Quote"]["01. symbol"]) {
                setError("Invalid Ticker or API Error");
                setLoading(false);
                return;
            }

            const stockInfo = {
                ticker: data["Global Quote"]["01. symbol"] || "N/A",
                price: data["Global Quote"]["05. price"] || "N/A",
                change: data["Global Quote"]["09. change"] || "N/A",
                changePercent: data["Global Quote"]["10. change percent"] || "N/A",
                timestamp: new Date().toISOString(),
            };

            setStockData(stockInfo);
            setShowPopup(true);
            setLoading(false);
        } catch (err) {
            setError("Error fetching stock data");
            console.error("Fetch Error:", err);
            setLoading(false);
        }
    };

    const handlePortfolioClick = () => {
        if (user) {
            console.log("User exists, navigating to portfolio creation."); // Debugging
            navigate("/portfolioCreation");
        } else {
            console.log("No user detected, button should be disabled."); // Debugging
        }
    };

    return (
        <div className="home-container">
            <h1 className="home-title">Track & Analyze Your Stocks</h1>
            <p className="home-subtitle">
                Stay ahead in the market with real-time stock tracking and insights.
            </p>

            <div className="card-container">
                {/* Stock Search Card */}
                <div className="card card-yellow">
                    <h2>Stock Search</h2>
                    <p>Look up stock prices and historical data.</p>
                    
                    {/* Search Bar */}
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Enter Ticker (e.g., AAPL)"
                            value={ticker}
                            onChange={(e) => setTicker(e.target.value.toUpperCase())}
                            className="search-input"
                        />
                        <button onClick={fetchStockPrice} className="search-button">
                            Search
                        </button>
                    </div>
                </div>

                {/* Portfolio Management Card */}
                <div className="card card-green">
                    <h2>Portfolio</h2>
                    <p>Create and Manage your investments.</p>
                    <button 
                        onClick={handlePortfolioClick} 
                        className={`card-button ${!user ? "disabled-button" : ""}`} 
                        disabled={!user}
                    >
                        Generate Portfolio
                    </button>
                </div>

                {/* Market Trends Card */}
                <div className="card card-blue">
                    <h2>Market Trends</h2>
                    <p>Track the latest market movements and news.</p>
                    <Link to="/trends" className="card-button">
                        Explore Trends
                    </Link>
                </div>
            </div>

            {/* Movable Pop-up for Stock Data */}
            {showPopup && stockData && (
                <div className="popup" style={{ left: `${position.x}px`, top: `${position.y}px` }}>
                    <div className="popup-content">
                        <span className="close" onClick={() => setShowPopup(false)}>&times;</span>
                        <h2>{stockData.ticker}</h2>
                        <p>Current Price: ${stockData.price}</p>
                        <p>Change: {stockData.change} ({stockData.changePercent})</p>
                    </div>
                </div>
            )}

            {loading && <p className="loading-text">Fetching stock data...</p>}
            {error && <p className="error-text">{error}</p>}
        </div>
    );
}

export default Home;
