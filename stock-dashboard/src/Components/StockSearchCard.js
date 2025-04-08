import React, { useState, useEffect, useCallback } from 'react';
import { useStockData } from "../services/useStockData";
import StockPopup from "./StockPopUp";

function StockSearchCard() {

   const {
      loading,
      error,
      ticker,
      setTicker,
      stockData,
      fetchStockPrice,
   } = useStockData();

   const [showPopup, setShowPopup] = useState(false);
   const [position, setPosition] = useState({ x: 200, y: 200 });
   const [dragging, setDragging] = useState(false);
   const [offset, setOffset] = useState({ x: 0, y: 0 });

   const handleMouseDown = (e) => {
      setDragging(true);
      setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
      });
   };

   const handleMouseMove = useCallback(
      (e) => {
      if (dragging) {
         setPosition({
            x: e.clientX - offset.x,
            y: e.clientY - offset.y,
         });
      }
      },
      [dragging, offset]
   );

   const handleMouseUp = () => {
      setDragging(false);
   };

   useEffect(() => {
      if (dragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      }
      return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      };
   }, [dragging, handleMouseMove]);

   const handleSearch = async () => {
      setPosition({ x: 150, y: 200 }); 
      await fetchStockPrice();
      setShowPopup(true); // Show the popup after fetching stock data
   };


   return (
      <>
         <div className="card card-yellow">
            <h2>Stock Search</h2>
            <p>Look up stock details</p>
            
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
               />
               <button id="ticker-search-button" onClick={handleSearch} className="search-button">
                  Search
               </button>
               
            </div>
            {loading && <p className="loading-text">Fetching stock data...</p>}
            {error && <p className="error-text">{error}</p>}
            
         </div>

         {/* Stock Popup */}
         {/* Only show if showPopup is true and stockData is available */}
         {showPopup && stockData && (
            <StockPopup
               stockData={stockData}
               position={position}
               handleMouseDown={handleMouseDown}
               setShowPopup={setShowPopup}
            />
         )}
      </>
   );
}

export default StockSearchCard;