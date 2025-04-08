// components/StockInfoCard.js
import React from 'react';

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
