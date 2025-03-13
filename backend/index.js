const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json()); // Allow JSON body parsing

// 🔹 Fix CORS
const corsOptions = {
    origin: ["http://localhost:3000", "https://group5-capstone-project.web.app"], // Allowed frontends
    methods: ["GET", "POST", "OPTIONS"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Important headers
    credentials: true
};

app.use(cors(corsOptions));

// ✅ Handle Preflight Requests (Fix OPTIONS issue)
app.options("*", cors(corsOptions));

const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_API_KEY;

// 🔹 Generate Portfolio Algorithm
app.post("/api/generatePortfolio", async (req, res) => {
    const { userId, preferences } = req.body;
    if (!userId || !preferences) {
        return res.status(400).json({ error: "User ID and preferences are required." });
    }

    try {
        // 🔹 Fetch stocks based on user preferences
        const selectedStocks = await fetchAssetData(["AAPL", "MSFT", "GOOGL"]);
        const selectedETFs = await fetchAssetData(["VOO", "SPY"]);
        const selectedCrypto = await fetchAssetData(["BTC", "ETH"]);

        const generatedPortfolio = {
            stocks: selectedStocks,
            etfs: selectedETFs,
            crypto: selectedCrypto
        };

        res.json(generatedPortfolio);
    } catch (error) {
        console.error("Error generating portfolio:", error);
        res.status(500).json({ error: "Failed to generate portfolio" });
    }
});

// 🔹 Utility Function to Fetch Stock Data
async function fetchAssetData(symbols) {
    const results = [];
    for (const symbol of symbols) {
        try {
            const response = await axios.get(
                `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
            );
            if (response.data["Global Quote"]) {
                results.push({
                    symbol: symbol,
                    price: response.data["Global Quote"]["05. price"],
                });
            }
        } catch (err) {
            console.error(`Failed to fetch ${symbol}`, err);
        }
    }
    return results;
}

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
