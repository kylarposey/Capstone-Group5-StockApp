import { calculateBuySellValue } from "../services/calculateBuySellValue";

describe('calculateBuySellValue', () => {
   it('TID027 - should calculate the correct buy/sell value for valid ratings', () => {
      const ratings = [
         { value: '5' }, // Strong Buy
         { value: '3' }, // Buy
         { value: '2' }, // Hold
         { value: '1' }, // Sell
         { value: '1' }, // Strong Sell
      ];

      const result = calculateBuySellValue(ratings);
      expect(result).toBe(71); // Weighted average calculation
   });
   
   it('TID028 - should return 50 if no ratings are provided', () => {
      const ratings = [
         { value: '0' }, // Strong Buy
         { value: '0' }, // Buy
         { value: '0' }, // Hold
         { value: '0' }, // Sell
         { value: '0' }, // Strong Sell
      ];

      const result = calculateBuySellValue(ratings);
      expect(result).toBe(50); // Default to neutral
   });
   
   
   it('TID029 - should handle invalid input gracefully', () => {
      const ratings = [
         { value: 'NaN' }, // Strong Buy
         { value: 'NaN' }, // Buy
         { value: 'NaN' }, // Hold
         { value: 'NaN' }, // Sell
         { value: 'NaN' }, // Strong Sell
      ];

      const result = calculateBuySellValue(ratings);
      expect(result).toBe(50); // Default to neutral
   });

   
   it('TID030 - should handle missing ratings array', () => {
      const result = calculateBuySellValue([]);
      expect(result).toBe(50); // Default to neutral
   });

   
   it('TID031 - should handle partial ratings data', () => {
      const ratings = [
         { value: '3' }, // Strong Buy
         { value: '2' }, // Buy
      ];

      const result = calculateBuySellValue(ratings);
      expect(result).toBe(90); // Weighted average calculation for partial data
   }); 
});