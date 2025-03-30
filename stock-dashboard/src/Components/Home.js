import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useStockData } from "../services/useStockData";
import "../assets/css/style.css";

function Home() {
    //custom useState hooks from useStockData.js
    const {
        ticker,
        setTicker,
        stockData,
        loading,
        error,
        showPopup,
        setShowPopup,
        fetchStockPrice
    } = useStockData();
   
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const [position, setPosition] = useState({ x: 200, y: 150 });
    const [dragging, setDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
 
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    const handlePortfolioClick = () => {
        if (user) {
            navigate("/portfolioCreation");
        }
    };

    const handleMouseDown = (e) => {
        setDragging(true);
        setOffset({
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        });
    };

    const handleMouseMove = useCallback((e) => {
        if (dragging) {
            setPosition({
                x: e.clientX - offset.x,
                y: e.clientY - offset.y,
            });
        }
    }, [dragging, offset]);  

    const handleMouseUp = () => {
        setDragging(false);
    };

    useEffect(() => {
        if (dragging) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        } else {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        }
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [dragging, handleMouseMove]);

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
                            id="ticker-search-input"
                            type="text"
                            placeholder="Enter Ticker (e.g., AAPL)"
                            value={ticker}
                            onChange={(e) => setTicker(e.target.value.toUpperCase())}
                            className="search-input"
                        />
                        <button id="ticker-search-button" onClick={fetchStockPrice} className="search-button">
                            Search
                        </button>
                    </div>
                </div>

                {/* Portfolio Management Card */}
                <div className="card card-green">
                    <h2>Portfolio</h2>
                    <p>Create and Manage your investments.</p>
                    <button
                        id="portfolioFeature-button" 
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
                    <Link to="/trends" className="card-button" id ="trends-link">
                        Explore Trends
                    </Link>
                </div>
            </div>

            {/* ✨ Movable Pop-up for Stock Data ✨ */}
            {showPopup && stockData && (
                <div
                    id="stock-popup"
                    className="popup draggable"
                    style={{ left: `${position.x}px`, top: `${position.y}px` }}
                    onMouseDown={handleMouseDown}
                >
                    <div className="popup-header">
                        <span className="popup-title">{stockData.ticker}</span>
                        <span className="close" onClick={() => setShowPopup(false)}>&times;</span>
                    </div>
                    <div className="popup-content">
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
