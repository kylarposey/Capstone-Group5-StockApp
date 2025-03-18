import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import axios from "axios";
import "../assets/css/trending.css";

function Trending() {
    const [user, setUser] = useState(null);
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                fetchNews(currentUser.uid);
            }
        });

        return () => unsubscribe();
    }, []);

    const fetchNews = async (userId) => {
        setLoading(true);
        setError("");

        const API_URL = process.env.NODE_ENV === "development"
            ? "http://localhost:5000/api/trendingNews"
            : "https://capstone-group5-stockapp.onrender.com/api/trendingNews";

        try {
            const response = await axios.post(API_URL, { userId });
            setNews(response.data);
            setLoading(false);
        } catch (err) {
            setError("Error fetching news");
            console.error("❌ Error fetching news:", err);
            setLoading(false);
        }
    };

    return (
        <div className="trending-container">
            <h1 className="trending-title">Market Trends & News</h1>

            {loading && <p className="loading-text">Fetching news...</p>}
            {error && <p className="error-text">{error}</p>}

            <div className="news-list">
                {news.length > 0 ? (
                    news.map((article, index) => (
                        <div key={index} className="news-card">
                            <h3>{article.title}</h3>
                            <p>{article.summary}</p>
                            <a href={article.url} target="_blank" rel="noopener noreferrer">Read More</a>
                        </div>
                    ))
                ) : (
                    !loading && <p className="no-news">No relevant news found.</p>
                )}
            </div>
        </div>
    );
}

export default Trending;