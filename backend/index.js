require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const { doc, setDoc } = require("firebase/firestore");

const app = express();
app.use(express.json()); // Enable JSON body parsing
const corsOptions = {
    origin: ["http://localhost:3000", "https://group5-capstone-project.web.app"], // Allowed frontends
    methods: ["GET", "POST", "OPTIONS"], // Allow necessary HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow important headers
    credentials: true
};

app.use(cors(corsOptions));

// Handle Preflight Requests
app.options("*", cors(corsOptions));

const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_API_KEY;

// Root Route
app.get("/", (req, res) => {
    res.send("🚀 Backend is running! Available endpoints: /api/stock, /api/stocks, /api/etfs, /api/crypto, /api/market-cap-stocks");
});

// Fetch Stock Data
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

app.post("/api/generatePortfolio", async (req, res) => {
    const { userId, preferences } = req.body;

    if (!userId || !preferences) {
        return res.status(400).json({ error: "Invalid request. User ID and preferences are required." });
    }

    try {
        const { riskTolerance, investmentTypes, excludeIndustries, stockSize } = preferences;

        let selectedStocks = [];
        let selectedETFs = [];
        let selectedCrypto = [];

        // Fetch new stocks based on the updated preferences
        if (investmentTypes.includes("Growth stocks")) {
            selectedStocks.push(...await searchStocks("growth"));
        }
        if (investmentTypes.includes("Dividend stocks")) {
            selectedStocks.push(...await searchStocks("dividend"));
        }
        
        // Fetch ETFs dynamically
        selectedETFs.push(...await searchETFs());

        // Fetch crypto if selected
        if (investmentTypes.includes("Cryptocurrencies")) {
            selectedCrypto.push(...await fetchCrypto(["BTC", "ETH", "SOL"]));
        }

        // Apply exclusions
        selectedStocks = selectedStocks.filter(stock => 
            !excludeIndustries.includes("Oil & Gas") || !stock.symbol.includes("XOM")
        );

        // Generate the new portfolio
        const generatedPortfolio = {
            stocks: selectedStocks.slice(0, 5),
            etfs: selectedETFs.slice(0, 3),
            crypto: selectedCrypto.slice(0, 2),
            updatedAt: new Date().toISOString() // Timestamp to track updates
        };

        // **Overwrite the generatedPortfolio in Firestore**
        const userRef = doc(db, "Users", userId);
        await setDoc(userRef, { generatedPortfolio }, { merge: true }); // 🔹 This will fully replace the field

        res.json(generatedPortfolio);
    } catch (error) {
        console.error("Error generating portfolio:", error);
        res.status(500).json({ error: "Failed to generate portfolio" });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
