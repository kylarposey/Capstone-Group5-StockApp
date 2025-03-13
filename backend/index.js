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
        // Initialize portfolio with only selected categories
        const selectedPortfolio = {};

        // Map investment categories to corresponding assets
        const investmentCategories = {
            "Growth stocks": { type: "stocks", symbols: ["AAPL", "TSLA", "NVDA"] },
            "Dividend stocks": { type: "stocks", symbols: ["KO", "JNJ", "PG"] },
            "ETFs": { type: "etfs", symbols: ["VOO", "SPY", "SCHD"] },
            "Cryptocurrencies": { type: "crypto", symbols: ["BTC", "ETH", "SOL"] },
            "REITs": { type: "stocks", symbols: ["O", "VNQ", "SPG"] }
        };

        // Loop through selected investment types from the questionnaire
        for (const type of preferences.investmentTypes) {
            if (investmentCategories[type]) {
                const { type: category, symbols } = investmentCategories[type];

                if (!selectedPortfolio[category]) {
                    selectedPortfolio[category] = []; // Only create category if it's selected
                }

                for (const symbol of symbols) {
                    const stockResponse = await axios.get(
                        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
                    );

                    const stockData = stockResponse.data["Global Quote"];
                    selectedPortfolio[category].push(stockData);
                }
            }
        }

        // Save the portfolio ONLY if the user selected investments
        if (Object.keys(selectedPortfolio).length > 0) {
            const userRef = doc(db, "Users", userId);
            await setDoc(userRef, { generatedPortfolio: selectedPortfolio }, { merge: true });
        }

        res.json(selectedPortfolio);
    } catch (error) {
        console.error("Error generating portfolio:", error);
        res.status(500).json({ error: "Failed to generate portfolio" });
    }
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
