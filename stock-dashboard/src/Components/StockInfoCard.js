import React from 'react';


// This component displays a card with a portion of the stock information
// It is used in the StockInfoComponent to display different sections of stock data
const StockInfoCard = ({ title, items }) => {
   return (
      <div className="stock-card">
         <h3>{title}</h3>
        
         {items.map(({ label, value, tooltip }) => (
            <div key={label} className="info-item">
               <strong>
                  {label}
                  {tooltip && (
                     <span className="info-tooltip">
                        ⓘ
                        <span className="tooltip-text">{tooltip}</span>
                     </span>
                  )}
                  :
               </strong>
               {" "}{value || "N/A"}
            </div>
         ))}
      </div>
   );
};

export default StockInfoCard;
