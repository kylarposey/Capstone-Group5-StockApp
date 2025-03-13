require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const { initializeApp } = require("firebase/app");
const { getFirestore, doc, setDoc } = require("firebase/firestore");

// ✅ Use the same Firebase config as in frontend
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp); // ✅ Get Firestore instance

const app = express();
app.use(express.json()); // Enable JSON body parsing

// ✅ CORS Configuration
const corsOptions = {
  origin: ["http://localhost:3000", "https://group5-capstone-project.web.app"], 
  methods: ["GET", "POST", "OPTIONS"], 
  allowedHeaders: ["Content-Type", "Authorization"], 
  credentials: true
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Handle preflight requests

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

        // 🔹 Step 1: Fetch Growth & Dividend Stocks
        if (investmentTypes.includes("Growth stocks")) {
            selectedStocks.push(...await searchStocks("growth"));
        }
        if (investmentTypes.includes("Dividend stocks")) {
            selectedStocks.push(...await searchStocks("dividend"));
        }

        // 🔹 Step 2: Fetch ETFs (S&P 500, Bonds, etc.)
        selectedETFs.push(...await searchETFs());

        // 🔹 Step 3: Fetch Crypto if selected
        if (investmentTypes.includes("Cryptocurrencies")) {
            selectedCrypto.push(...await fetchCrypto(["BTC", "ETH", "SOL"])); // Expandable list
        }

        // 🔹 Step 4: Adjust Portfolio Based on Risk Tolerance
        if (riskTolerance === "Conservative") {
            selectedETFs.push(...await searchETFs("bonds"));
        }

        // 🔹 Step 5: Filter Out Excluded Industries (Oil, Tobacco, etc.)
        selectedStocks = selectedStocks.filter(stock => 
            !excludeIndustries.includes("Oil & Gas") || !stock.symbol.includes("XOM")
        );

        // 🔹 Step 6: Return the Generated Portfolio
        const generatedPortfolio = {
            stocks: selectedStocks.slice(0, 5), // Limit to top 5 stocks
            etfs: selectedETFs.slice(0, 3), // Limit to top 3 ETFs
            crypto: selectedCrypto.slice(0, 2) // Limit to top 2 cryptos
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

async function searchStocks(keyword) {
    try {
        const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${keyword}&apikey=${API_KEY}`;
        const response = await axios.get(url);
        return response.data.bestMatches.map(stock => ({
            symbol: stock["1. symbol"],
            name: stock["2. name"]
        })).slice(0, 5); // Get top 5 results
    } catch (error) {
        console.error(`Error searching stocks for ${keyword}:`, error);
        return [];
    }
}

// 🔹 Fetch ETFs (Index Funds & Bonds)
async function searchETFs(keyword = "ETF") {
    try {
        const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${keyword}&apikey=${API_KEY}`;
        const response = await axios.get(url);
        return response.data.bestMatches.map(etf => ({
            symbol: etf["1. symbol"],
            name: etf["2. name"]
        })).slice(0, 3); // Get top 3 ETFs
    } catch (error) {
        console.error(`Error searching ETFs:`, error);
        return [];
    }
}

// 🔹 Fetch Cryptocurrency Prices
async function fetchCrypto(symbols) {
    const cryptoResults = [];
    for (const symbol of symbols) {
        try {
            const url = `https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=${symbol}&market=USD&apikey=${API_KEY}`;
            const response = await axios.get(url);
            const data = response.data["Time Series (Digital Currency Daily)"];
            const latestDate = Object.keys(data)[0];

            cryptoResults.push({
                symbol,
                price: data[latestDate]["4a. close (USD)"]
            });
        } catch (error) {
            console.error(`Error fetching crypto data for ${symbol}:`, error);
        }
    }
    return cryptoResults;
}

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
