require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const { initializeApp } = require("firebase/app");
const { getFirestore, doc, setDoc } = require("firebase/firestore");

// 🔹 Firebase Configuration
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
  };

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const app = express();
app.use(cors({
    origin: ["http://localhost:3000", "https://group5-capstone-project.web.app"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));

const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_API_KEY;

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
        // 🔹 Initialize an empty portfolio object
        const selectedPortfolio = {};

        // 🔹 Investment Categories Map
        const investmentCategories = {
            "Growth stocks": { type: "stocks", symbols: ["AAPL", "TSLA", "NVDA"] },
            "Dividend stocks": { type: "stocks", symbols: ["KO", "JNJ", "PG"] },
            "ETFs": { type: "etfs", symbols: ["VOO", "SPY", "SCHD"] },
            "Cryptocurrencies": { type: "crypto", symbols: ["BTC", "ETH", "SOL"] },
            "REITs": { type: "stocks", symbols: ["O", "VNQ", "SPG"] }
        };

        // 🔹 Fetch Stocks Based on User Preferences
        for (const type of preferences.investmentTypes) {
            if (investmentCategories[type]) {
                const { type: category, symbols } = investmentCategories[type];

                if (!selectedPortfolio[category]) {
                    selectedPortfolio[category] = [];
                }

                for (const symbol of symbols) {
                    try {
                        const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;
                        console.log(`Fetching: ${url}`); // Debug Log

                        const stockResponse = await axios.get(url);
                        if (!stockResponse.data || !stockResponse.data["Global Quote"]) {
                            console.warn(`No data found for ${symbol}`);
                            continue; // Skip if no data
                        }

                        selectedPortfolio[category].push(stockResponse.data["Global Quote"]);
                    } catch (fetchError) {
                        console.error(`Failed to fetch ${symbol}:`, fetchError.message);
                    }
                }
            }
        }

        // 🔹 Ensure only valid data is saved
        if (Object.keys(selectedPortfolio).length > 0) {
            const userRef = doc(db, "Users", userId);
            await setDoc(userRef, { generatedPortfolio: selectedPortfolio }, { merge: true });
            res.json(selectedPortfolio);
        } else {
            throw new Error("No valid investments generated. Check API rate limits.");
        }

    } catch (error) {
        console.error("Error generating portfolio:", error.message);
        res.status(500).json({ error: "Failed to generate portfolio", details: error.message });

        const userRef = doc(db, "Users", userId);
        await setDoc(userRef, { generatedPortfolio: { error: error.message } }, { merge: true });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
