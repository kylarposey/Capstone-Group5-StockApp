import axios from 'axios';

export const fetchStockData = async (symbol, apiUrl) => {
  try {
    const response = await axios.get(`${apiUrl}?symbol=${symbol}`);
    const data = response.data;
    
    if (!data["Global Quote"] || !data["Global Quote"]["01. symbol"]) {
      throw new Error("Invalid Ticker or API Error");
    }
    
    return {
      ticker: data["Global Quote"]["01. symbol"] || "N/A",
      price: data["Global Quote"]["05. price"] || "N/A",
      change: data["Global Quote"]["09. change"] || "N/A",
      changePercent: data["Global Quote"]["10. change percent"] || "N/A",
    };
  } catch (err) {
    if (err.message === 'Invalid Ticker or API Error') {
      throw err;
    } else {
      throw new Error('Error fetching stock data');
    }  }
};