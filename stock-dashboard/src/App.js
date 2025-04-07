import React, { useState, createContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import About from "./Components/About";
import AuthPage from "./Components/AuthPage";
import Header from "./Components/Header";
import Home from "./Components/Home";
import Footer from "./Components/Footer";
import Trending from "./Components/Trending";
import PortfolioCreation from "./Components/PortfolioCreation";
import StockDetailPage from "./Components/StockDetailPage";
import "./assets/css/style.css";
import "bootstrap/dist/css/bootstrap.min.css";

// Context to store notifications globally
export const NotificationContext = createContext();

function App() {
    const [notifications, setNotifications] = useState([]);

    const addNotification = (message, storeInInbox = false) => {
        const newNotification = { id: Date.now(), message, storeInInbox };

        setNotifications((prev) => [...prev, newNotification]);

        // ✅ Only remove floating notifications after 7 seconds
        if (!storeInInbox) {
            setTimeout(() => {
                setNotifications((prev) =>
                    prev.filter((n) => n.id !== newNotification.id || n.storeInInbox)
                );
            }, 7000);
        }
    };


    const removeNotification = (id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    return (
        <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
            <BrowserRouter>
                <Header />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/loginRegister" element={<AuthPage />} />
                        <Route path="/trends" element={<Trending />} />
                        <Route path="/PortfolioCreation" element={<PortfolioCreation />} />
                        <Route path="/stockDetails" element={<StockDetailPage />} />
                        <Route path="*" element={<div>404 Not Found</div>} />
                    </Routes>
                </main>
                <Footer />
            </BrowserRouter>

            {/* Floating Notifications */}
            <div className="notification-container">
                {notifications.filter((n) => !n.storeInInbox).map((note) => (
                    <div key={note.id} className="notification">
                        {note.message}
                    </div>
                ))}
            </div>
        </NotificationContext.Provider>
    );
}

export default App;
