import { useState } from 'react';
import { fetchStockData } from './fetchStockData';

export const useStockData = () => {
   const [ticker, setTicker] = useState("");
   const [stockData, setStockData] = useState(null);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");
   const [showPopup, setShowPopup] = useState(false);

   const fetchStockPrice = async () => {
      setLoading(true);
      setError("");
      setStockData(null);

      //The URL depends on when the app is run locally with npm start(development) and uses port 5001
      //Or from the production version hosted on firebase which uses the actual url of the backend hosted on render.com
      //Both will call the Alpha Advantage stock endpoint
      const API_URL = process.env.NODE_ENV === "development"
         ? "http://localhost:5001/api/stock"
         : "https://capstone-group5-stockapp.onrender.com/api/stock";

      try {
         const stockInfo = await fetchStockData(ticker, API_URL);
         setStockData(stockInfo);
         setShowPopup(true);
      } catch (err) {
         setError(err.message);
      } finally {
         setLoading(false);
      }
   };

   return {
      ticker,
      setTicker,
      stockData,
      loading,
      error,
      showPopup,
      setShowPopup,
      fetchStockPrice
   };
};