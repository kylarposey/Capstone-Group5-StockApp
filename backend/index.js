require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors({
    origin: ["http://localhost:3000", "https://group5-capstone-project.web.app"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));



const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_API_KEY;;

app.get("/", (req, res) => {
    res.send("🚀 Backend is running! API available at /api/stock?symbol=AAPL");
});

app.get("/api/stock", async (req, res) => {
    const { symbol } = req.query;
    if (!symbol) {
        return res.status(400).json({ error: "Stock symbol is required" });
    }

    try {
        const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching stock data:", error);
        res.status(500).json({ error: "Failed to fetch stock data" });
    }
});

app.use(express.json()); // Enable JSON parsing

app.post("/api/generatePortfolio", async (req, res) => {
    const { userId, preferences } = req.body;

    if (!userId || !preferences) {
        return res.status(400).json({ error: "Invalid request. User ID and preferences are required." });
    }

    try {
        // Use Alpha Vantage to fetch stock data based on preferences
        const selectedStocks = [];
        const stockCategories = {
            "Growth stocks": ["AAPL", "TSLA", "NVDA"],
            "Dividend stocks": ["KO", "JNJ", "PG"],
            "ETFs": ["VOO", "SPY", "SCHD"],
            "Cryptocurrencies": ["BTC", "ETH", "SOL"],
            "REITs": ["O", "VNQ", "SPG"]
        };

        // Filter Stocks based on Preferences
        for (const type of preferences.investmentTypes) {
            if (stockCategories[type]) {
                for (const symbol of stockCategories[type]) {
                    const stockResponse = await axios.get(
                        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
                    );
                    selectedStocks.push(stockResponse.data["Global Quote"]);
                }
            }
        }

        const generatedPortfolio = {
            stocks: selectedStocks,
            bonds: [], // You can extend this by pulling bond data
            crypto: [], // Pull crypto data dynamically
            etfs: [], // Add selected ETFs
        };

        res.json(generatedPortfolio);
    } catch (error) {
        console.error("Error generating portfolio:", error);
        res.status(500).json({ error: "Failed to generate portfolio" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
