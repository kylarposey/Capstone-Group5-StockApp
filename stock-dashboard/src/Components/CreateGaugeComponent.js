import GaugeComponent from 'react-gauge-component';

/* const ratingValue = (data) => {
   let totalRating = 0;
   let count = 0;
   
}; */ // This value should be dynamically set based on the stock data

const formatRatingLabel = ({value}) => {
   if (value <= 20) return 'Strong Sell';
   if (value <= 40) return 'Sell';
   if (value <= 60) return 'Hold';
   if (value <= 80) return 'Buy';
   return 'Strong Buy';
 };

const CreateGaugeComponent = (props) => {
   const { analysisRatings } = props;
   console.log(analysisRatings);
   /* const ratings = value;
   const totalRating = ratings.reduce((acc, rating) => acc + rating, 0);
   const averageRating = totalRating / ratings.length;
   const value = Math.round(averageRating); */

   return (
      <>
         <div className="gauge-container w-full max-w-[600px] p-4">
            <GaugeComponent
               value={50}
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