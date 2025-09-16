import type { UserOwnedCard } from '@/app/types';

interface TransactionPrompt {
  amount: number;
  merchantName: string;
  category: string;
}

// Common merchants and their typical transaction ranges
const merchantData = [
  // Food & Dining
  { name: 'Swiggy', category: 'Food Delivery', minAmount: 150, maxAmount: 800 },
  { name: 'Zomato', category: 'Food Delivery', minAmount: 200, maxAmount: 1200 },
  { name: 'McDonald\'s', category: 'Restaurant', minAmount: 300, maxAmount: 800 },
  { name: 'Starbucks', category: 'Cafe', minAmount: 200, maxAmount: 600 },
  { name: 'Domino\'s Pizza', category: 'Restaurant', minAmount: 400, maxAmount: 1500 },
  
  // Shopping
  { name: 'Amazon', category: 'E-commerce', minAmount: 500, maxAmount: 5000 },
  { name: 'Flipkart', category: 'E-commerce', minAmount: 300, maxAmount: 8000 },
  { name: 'Myntra', category: 'Fashion', minAmount: 800, maxAmount: 4000 },
  { name: 'Nykaa', category: 'Beauty', minAmount: 500, maxAmount: 2500 },
  { name: 'BigBasket', category: 'Grocery', minAmount: 800, maxAmount: 3000 },
  
  // Transportation
  { name: 'Uber', category: 'Ride Sharing', minAmount: 80, maxAmount: 500 },
  { name: 'Ola', category: 'Ride Sharing', minAmount: 70, maxAmount: 450 },
  { name: 'Indian Oil', category: 'Fuel', minAmount: 1000, maxAmount: 4000 },
  { name: 'HPCL', category: 'Fuel', minAmount: 1200, maxAmount: 3500 },
  
  // Entertainment
  { name: 'BookMyShow', category: 'Entertainment', minAmount: 200, maxAmount: 1200 },
  { name: 'Netflix', category: 'Streaming', minAmount: 199, maxAmount: 799 },
  { name: 'Spotify', category: 'Music', minAmount: 119, maxAmount: 179 },
  { name: 'PVR Cinemas', category: 'Movies', minAmount: 250, maxAmount: 800 },
  
  // Utilities & Bills
  { name: 'Airtel', category: 'Telecom', minAmount: 200, maxAmount: 1500 },
  { name: 'Jio', category: 'Telecom', minAmount: 150, maxAmount: 1200 },
  { name: 'BSES', category: 'Electricity', minAmount: 800, maxAmount: 4000 },
  { name: 'Paytm', category: 'Bill Payment', minAmount: 500, maxAmount: 2000 },
  
  // Travel
  { name: 'MakeMyTrip', category: 'Travel', minAmount: 2000, maxAmount: 15000 },
  { name: 'Cleartrip', category: 'Travel', minAmount: 1500, maxAmount: 12000 },
  { name: 'OYO', category: 'Hotels', minAmount: 1000, maxAmount: 5000 },
  { name: 'Taj Hotels', category: 'Luxury Hotels', minAmount: 5000, maxAmount: 25000 },
  
  // Retail
  { name: 'Reliance Digital', category: 'Electronics', minAmount: 2000, maxAmount: 50000 },
  { name: 'Croma', category: 'Electronics', minAmount: 1500, maxAmount: 40000 },
  { name: 'More Supermarket', category: 'Grocery', minAmount: 500, maxAmount: 2500 },
  { name: 'Spencer\'s', category: 'Retail', minAmount: 600, maxAmount: 3000 },
];

export function generateRandomTransaction(userCards: UserOwnedCard[]): TransactionPrompt | null {
  if (userCards.length === 0) return null;

  // Select a random merchant
  const merchant = merchantData[Math.floor(Math.random() * merchantData.length)];
  
  // Generate a random amount within the merchant's typical range
  const amount = Math.floor(Math.random() * (merchant.maxAmount - merchant.minAmount + 1)) + merchant.minAmount;
  
  return {
    amount,
    merchantName: merchant.name,
    category: merchant.category
  };
}

export function selectBestCardForTransaction(
  userCards: UserOwnedCard[], 
  merchantName: string, 
  amount: number
): UserOwnedCard | null {
  if (userCards.length === 0) return null;

  // Filter cards that have enough available credit
  const eligibleCards = userCards.filter(card => {
    const creditLimit = card.credit_limit || 0;
    const usedAmount = card.used_amount || 0;
    const availableCredit = creditLimit - usedAmount;
    return availableCredit >= amount;
  });

  if (eligibleCards.length === 0) {
    // If no card has enough credit, return the one with the highest available credit
    return userCards.reduce((best, current) => {
      const bestAvailable = (best.credit_limit || 0) - (best.used_amount || 0);
      const currentAvailable = (current.credit_limit || 0) - (current.used_amount || 0);
      return currentAvailable > bestAvailable ? current : best;
    });
  }

  // For now, return a random eligible card
  // In a real implementation, you might want to consider reward rates for the specific merchant
  return eligibleCards[Math.floor(Math.random() * eligibleCards.length)];
}

export function getTransactionInsight(
  card: UserOwnedCard, 
  merchantName: string, 
  amount: number
): string {
  const creditLimit = card.credit_limit || 0;
  const currentUsed = card.used_amount || 0;
  const newUsed = currentUsed + amount;
  const newUtilization = creditLimit > 0 ? (newUsed / creditLimit) * 100 : 0;

  let insight = `Transaction of ₹${amount.toLocaleString('en-IN')} at ${merchantName}. `;

  if (newUtilization > 90) {
    insight += "⚠️ This will bring your utilization above 90%, which may impact your credit score.";
  } else if (newUtilization > 70) {
    insight += "⚠️ This will bring your utilization above 70%. Consider paying down your balance soon.";
  } else if (newUtilization > 30) {
    insight += "Your utilization will be moderate. This is generally acceptable.";
  } else {
    insight += "✅ Your utilization will remain low, which is good for your credit score.";
  }

  return insight;
}