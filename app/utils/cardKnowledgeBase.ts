// Import types
interface UserOwnedCard {
  id: string;
  user_id: string;
  card_id: string;
  credit_limit: number | null;
  used_amount: number | null;
  card_name: string | null;
  issuer: string | null;
  card_type?: string | null;
  benefits: unknown | null;
  fees: unknown | null;
}

// Comprehensive card knowledge base with detailed reward structures and partnerships
export interface DetailedCardInfo {
  card_name: string;
  issuer: string;
  network: string;
  card_type: string[];
  reward_rates: {
    [category: string]: {
      rate: number;
      type: string;
      notes: string;
      merchants?: string[];
    };
  };
  partnerships: {
    [partner: string]: {
      reward_rate: number;
      benefits: string[];
      merchants: string[];
    };
  };
  suitability: string;
  last_updated: string;
}

export const cardKnowledgeBase: DetailedCardInfo[] = [
  {
    card_name: "Tata Neu Infinity HDFC Bank",
    issuer: "HDFC",
    network: "Visa/RuPay",
    card_type: ["Co-branded", "Rewards"],
    reward_rates: {
      "tata_neu_app": {
        rate: 10,
        type: "NeuCoins (%)",
        notes: "5% as a base rate + 5% for NeuPass members. Includes bill payments on Tata Neu.",
        merchants: ["Tata Neu App"]
      },
      "partner_tata_brands": {
        rate: 5,
        type: "NeuCoins (%)",
        notes: "On Croma, BigBasket, Tata CLiQ, Taj Hotels, etc.",
        merchants: ["BigBasket", "Croma", "Tata CLiQ", "Taj Hotels", "1mg", "Vistara", "Tata AIG", "Tata Motors"]
      },
      "groceries": {
        rate: 5,
        type: "NeuCoins (%)",
        notes: "Specifically high rewards on grocery purchases through BigBasket and other Tata partner stores",
        merchants: ["BigBasket", "Tata CLiQ Grocery"]
      },
      "other_spends": {
        rate: 1.5,
        type: "NeuCoins (%)",
        notes: "Applies to all other domestic and international spends."
      }
    },
    partnerships: {
      "BigBasket": {
        reward_rate: 5,
        benefits: [
          "5% NeuCoins on all BigBasket purchases",
          "Special offers and discounts",
          "Priority delivery slots",
          "Exclusive product access"
        ],
        merchants: ["BigBasket", "BB Daily", "BB Instant"]
      },
      "Tata_Ecosystem": {
        reward_rate: 5,
        benefits: [
          "5% NeuCoins across all Tata brands",
          "Unified loyalty program",
          "Cross-brand redemptions"
        ],
        merchants: ["BigBasket", "Croma", "Tata CLiQ", "Taj Hotels", "1mg", "Vistara"]
      }
    },
    suitability: "Extremely valuable for users deeply integrated into the Tata ecosystem, especially for grocery shopping on BigBasket and other Tata brands.",
    last_updated: "2024-12-01"
  },
  {
    card_name: "Amazon Pay ICICI Bank",
    issuer: "ICICI",
    network: "Visa",
    card_type: ["Co-branded", "Cashback"],
    reward_rates: {
      "amazon": {
        rate: 5,
        type: "Cashback (%)",
        notes: "5% unlimited cashback on Amazon.in for Prime members, 3% for non-Prime",
        merchants: ["Amazon.in"]
      },
      "bill_payments": {
        rate: 2,
        type: "Cashback (%)",
        notes: "2% cashback on bill payments through Amazon Pay",
        merchants: ["Amazon Pay"]
      },
      "other_spends": {
        rate: 1,
        type: "Cashback (%)",
        notes: "1% cashback on all other spends"
      }
    },
    partnerships: {
      "Amazon": {
        reward_rate: 5,
        benefits: [
          "5% unlimited cashback for Prime members",
          "3% cashback for non-Prime members",
          "No minimum spend requirement",
          "Instant cashback credit"
        ],
        merchants: ["Amazon.in", "Amazon Pay"]
      }
    },
    suitability: "Perfect for heavy Amazon shoppers, especially Prime members. Best-in-class rewards for Amazon purchases.",
    last_updated: "2024-12-01"
  },
  {
    card_name: "Swiggy HDFC Bank",
    issuer: "HDFC",
    network: "Visa",
    card_type: ["Co-branded", "Cashback"],
    reward_rates: {
      "swiggy": {
        rate: 10,
        type: "Cashback (%)",
        notes: "10% cashback on Swiggy orders",
        merchants: ["Swiggy"]
      },
      "dining": {
        rate: 5,
        type: "Cashback (%)",
        notes: "5% cashback on dining and restaurants",
        merchants: ["Restaurants", "Cafes", "Food Courts"]
      },
      "other_spends": {
        rate: 1,
        type: "Cashback (%)",
        notes: "1% cashback on all other spends"
      }
    },
    partnerships: {
      "Swiggy": {
        reward_rate: 10,
        benefits: [
          "10% cashback on Swiggy food orders",
          "Free Swiggy One membership",
          "Priority customer support",
          "Exclusive offers and discounts"
        ],
        merchants: ["Swiggy", "Swiggy Instamart"]
      }
    },
    suitability: "Ideal for frequent food delivery users and dining enthusiasts. Excellent rewards for Swiggy orders.",
    last_updated: "2024-12-01"
  },
  {
    card_name: "SBI Cashback Card",
    issuer: "SBI",
    network: "Mastercard",
    card_type: ["Cashback"],
    reward_rates: {
      "online_spends": {
        rate: 5,
        type: "Cashback (%)",
        notes: "No merchant restrictions. Capped at ₹5,000 cashback per monthly statement cycle.",
        merchants: ["All Online Merchants"]
      },
      "offline_spends": {
        rate: 1,
        type: "Cashback (%)",
        notes: "Includes utility bill payments."
      }
    },
    partnerships: {
      "Online_Shopping": {
        reward_rate: 5,
        benefits: [
          "5% cashback on all online spends",
          "No merchant restrictions",
          "Monthly cap of ₹5,000 cashback"
        ],
        merchants: ["All Online Merchants", "E-commerce", "Online Services"]
      }
    },
    suitability: "Excellent for users with high online spending across various merchants due to its high, uncategorized cashback rate.",
    last_updated: "2024-12-01"
  },
  {
    card_name: "HDFC Millennia",
    issuer: "HDFC",
    network: "Visa/Mastercard",
    card_type: ["Cashback", "Rewards"],
    reward_rates: {
      "partner_merchants": {
        rate: 5,
        type: "Cashback (%)",
        notes: "On Amazon, Flipkart, Myntra, Swiggy, Zomato, Uber etc. Capped at 1000 CashPoints per month.",
        merchants: ["Amazon", "Flipkart", "Myntra", "Swiggy", "Zomato", "Uber"]
      },
      "all_other_spends": {
        rate: 1,
        type: "Cashback (%)",
        notes: "Applies to all other spends, including EMIs and wallet loads."
      }
    },
    partnerships: {
      "Major_Platforms": {
        reward_rate: 5,
        benefits: [
          "5% cashback on major online platforms",
          "Quarterly milestone benefits",
          "Lounge access"
        ],
        merchants: ["Amazon", "Flipkart", "Myntra", "Swiggy", "Zomato", "Uber"]
      }
    },
    suitability: "Ideal for young professionals with spending concentrated on major online platforms and who can meet quarterly spending milestones.",
    last_updated: "2024-12-01"
  },
  {
    card_name: "Axis Bank ACE",
    issuer: "Axis",
    network: "Visa",
    card_type: ["Cashback"],
    reward_rates: {
      "bill_payments_google_pay": {
        rate: 5,
        type: "Cashback (%)",
        notes: "Bill payments, recharges via Google Pay. Capped at ₹500 per month.",
        merchants: ["Google Pay", "Bill Payments", "Recharges"]
      },
      "food_delivery_cabs": {
        rate: 4,
        type: "Cashback (%)",
        notes: "Swiggy, Zomato, Ola. Combined cap with 5% category.",
        merchants: ["Swiggy", "Zomato", "Ola"]
      },
      "other_spends": {
        rate: 2,
        type: "Cashback (%)",
        notes: "Unlimited cashback on all other spends."
      }
    },
    partnerships: {
      "Google_Pay": {
        reward_rate: 5,
        benefits: [
          "5% cashback on bill payments via Google Pay",
          "Monthly cap of ₹500",
          "Includes utility bills and recharges"
        ],
        merchants: ["Google Pay", "Bill Payments", "Mobile Recharges", "Utility Bills"]
      },
      "Food_Delivery": {
        reward_rate: 4,
        benefits: [
          "4% cashback on food delivery",
          "Includes cab bookings",
          "Combined monthly cap"
        ],
        merchants: ["Swiggy", "Zomato", "Ola"]
      }
    },
    suitability: "Best for users who pay utility bills and recharges via Google Pay and have significant food delivery/cab spends.",
    last_updated: "2024-12-01"
  },
  {
    card_name: "ICICI HPCL Super Saver",
    issuer: "ICICI",
    network: "Visa",
    card_type: ["Co-branded", "Fuel"],
    reward_rates: {
      "hpcl_fuel": {
        rate: 5.5,
        type: "Cashback & Points (%)",
        notes: "4% cashback on fuel at HPCL pumps + 1.5% back as points via HP Pay app.",
        merchants: ["HPCL", "HP Pay"]
      },
      "utility_grocery": {
        rate: 5,
        type: "Points (%)",
        notes: "5% back as reward points on grocery, utilities, and department store spends.",
        merchants: ["Grocery Stores", "Utility Bills", "Department Stores"]
      },
      "other_spends": {
        rate: 1,
        type: "Points (%)",
        notes: "2 reward points per ₹100 spent."
      }
    },
    partnerships: {
      "HPCL": {
        reward_rate: 5.5,
        benefits: [
          "4% cashback on HPCL fuel purchases",
          "1.5% additional via HP Pay app",
          "Fuel surcharge waiver included"
        ],
        merchants: ["HPCL Petrol Pumps", "HP Pay"]
      }
    },
    suitability: "A strong contender for a primary fuel card, especially for users who fill up at HPCL pumps and have significant utility/grocery spends.",
    last_updated: "2024-12-01"
  },
  {
    card_name: "HDFC Regalia Gold",
    issuer: "HDFC",
    network: "Visa/Mastercard",
    card_type: ["Rewards", "Travel", "Lifestyle"],
    reward_rates: {
      "partner_brands": {
        rate: 5,
        type: "Multiplier (5x)",
        notes: "20 Reward Points per ₹150 spent at Marks & Spencer, Myntra, Nykaa, Reliance Digital.",
        merchants: ["Marks & Spencer", "Myntra", "Nykaa", "Reliance Digital"]
      },
      "other_spends": {
        rate: 1.33,
        type: "Points (%)",
        notes: "4 Reward Points per ₹150 spent. Good redemption on SmartBuy."
      }
    },
    partnerships: {
      "Premium_Brands": {
        reward_rate: 5,
        benefits: [
          "5x rewards on premium brand partners",
          "Club Vistara Silver membership",
          "SmartBuy portal benefits"
        ],
        merchants: ["Marks & Spencer", "Myntra", "Nykaa", "Reliance Digital"]
      }
    },
    suitability: "A strong mid-range card for those who spend on travel and premium brands, offering a good mix of rewards and travel perks.",
    last_updated: "2024-12-01"
  },
  {
    card_name: "Axis Bank Magnus",
    issuer: "Axis",
    network: "Visa",
    card_type: ["Super Premium", "Travel", "Rewards"],
    reward_rates: {
      "general_spends": {
        rate: 2.4,
        type: "Miles (%)",
        notes: "12 EDGE Reward points per ₹200. Transfer value to airline partners.",
        merchants: ["All Merchants"]
      },
      "travel_portal": {
        rate: 12,
        type: "Miles (%)",
        notes: "60 EDGE Reward points per ₹200 on Axis Travel Edge portal.",
        merchants: ["Axis Travel Edge"]
      }
    },
    partnerships: {
      "Travel_Premium": {
        reward_rate: 12,
        benefits: [
          "12% rewards on travel bookings",
          "Premium lounge access",
          "Airline transfer partners"
        ],
        merchants: ["Axis Travel Edge", "Airlines", "Hotels"]
      }
    },
    suitability: "Premium card for high spenders who prioritize travel rewards and luxury benefits. Best for those who can maximize the travel portal benefits.",
    last_updated: "2024-12-01"
  },
  {
    card_name: "Axis Bank My Zone",
    issuer: "Axis",
    network: "Visa",
    card_type: ["Lifestyle", "Entertainment"],
    reward_rates: {
      "base_rate": {
        rate: 0.8,
        type: "Points (%)",
        notes: "4 EDGE Reward points per ₹200 spent.",
        merchants: ["All Merchants"]
      }
    },
    partnerships: {
      "Entertainment": {
        reward_rate: 0.8,
        benefits: [
          "SonyLIV Premium subscription",
          "BOGO movie tickets on Paytm",
          "40% off on Swiggy orders"
        ],
        merchants: ["SonyLIV", "Paytm Movies", "Swiggy"]
      }
    },
    suitability: "Excellent entry-level card for users who prioritize movie and food delivery benefits over a high reward rate.",
    last_updated: "2024-12-01"
  },
  {
    card_name: "HDFC Diners Club Black",
    issuer: "HDFC",
    network: "Diners Club",
    card_type: ["Super Premium", "Travel", "Rewards"],
    reward_rates: {
      "base_rate": {
        rate: 3.33,
        type: "Points (%)",
        notes: "5 Reward Points for every ₹150 spent. 1 RP = ₹1 on Smartbuy for flights.",
        merchants: ["All Merchants"]
      },
      "smartbuy_portal": {
        rate: 10,
        type: "Multiplier (10x)",
        notes: "Get up to 10x points on travel, shopping via SmartBuy portal. Capped at 7,500 points per month.",
        merchants: ["SmartBuy Portal", "Travel", "Hotels", "Flights"]
      }
    },
    partnerships: {
      "SmartBuy_Portal": {
        reward_rate: 10,
        benefits: [
          "Up to 10x rewards on SmartBuy portal",
          "Excellent for flight and hotel bookings",
          "Monthly cap of 7,500 points"
        ],
        merchants: ["SmartBuy Portal", "Airlines", "Hotels", "Travel"]
      },
      "Premium_Services": {
        reward_rate: 3.33,
        benefits: [
          "Unlimited lounge access",
          "Premium memberships included",
          "Golf course access"
        ],
        merchants: ["All Premium Services"]
      }
    },
    suitability: "An iconic premium card, excellent for high-spenders who can leverage the SmartBuy portal for accelerated rewards and enjoy unlimited lounge access.",
    last_updated: "2024-12-01"
  },
  {
    card_name: "Standard Chartered Ultimate",
    issuer: "Standard Chartered",
    network: "Visa",
    card_type: ["Premium", "Rewards"],
    reward_rates: {
      "base_rate": {
        rate: 3.33,
        type: "Points (%)",
        notes: "5 Reward Points for every ₹150 spent. 1 RP = ₹1. No category restrictions.",
        merchants: ["All Merchants"]
      },
      "duty_free": {
        rate: 5,
        type: "Cashback (%)",
        notes: "5% cashback on duty-free spends, capped at ₹1000/month.",
        merchants: ["Duty Free Shops", "Airports"]
      }
    },
    partnerships: {
      "Universal_Rewards": {
        reward_rate: 3.33,
        benefits: [
          "Flat 3.33% rewards on all spends",
          "No category restrictions",
          "Simple redemption at 1:1 ratio"
        ],
        merchants: ["All Merchants"]
      }
    },
    suitability: "A simple, high-value proposition for users who want a straightforward high reward rate (3.33%) without complex category restrictions or milestone tracking.",
    last_updated: "2024-12-01"
  },
  {
    card_name: "IndusInd Bank Legend",
    issuer: "IndusInd",
    network: "Visa",
    card_type: ["Premium", "Rewards", "Lifetime Free"],
    reward_rates: {
      "weekday_spends": {
        rate: 1,
        type: "Points (%)",
        notes: "1 Reward Point for every ₹100 spent on weekdays.",
        merchants: ["All Merchants"]
      },
      "weekend_spends": {
        rate: 2,
        type: "Points (%)",
        notes: "2 Reward Points for every ₹100 spent on weekends.",
        merchants: ["All Merchants"]
      }
    },
    partnerships: {
      "Weekend_Bonus": {
        reward_rate: 2,
        benefits: [
          "Double rewards on weekend spends",
          "Lifetime free card",
          "Premium brand vouchers"
        ],
        merchants: ["All Weekend Merchants"]
      }
    },
    suitability: "Great lifetime free premium card with weekend spending bonus. Perfect for users who do most shopping on weekends.",
    last_updated: "2024-12-01"
  },
  {
    card_name: "American Express Platinum Travel",
    issuer: "Amex",
    network: "American Express",
    card_type: ["Premium", "Travel"],
    reward_rates: {
      "travel": {
        rate: 5,
        type: "Points (%)",
        notes: "5x Membership Rewards points on travel bookings.",
        merchants: ["Airlines", "Hotels", "Travel Agencies"]
      },
      "dining": {
        rate: 3,
        type: "Points (%)",
        notes: "3x points on dining and entertainment.",
        merchants: ["Restaurants", "Bars", "Entertainment"]
      },
      "other_spends": {
        rate: 1,
        type: "Points (%)",
        notes: "1x points on all other spends."
      }
    },
    partnerships: {
      "Travel_Premium": {
        reward_rate: 5,
        benefits: [
          "5x points on travel bookings",
          "Airport lounge access",
          "Travel insurance coverage"
        ],
        merchants: ["Airlines", "Hotels", "Travel Bookings"]
      }
    },
    suitability: "Premium travel card with excellent travel benefits and rewards. Best for frequent travelers who value Amex's premium services.",
    last_updated: "2024-12-01"
  },
  {
    card_name: "Axis Bank Rewards Credit Card",
    issuer: "Axis",
    network: "Visa",
    card_type: ["Rewards", "Entry-level"],
    reward_rates: {
      "base_rate": {
        rate: 1.6,
        type: "Points (%)",
        notes: "2 EDGE Reward points on every ₹125 spent (unlimited).",
        merchants: ["All Merchants"]
      },
      "apparel_departmental": {
        rate: 16,
        type: "Points (10x)",
        notes: "10X reward points on every ₹125 spent on apparel and departmental stores. Up to ₹7,000 per month on specific categories.",
        merchants: ["Apparel Stores", "Departmental Stores", "Fashion Retailers"]
      },
      "milestone_bonus": {
        rate: 12,
        type: "Bonus Points",
        notes: "1,500 EDGE Reward points on net spends of ₹30,000 per statement cycle.",
        merchants: ["All Merchants"]
      }
    },
    partnerships: {
      "Apparel_Shopping": {
        reward_rate: 16,
        benefits: [
          "10X rewards on apparel and departmental stores",
          "Monthly cap of ₹7,000 on accelerated categories",
          "Great for fashion and clothing purchases"
        ],
        merchants: ["Apparel Stores", "Departmental Stores", "Fashion Outlets", "Clothing Brands"]
      },
      "Milestone_Benefits": {
        reward_rate: 12,
        benefits: [
          "1,500 bonus points on ₹30,000 monthly spend",
          "Membership benefits worth ₹1,000 annually",
          "5,000 welcome points on ₹1,000 spend in 30 days"
        ],
        merchants: ["All Merchants"]
      }
    },
    suitability: "Excellent for fashion enthusiasts and frequent apparel shoppers. The 10X rewards on clothing and departmental stores make it ideal for those who spend regularly on fashion, with good base rewards on other categories.",
    last_updated: "2024-12-01"
  }
];

// Function to get detailed card information
export function getDetailedCardInfo(cardName: string, issuer: string): DetailedCardInfo | null {
  return cardKnowledgeBase.find(card => 
    card.card_name.toLowerCase().includes(cardName.toLowerCase()) && 
    card.issuer.toLowerCase() === issuer.toLowerCase()
  ) || null;
}

// Function to find best card for specific merchant
export function findBestCardForMerchant(userCards: UserOwnedCard[], merchant: string, category: string): {
  card: UserOwnedCard;
  detailedInfo: DetailedCardInfo | null;
  reason: string;
} | null {
  let bestCard = null;
  let bestRate = 0;
  let bestReason = "";
  let bestDetailedInfo = null;

  for (const card of userCards) {
    const detailedInfo = getDetailedCardInfo(card.card_name || "", card.issuer || "");
    
    if (detailedInfo) {
      // Check for specific merchant partnerships
      for (const [partnerName, partnership] of Object.entries(detailedInfo.partnerships)) {
        if (partnership.merchants.some(m => 
          m.toLowerCase().includes(merchant.toLowerCase()) || 
          merchant.toLowerCase().includes(m.toLowerCase())
        )) {
          if (partnership.reward_rate > bestRate) {
            bestCard = card;
            bestRate = partnership.reward_rate;
            bestDetailedInfo = detailedInfo;
            bestReason = `${partnership.reward_rate}% rewards through ${partnerName} partnership. ${partnership.benefits.join(", ")}`;
          }
        }
      }

      // Check category-specific rewards
      for (const [rewardCategory, rewardInfo] of Object.entries(detailedInfo.reward_rates)) {
        if (rewardCategory.toLowerCase().includes(category.toLowerCase()) ||
            (rewardInfo.merchants && rewardInfo.merchants.some(m => 
              m.toLowerCase().includes(merchant.toLowerCase())
            ))) {
          if (rewardInfo.rate > bestRate) {
            bestCard = card;
            bestRate = rewardInfo.rate;
            bestDetailedInfo = detailedInfo;
            bestReason = `${rewardInfo.rate}% ${rewardInfo.type} for ${rewardCategory}. ${rewardInfo.notes}`;
          }
        }
      }
    }
  }

  return bestCard ? { card: bestCard, detailedInfo: bestDetailedInfo, reason: bestReason } : null;
}

// Function to get merchant-specific recommendations
export function getMerchantSpecificAdvice(merchant: string, _category: string): string {
  const merchantAdvice: { [key: string]: string } = {
    "bigbasket": "For BigBasket purchases, Tata Neu Infinity HDFC card offers 5% NeuCoins due to Tata's strategic partnership with BigBasket. This is significantly better than generic grocery rewards (typically 1-2%). The partnership also includes priority delivery and exclusive offers.",
    "amazon": "For Amazon purchases, Amazon Pay ICICI Bank card offers 5% unlimited cashback for Prime members (3% for non-Prime). This beats most generic online shopping rewards. HDFC Millennia also offers 5% on Amazon but with monthly caps.",
    "swiggy": "For Swiggy orders, Swiggy HDFC Bank card offers 10% cashback specifically on Swiggy orders, plus free Swiggy One membership. HDFC Millennia offers 5% on Swiggy, and Axis ACE offers 4% cashback.",
    "flipkart": "For Flipkart purchases, HDFC Millennia offers 5% cashback (with monthly caps). SBI Cashback card offers 5% on all online spends including Flipkart.",
    "zomato": "For Zomato orders, HDFC Millennia offers 5% cashback, while Axis ACE offers 4% cashback. Both are better than generic dining rewards.",
    "myntra": "For Myntra purchases, HDFC Millennia offers 5% cashback, and HDFC Regalia Gold offers 5x reward points on Myntra.",
    "uber": "For Uber rides, HDFC Millennia offers 5% cashback on Uber bookings.",
    "croma": "For Croma purchases, Tata Neu Infinity HDFC card offers 5% NeuCoins due to Tata's ownership of Croma electronics retail chain.",
    "1mg": "For 1mg pharmacy purchases, Tata Neu Infinity HDFC card offers 5% NeuCoins as 1mg is part of the Tata ecosystem.",
    "taj": "For Taj Hotels bookings, Tata Neu Infinity HDFC card offers 5% NeuCoins plus additional hotel benefits due to Tata's ownership of Taj Hotels.",
    "nykaa": "For Nykaa purchases, HDFC Regalia Gold offers 5x reward points on Nykaa, making it excellent for beauty and cosmetics shopping.",
    "reliance digital": "For Reliance Digital purchases, HDFC Regalia Gold offers 5x reward points, making it great for electronics shopping.",
    "hpcl": "For HPCL fuel purchases, ICICI HPCL Super Saver offers 5.5% total rewards (4% cashback + 1.5% via HP Pay app), making it the best choice for HPCL fuel.",
    "google pay": "For bill payments via Google Pay, Axis ACE offers 5% cashback (capped at ₹500/month), making it excellent for utility bill payments.",
    "paytm": "For Paytm transactions, check cards with online spending bonuses like SBI Cashback (5% on online) or specific Paytm partnerships.",
    "apparel": "For apparel and clothing purchases, Axis Bank Rewards Credit Card offers 10X points (16% value) on apparel and departmental stores, making it excellent for fashion shopping.",
    "fashion": "For fashion purchases, Axis Bank Rewards Credit Card offers 10X rewards on apparel stores, while HDFC Millennia offers 5% on Myntra.",
    "clothing": "For clothing purchases, Axis Bank Rewards Credit Card offers 10X points on apparel stores (up to ₹7,000/month), significantly better than general shopping rewards.",
    "departmental stores": "For departmental store purchases, Axis Bank Rewards Credit Card offers 10X rewards, making it ideal for shopping at large retail chains."
  };

  return merchantAdvice[merchant.toLowerCase()] || "";
}