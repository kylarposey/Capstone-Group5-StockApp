import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import StockSearchCard from "./StockSearchCard";
import FearGreed from "./FearGreed";
import "../assets/css/style.css";

function Home() {
   const [user, setUser] = useState(null);
   const navigate = useNavigate();

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

   return (
      <div className="home-container">
         <h1 className="home-title">Track & Analyze Your Stocks</h1>
         <p className="home-subtitle">
            Stay ahead in the market with real-time stock tracking and insights.
         </p>

         <div className="card-container">
            {/* Stock Search Card */}
            <StockSearchCard />

            {/* Portfolio Management Card */}
            <div className="card card-green">
               <h2>Portfolio</h2>
               <p>Create a recommended portfolio.</p>
               {user ? (
                  <button
                     id="portfolioFeature-button"
                     onClick={handlePortfolioClick}
                     className={`card-button ${!user ? "disabled-button" : ""}`}
                     disabled={!user}
                  >
                     Generate Portfolio
                  </button>
               ) : (
                  <p>(Please Login)</p>
               )}
            </div>

            {/* Market Trends Card */}
            <div className="card card-blue">
               <h2>Market Trends</h2>
               <p>See portfolio relevant news.</p>
               {user ? (
                  <Link to="/trends" className="card-button" id="trends-link">
                     Explore Trends
                  </Link>
               ) : (
                  <p>(Please Login)</p>
               )}
            </div>
         </div>

         {/* ⬇ Fear & Greed Widget Centered Below Cards */}
         <div className="fgi-container">
            <FearGreed />
         </div>
      </div>
   );
}

export default Home;
