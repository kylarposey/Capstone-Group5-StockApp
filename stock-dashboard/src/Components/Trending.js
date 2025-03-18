import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import axios from "axios";
import "../assets/css/trending.css";

function Trending() {
    const [news, setNews] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                fetchTrendingNews(currentUser.uid);
            } else {
                setUser(null);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const fetchTrendingNews = async (userId) => {
        if (!userId) return;
        setLoading(true);
        setError("");

        try {
            const API_URL = process.env.NODE_ENV === "development"
                ? `http://localhost:5000/api/trending?userId=${userId}`
                : `https://capstone-group5-stockapp.onrender.com/api/trending?userId=${userId}`;

            const response = await axios.get(API_URL);
            setNews(response.data.news);
        } catch (err) {
            console.error("Error fetching news:", err);
            setError("Failed to fetch market news.");
        }
        setLoading(false);
    };

    return (
        <div className="trending-container">
            <h1 className="trending-title">Market Trends & News</h1>

            {loading && <p className="loading-text">Loading news...</p>}
            {error && <p className="error-text">{error}</p>}

            <div className="news-cards-container">
                {news.length > 0 ? (
                    news.map((article, index) => (
                        <div key={index} className="news-card">
                            <h2>{article.title}</h2>
                            <p>{article.summary}</p>
                            <a href={article.url} target="_blank" rel="noopener noreferrer">
                                Read More
                            </a>
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
