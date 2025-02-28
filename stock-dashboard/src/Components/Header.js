import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../assets/css/style.css";  // Ensure styles are imported

const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_API_KEY;

function Header() {
    const [ticker, setTicker] = useState("");
    const [stockData, setStockData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPopup, setShowPopup] = useState(false); 
    const [position, setPosition] = useState({ x: 50, y: 50 }); // Track pop-up position
    const [dragging, setDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    // Fetch stock data from Alpha Vantage
    const fetchStockPrice = async () => {
      setLoading(true);
      setError("");
      setStockData(null);
      setShowPopup(false);
  
      try {
  
          const response = await fetch(
              `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${API_KEY}`
          );
  
          const data = await response.json();
  
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
  
          console.log("Stock Info Processed:", stockInfo);  // ✅ Debugging Log
  
          setStockData(stockInfo);
          setShowPopup(true);
          setLoading(false);
      } catch (err) {
          setError("Error fetching stock data");
          console.error("Fetch Error:", err);  // ✅ Debugging Log
          setLoading(false);
      }
  };

    // Handle mouse events for dragging the pop-up
    const handleMouseDown = (e) => {
        setDragging(true);
        setOffset({
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        });
    };

    const handleMouseMove = (e) => {
        if (dragging) {
            setPosition({
                x: e.clientX - offset.x,
                y: e.clientY - offset.y,
            });
        }
    };

    const handleMouseUp = () => {
        setDragging(false);
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
                <li><Link to="/newUser">Register</Link></li>
            </ul>

            {/* Movable Pop-up for Stock Data */}
            {showPopup && stockData && (
                <div
                    className="popup"
                    style={{
                        left: `${position.x}px`,
                        top: `${position.y}px`,
                        cursor: dragging ? "grabbing" : "grab",
                    }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
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
