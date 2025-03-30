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

    // Ref to track if notifications were already added
    const fetchedArticlesRef = useRef(new Set());

    // Function to Fetch Market News for User's Portfolio
    const fetchMarketNews =  useCallback(async () => {
        if (!user || fetchedArticlesRef.current.has(user.uid)) return; // Avoid duplicate fetching

        setLoading(true);
        setError("");

     /*    if (!user) {
            setError("User not logged in.");
            setLoading(false);
            return;
        } */

        try {
            const response = await axios.post(
                process.env.NODE_ENV === "development"
                    ? "http://localhost:5001/api/trendingNews"  //use port 5001 to avoid mac local machine conflicts
                    : "https://capstone-group5-stockapp.onrender.com/api/trendingNews",
                { userId: user.uid }
            );

            if (!response.data || !response.data.news) {
                throw new Error("Invalid response format");
            }

            const articles = response.data.news;
            setNews(articles);

            // Prevent duplicate notifications per session
            if (!fetchedArticlesRef.current.has(user.uid)) {
                addNotification("📰 News Added to Inbox!", false);
                
                articles.slice(0, 5).forEach((article) => {
                    const ticker = article.tickers?.[0] || "Market News";
                    const message = `<b>${ticker}:</b> <a href="${article.url}" target="_blank">${article.title}</a>`;
                    addNotification(message, true);
                });

                fetchedArticlesRef.current.add(user.uid); // Mark articles as fetched
            }

            /* // Show floating notification
            addNotification(" News Added to Inbox!", false); */

            // Store links in inbox with associated ticker
            articles.slice(0, 5).forEach((article) => {
                const ticker = article.tickers?.[0] || "Market News";
                const message = `<b>${ticker}:</b> <a href="${article.url}" target="_blank">${article.title}</a>`;
                addNotification(message, true);
            });

        } catch (err) {
            console.error("❌ Error fetching news:", err);
            setError("Failed to load news.");
        } finally {
            setLoading(false);
        }
    }, [user, addNotification]);

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
        else{
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
