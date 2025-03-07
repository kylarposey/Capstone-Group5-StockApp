import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";  // Use axios for API calls
import "../assets/css/style.css";  

function Header() {
    const [ticker, setTicker] = useState("");
    const [stockData, setStockData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPopup, setShowPopup] = useState(false); 
    const [position, setPosition] = useState({ x: 50, y: 50 });

    // Fetch stock data from the backend instead of Alpha Vantage directly
    const fetchStockPrice = async () => {
        setLoading(true);
        setError("");
        setStockData(null);
        setShowPopup(false);

        try {
            const response = await axios.get(`http://localhost:5000/api/stock`, {
                params: { symbol: ticker }
            });
            
            if (!response.data["Global Quote"] || !response.data["Global Quote"]["01. symbol"]) {
                setError("Invalid Ticker or API Error");
                setLoading(false);
                return;
            }

            const stockInfo = {
                ticker: response.data["Global Quote"]["01. symbol"] || "N/A",
                price: response.data["Global Quote"]["05. price"] || "N/A",
                change: response.data["Global Quote"]["09. change"] || "N/A",
                changePercent: response.data["Global Quote"]["10. change percent"] || "N/A",
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

    return (
        <nav className="header">
            <Link to="/" className="title">Stock App</Link>

            {/* Search Bar in Header */}
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Enter Ticker (e.g., AAPL)"
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value.toUpperCase())}
                    className="search-input"
                />
                <button onClick={fetchStockPrice} className="search-button">Search</button>
            </div>

            <ul className="nav-links">
                <li><Link to="/about">About</Link></li>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
            </ul>

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
        </nav>
    );
}

export default Header;
