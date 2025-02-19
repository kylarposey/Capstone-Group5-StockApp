import React from "react";
import { Link } from "react-router-dom";
import "../assets/css/style.css"; // Ensure your styles are imported

function Home() {
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
                    <Link to="/search" className="card-button">
                        Get Started
                    </Link>
                </div>

                {/* Portfolio Management Card */}
                <div className="card card-green">
                    <h2>Portfolio</h2>
                    <p>Manage and analyze your investments.</p>
                    <Link to="/portfolio" className="card-button">
                        View Portfolio
                    </Link>
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
        </div>
    );
}

export default Home;
