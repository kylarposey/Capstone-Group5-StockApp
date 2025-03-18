import React, { useState, useEffect } from "react";
import axios from "axios";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import "../assets/css/style.css";

function Trending() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [user, setUser] = useState(null);

    // 🔹 Function to Fetch Market News for User's Portfolio
    const fetchMarketNews = async () => {
        setLoading(true);
        setError("");

        if (!user) {
            setError("User not logged in.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                process.env.NODE_ENV === "development"
                    ? "http://localhost:5000/api/trendingNews"
                    : "https://capstone-group5-stockapp.onrender.com/api/trendingNews",
                { userId: user.uid }
            );

            setNews(response.data.news || []);
        } catch (err) {
            console.error("❌ Error fetching news:", err);
            setError("Failed to load news.");
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Ensure `fetchMarketNews` runs when user logs in
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            }
        });

        return () => unsubscribe();
    }, []);

    // 🔹 Call `fetchMarketNews` when `user` is available
    useEffect(() => {
        if (user) {
            fetchMarketNews();
        }
    }, [user]);

    return (
        <div className="trending-container">
            <h1 className="trending-title">Market Trends & News</h1>

            {loading && <p className="loading-text">Fetching market news...</p>}
            {error && <p className="error-text">{error}</p>}

            <div className="news-cards">
                {news.map((article, index) => (
                    <div key={index} className="news-card">
                        <h3>{article.title}</h3>
                        <p>{article.summary}</p>
                        <a href={article.url} target="_blank" rel="noopener noreferrer">
                            Read More
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Trending;
