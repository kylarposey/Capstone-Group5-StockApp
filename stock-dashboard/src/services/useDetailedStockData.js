import { useState } from 'react';
import { fetchDetailedStockData} from './fetchDetailedStockData';

export const useDetailedStockData = () => {
   const [ticker, setTicker] = useState("");
   const [detailedStockData, setDetailedStockData] = useState(null);
   const [error, setError] = useState("");
   const [loading, setLoading] = useState(false);

   const fetchData = async () => {
      setLoading(true);
      setError("");
      
      //The URL depends on when the app is run locally with npm start(development) and uses port 5001
      //Or from the production version hosted on firebase which uses the actual url of the backend hosted on render.com
      //Both will call the Alpha Advantage stock endpoint
      const API_URL = process.env.NODE_ENV === "development"
         ? "http://localhost:5001/api/stockDetails"
         : "https://capstone-group5-stockapp.onrender.com/api/stockDetails";

      try {
         const apiDetailedData = await fetchDetailedStockData(ticker, API_URL);
         setDetailedStockData(apiDetailedData);
      } catch (err) {
         setError(err.message);
      } finally {
         setLoading(false);
      }
   };

   return {
      ticker,
      setTicker,
      detailedStockData,
      error,
      fetchData
   };
};