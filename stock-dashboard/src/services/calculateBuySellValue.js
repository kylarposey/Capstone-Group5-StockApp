

export const calculateBuySellValue = (ratings) => {
  
   //get the count of analysts that rated each category
   const strongBuy = parseInt(ratings[0]?.value || 0);
   const buy = parseInt(ratings[1]?.value || 0);
   const hold = parseInt(ratings[2]?.value || 0);
   const sell = parseInt(ratings[3]?.value || 0);
   const strongSell = parseInt(ratings[4]?.value || 0);
   

   const totalAnalystCount = strongBuy + buy + hold + sell + strongSell;
   if (totalAnalystCount === 0) {
      return 50; // Default to neutral no analysts rated the stock for the company are available
   }
   const weightedSum = (strongBuy * 100) + (buy * 75) + (hold * 50) + (sell * 25) + (strongSell * 0);

   const rating = Math.round(weightedSum / totalAnalystCount);
   
   if (isNaN(rating)) {
      return 50; // Default to neutral if no ratings are available
   }

   return rating;
}