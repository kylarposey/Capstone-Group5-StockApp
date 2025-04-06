import React from 'react';




const stockName = "Apple Inc.";
/* const stockPrice = "$150.00";
const stockChange = "+1.50%";
const stockVolume = "100M";
const stockMarketCap = "$2.5T";
const stockPE = "30.00";
const stockEPS = "5.00";
const stockDividend = "$0.80";
const stockYield = "1.20%";
const stock52WeekHigh = "$160.00";
const stock52WeekLow = "$120.00";
const stockDescription = "Apple Inc. is an American multinational technology company that designs, manufactures, and sells consumer electronics, computer software, and online services.";
 */

export function createStockDetail(stockDataItem) {
   return(
     <StockDetail 
      key={stockDataItem.ticker}
      id={stockDataItem.ticker}
     />
   )
}

function StockDetail(props) {
   return (
     <p className="stockDataPoint">{props.stockDataPoint}</p>
   );
}
