import {GaugeComponent} from 'react-gauge-component';
import { calculateBuySellValue } from '../services/calculateBuySellValue';



const formatRatingLabel = (value) => {
   if (value <= 20) return 'Strong Sell';
   if (value <= 40) return 'Sell';
   if (value <= 60) return 'Hold';
   if (value <= 80) return 'Buy';
   return 'Strong Buy';
};

// This function uses weigthed average calculation to determine the buy/sell value
// The value gets fed into the gauge component
const CreateGaugeComponent = (props) => {
   const { analysisRatings } = props;

   //get amount of analysts rating the stock from strong buy to strong sell
   const ratingValues = analysisRatings?.slice(1) || []; 
   //console.log(ratingValues);
   const buySellRating = calculateBuySellValue(ratingValues);
   console.log(buySellRating);

   return (
      <>
         <div className="gauge-container w-full max-w-[600px] p-4">
            <GaugeComponent
               value={buySellRating}
               hideValueLabel={true}           
               type="radial"
               labels={{
                  
                  tickLabels: {
                     type: "inner",
                     hideMinMax: true,
                     ticks: [
                     { value: 10 },
                     { value: 30 },
                     { value: 50 },
                     { value: 70 },
                     { value: 90 }
                     ],
                     defaultTickValueConfig: {
                     formatTextValue: formatRatingLabel,
                        style: {
                           fontSize: '12px',
                           fontWeight: 'bold',
                        }
                     }
                  },
                  valueLabel: {
                     hide: true,
                  }
               }}
               
               arc={{
                  colorArray: ['#d32f2f', '#f57c00', '#fbc02d', '#388e3c', '#2e7d32'],
                  subArcs: [
                     { limit: 20 },
                     { limit: 40 },
                     { limit: 60 },
                     { limit: 80 },
                     { limit: 100 }
                  ],
                  padding: 0.02,
                  width: 0.1
               }}
               pointer={{
                  animated: true,
                  elastic: true,
                  animationDuration: 3000
               }}
            />
            <p className="gauge-title">Buy / Sell Gauge</p>
         </div>
      </>
      
   );
}

export default CreateGaugeComponent;