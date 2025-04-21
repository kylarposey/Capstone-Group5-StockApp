import React, { useEffect, useState } from "react";
import {
   CircularProgressbarWithChildren,
   buildStyles
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "../assets/css/fearGreed.css";

function FearGreedIndex() {
   const [index, setIndex] = useState(null);

   useEffect(() => {
      const fetchData = async () => {
         try {
            const res = await fetch("https://api.alternative.me/fng/");
            const data = await res.json();
            setIndex(data.data[0]);
         } catch (err) {
            console.error("Failed to fetch FGI:", err);
         }
      };

      fetchData();
   }, []);

   if (!index) return null;

   const value = parseInt(index.value);
   const classification = index.value_classification;

   const color = value < 40 ? "#dc3545" : value < 60 ? "#ffc107" : "#28a745";

   return (
      <div className="fgi-widget">
         <h3 className="fgi-title">Fear and Greed Index</h3>
         <div className="fgi-circle">
            <CircularProgressbarWithChildren
               value={value}
               maxValue={100}
               styles={buildStyles({
                  pathColor: color,
                  trailColor: "#eee"
               })}
            >
               <div className="fgi-score">{value}</div>
               <div className="fgi-label">{classification}</div>
            </CircularProgressbarWithChildren>
         </div>
      </div>
   );
}

export default FearGreedIndex;
