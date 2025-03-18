import React, { useState, createContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import About from "./Components/About";
import LoginPage from "./Components/LoginPage";
import NewUser from "./Components/newUser";
import Header from "./Components/Header";
import Home from "./Components/Home";
import Footer from "./Components/Footer";
import Trending from "./Components/Trending";
import PortfolioCreation from "./Components/PortfolioCreation";
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
                        <Route path="/newUser" element={<NewUser />} />
                        <Route path="/trends" element={<Trending />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/PortfolioCreation" element={<PortfolioCreation />} />
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
