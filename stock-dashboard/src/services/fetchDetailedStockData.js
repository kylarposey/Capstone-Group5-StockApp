import axios from 'axios';

export const fetchDetailedStockData = async (symbol, apiUrl) => {
   try {
      const response = await axios.get(`${apiUrl}?symbol=${symbol}`);
      const data = response.data;

      if (!data["Symbol"]) {
         throw new Error("Invalid Ticker or API Error");
      }
      
      return {
         symbol: data["Symbol"] || "N/A",
         name: data["Name"] || "N/A",
         assetType: data["AssetType"] || "N/A",
         sector: data["Sector"] || "N/A",
         industry: data["Industry"] || "N/A",
         PERatio: data["PERatio"] || "N/A",
         EPS: data["EPS"] || "N/A",
         marketCap: data["MarketCapitalization"] || "N/A",
         dividendYield: data["DividendYield"] || "N/A",
         dividendPerShare: data["DividendPerShare"] || "N/A",
         dividendPayDate: data["DividendPayDate"] || "N/A",
         description: data["Description"] || "N/A",
         country: data["Country"] || "N/A",
         exchange: data["Exchange"] || "N/A",
         fiftyTwoWeekHigh: data["52WeekHigh"] || "N/A",
         fiftyTwoWeekLow: data["52WeekLow"] || "N/A",
         fiftyDayMovingAvg: data["50DayMovingAverage"] || "N/A",
         twoHundredDayMovingAvg: data["200DayMovingAverage"] || "N/A",
         analystTargetPrice: data["AnalystTargetPrice"] || "N/A",
         analystRatingBuy: data["AnalystRatingBuy"] || "N/A",
         analystRatingSell: data["AnalystRatingSell"] || "N/A",
         analystRatingHold: data["AnalystRatingHold"] || "N/A",
         analystRatingStrongBuy: data["AnalystRatingStrongBuy"] || "N/A",
         analystRatingStrongSell: data["AnalystRatingStrongSell"] || "N/A",
      };
   } catch (err) {
      if (err.message === 'Invalid Ticker or API Error') {
         throw err;
      } else {
         throw new Error('Error fetching stock data');
      }  }
};