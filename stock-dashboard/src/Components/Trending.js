import React, { useState, useEffect, useContext, useCallback, useRef } from "react";
import axios from "axios";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { NotificationContext } from "../App";
import "../assets/css/trending.css";

function Trending() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [user, setUser] = useState(null);
    const { addNotification } = useContext(NotificationContext);

    const fetchedArticlesRef = useRef(new Set());

    const fetchMarketNews = useCallback(async () => {
        if (!user || fetchedArticlesRef.current.has(user.uid)) return;

        setLoading(true);
        setError("");

        try {
            const response = await axios.post(
                process.env.NODE_ENV === "development"
                    ? "http://localhost:5001/api/trendingNews"
                    : "https://capstone-group5-stockapp.onrender.com/api/trendingNews",
                { userId: user.uid }
            );

            if (!response.data || !response.data.news) {
                throw new Error("Invalid response format");
            }

            const articles = response.data.news;
            setNews(articles);

            if (!fetchedArticlesRef.current.has(user.uid)) {
                addNotification("📰 News Added to Inbox!", false);

                articles.slice(0, 5).forEach((article) => {
                    const ticker = article.tickers?.[0] || "Market News";
                    const message = `<b>${ticker}:</b> <a href="${article.url}" target="_blank">${article.title}</a>`;
                    const id = `${ticker}-${article.url}`; 
                
                    addNotification({ id, message, storeInInbox: true });
                });

                fetchedArticlesRef.current.add(user.uid);
            }
        } catch (err) {
            console.error("❌ Error fetching news:", err);
            setError("Failed to load news.");
        } finally {
            setLoading(false);
        }
    }, [user, addNotification]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (user) {
            fetchMarketNews();
        } else {
            setLoading(false);
            setError("Please login to see relevant market news.");
        }
    }, [user, fetchMarketNews]);

    return (
        <div className="trending-container">
            <h1 className="trending-title">Market Trends & News</h1>

            {loading && <p className="loading-text">Fetching market news...</p>}
            {error && <p className="error-text">{error}</p>}

            <div className="news-cards">
                {news.map((article, index) => (
                    <div key={index} className="news-card">
                        <h3>{article.title}</h3>

                        {article.overall_sentiment_label && (
                            <span
                                className={`sentiment-badge ${article.overall_sentiment_label.toLowerCase().replace(/ /g, "-")}`}
                                title={`Sentiment Score: ${article.overall_sentiment_score}`}
                            >
                                {article.overall_sentiment_label}
                            </span>
                        )}

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
