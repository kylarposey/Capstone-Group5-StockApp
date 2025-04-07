import React from 'react';
import StockInfoCard from './StockInfoCard';


const StockInfoComponent = ({ detailedStockData }) => {
   const basicInfo = [
      { label: 'Symbol', value: detailedStockData.symbol },
      { label: 'Name', value: detailedStockData.name },
      { label: 'Sector', value: detailedStockData.sector, tooltip: "The sector the company operates in"  },
      { label: 'Industry', value: detailedStockData.industry, tooltip: "The industry the company operates in"  },
      { label: 'Exchange', value: detailedStockData.exchange, tooltip: "The market where the stock is traded"  },
   ];

   const financials = [
      { label: 'PE Ratio', value: detailedStockData.PERatio, 
         tooltip: "Price-to-Earnings Ratio - is a financial shorthand for how much investors are willing to pay for each dollar a company earns - 'price tag' on company profits"  },
      { label: 'EPS', value: detailedStockData.EPS, tooltip: "Earnings Per Share"  },
      { label: 'Market Cap', value: detailedStockData.marketCap, tooltip: "Market Capitalization"  },
      { label: 'Dividend Yield', value: detailedStockData.dividendYield, tooltip: "Annual Dividend / Price"  },
   ];

   const dividends = [
      { label: 'Dividend Per Share', value: detailedStockData.dividendPerShare, tooltip: "Annual Dividend per Share"  },
      { label: 'Dividend Pay Date', value: detailedStockData.dividendPayDate, tooltip: "Date when the dividend is paid"  },
   ];

   const analysis = [
      { label: 'Analyst Target Price', value: detailedStockData.analystTargetPrice, tooltip: "Average target price set by analysts"  },
      { label: 'Analyst Rating (Strong Buy)', value: detailedStockData.analystRatingStrongBuy, tooltip: "Number of analysts rating the stock as a strong buy"  },
      { label: 'Analyst Rating (Buy)', value: detailedStockData.analystRatingBuy, tooltip: "Number of analysts rating the stock as a buy"  },
      { label: 'Analyst Rating (Hold)', value: detailedStockData.analystRatingHold, tooltip: "Number of analysts rating the stock as a hold"  },
      { label: 'Analyst Rating (Sell)', value: detailedStockData.analystRatingSell, tooltip: "Number of analysts rating the stock as a sell"  },
      { label: 'Analyst Rating (Strong Sell)', value: detailedStockData.analystRatingStrongSell, tooltip: "Number of analysts rating the stock as a strong sell"  },
   ];

   const historical = [
      { label: '52 Week High', value: detailedStockData.fiftyTwoWeekHigh, tooltip: "Highest price in the last 52 weeks"  },
      { label: '52 Week Low', value: detailedStockData.fiftyTwoWeekLow, tooltip: "Lowest price in the last 52 weeks"  },
      { label: '50 Day Moving Average', value: detailedStockData.fiftyDayMovingAvg, tooltip: "Average price over the last 50 days"  },
      { label: '200 Day Moving Average', value: detailedStockData.twoHundredDayMovingAvg, tooltip: "Average price over the last 200 days"  },
   ];

   return (
      <div className="stock-details-container">
         <StockInfoCard title="Basic Information" items={basicInfo} />
         <StockInfoCard title="Financials" items={financials} />
         <StockInfoCard title="Dividends" items={dividends} />
         <StockInfoCard title="Analysis" items={analysis} />
         <StockInfoCard title="Historical Data" items={historical} />
      </div>
   );
};

export default StockInfoComponent;