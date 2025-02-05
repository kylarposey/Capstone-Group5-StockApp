import { useState } from "react";
import { getStockData } from "../api";  // Import API function

function StockData() {
    const [stock, setStock] = useState(null);
    const [symbol, setSymbol] = useState("");

    const fetchStock = async () => {
        if (!symbol) return;
        const data = await getStockData(symbol);
        setStock(data);
    };

    return (
        <div>
            <h2>Stock Dashboard</h2>
            <input 
                type="text" 
                placeholder="Enter stock symbol" 
                value={symbol} 
                onChange={(e) => setSymbol(e.target.value.toUpperCase())} 
            />
            <button onClick={fetchStock}>Fetch Stock</button>
            {stock && <pre>{JSON.stringify(stock, null, 2)}</pre>}
        </div>
    );
}

export default StockData;
