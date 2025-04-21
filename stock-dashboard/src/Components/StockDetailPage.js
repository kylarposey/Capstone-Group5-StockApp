import React from 'react';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { useDetailedStockData } from '../services/useDetailedStockData';
import  StockInfoComponent  from './StockInfoComponent';


// This component contains the page for displaying detailed stock company information
// It includes a search bar for entering the stock ticker symbol
// and a button to fetch the company data

function StockDetailPage() {

   const {
         loading,
         error,
         ticker,
         setTicker,
         detailedStockData,
         fetchData,
      } = useDetailedStockData();
   
   const navigate = useNavigate();
   const [user, setUser] = useState(null);


   useEffect(() => {
      onAuthStateChanged(auth, (currentUser) => {
         if (currentUser) {
            setUser(currentUser);
         } else {
            navigate("/login");
         }
      });
   }, [navigate]);

   const handleSearch = async () => {
      await fetchData();
   };

   return (
      <>
         <div className="search-page-container">
            <h2 className="search-page-title">Stock Details</h2>
            <div className='card-container'>
               <div className="card card-yellow">
                  <p>Get more detailed stock info</p>
                  {/* Search Bar */}
                  <div className="search-container">
                     <input
                        id="ticker-search-input"
                        type="text"
                        placeholder="Enter Ticker (e.g., AAPL)"
                        value={ticker}
                        onChange={(e) => setTicker(e.target.value.toUpperCase())}
                        onKeyDown={(e) => {
                           if (e.key === "Enter") {
                              handleSearch(); // Trigger the search when Enter is pressed
                           }
                        }}
                        className="search-input"
                        autoComplete='off'
                     />
                     <button id="ticker-search-button" onClick={handleSearch} className="search-button">
                        Search
                     </button>
                  </div>
                  {loading && <p className="loading-text">Fetching stock data...</p>}
                  {error && <p className="error-text">{error}</p>}
                     
               </div>
            </div>
         </div>
         <div>
            {detailedStockData && (
               <StockInfoComponent
                  ticker={ticker}
                  detailedStockData={detailedStockData}
               />
            )}
         </div>
      </>
   );
}

export default StockDetailPage;
