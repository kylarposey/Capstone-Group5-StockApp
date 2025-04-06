import React from "react";

function StockPopup({ stockData, position, handleMouseDown, setShowPopup }) {
   console.log("Popup position prop:", position); // Debugging position
 
      
   return (
      <div
         id="stock-popup"
         className="popup draggable"
      
         style={{ left: `${position.x}px`, top: `${position.y}px`}}

         onMouseDown={handleMouseDown}
      >
         <div className="popup-header">
         <span className="popup-title">{stockData.ticker}</span>
         <span className="close" onClick={() => setShowPopup(false)}>
            &times;
         </span>
         </div>
         <div className="popup-content">
         <p>Current Price: ${stockData.price}</p>
         <p>Change: {stockData.change} ({stockData.changePercent})</p>
         </div>
      </div>
   );
}

export default StockPopup;