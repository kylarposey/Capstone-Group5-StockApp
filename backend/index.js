require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors({
    origin: ["http://localhost:3000", "https://group5-capstone-project.web.app/"],
    methods: ["GET"],
    allowedHeaders: ["Content-Type"],
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
