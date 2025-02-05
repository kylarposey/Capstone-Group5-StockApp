const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;  // Access API Key

export async function getStockData(symbol) {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching stock data:", error);
    }
}
