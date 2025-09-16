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
  joining_fee: number;
  annual_fee: number;
  fee_waiver: string;
  reward_rates: {
    [category: string]: {
      rate: number | string;
      type: string;
      notes: string;
      merchants?: string[];
    };
  };
  partnerships: {
    [partner: string]: {
      reward_rate: number | string;
      benefits: string[];
      merchants: string[];
    };
  };
  lounge_access: {
    domestic: string;
    international: string;
  };
  suitability: string;
  last_updated: string;
}

export const cardKnowledgeBase: DetailedCardInfo[] = [
  // --- Foundational Co-Branded & Cashback Cards ---
  {
    card_name: "Tata Neu Infinity HDFC Bank",
    issuer: "HDFC",
    network: "Visa/RuPay",
    card_type: ["Co-branded", "Rewards"],
    joining_fee: 1499,
    annual_fee: 1499,
    fee_waiver: "Annual fee waived on spends of ₹3,00,000 in a year.",
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
        merchants: ["BigBasket", "Croma", "Tata CLiQ", "Taj Hotels", "1mg", "Vistara", "Tata AIG", "Tata Motors", "Titan"]
      },
      "other_spends": {
        rate: 1.5,
        type: "NeuCoins (%)",
        notes: "Applies to all other domestic and international spends."
      }
    },
    partnerships: {
      "Tata_Ecosystem": {
        reward_rate: 10,
        benefits: [
          "10% NeuCoins on Tata Neu App",
          "5% NeuCoins across other Tata brands",
          "Unified loyalty program with cross-brand redemptions",
          "1 NeuCoin = ₹1"
        ],
        merchants: ["Tata Neu App", "BigBasket", "Croma", "Tata CLiQ", "Taj Hotels", "1mg", "Vistara"]
      }
    },
    lounge_access: {
      domestic: "8 complimentary visits per year (2 per quarter).",
      international: "4 complimentary visits per year with Priority Pass (1 per quarter)."
    },
    suitability: "Extremely valuable for users deeply integrated into the Tata ecosystem, especially for grocery shopping on BigBasket and other Tata brands.",
    last_updated: "2024-08-28"
  },
  {
    card_name: "Amazon Pay ICICI Bank",
    issuer: "ICICI",
    network: "Visa",
    card_type: ["Co-branded", "Cashback", "Lifetime Free"],
    joining_fee: 0,
    annual_fee: 0,
    fee_waiver: "Lifetime Free.",
    reward_rates: {
      "amazon_prime": {
        rate: 5,
        type: "Cashback (%)",
        notes: "5% unlimited cashback on Amazon.in for Prime members.",
        merchants: ["Amazon.in"]
      },
      "amazon_non_prime": {
        rate: 3,
        type: "Cashback (%)",
        notes: "3% unlimited cashback on Amazon.in for non-Prime members.",
        merchants: ["Amazon.in"]
      },
      "amazon_pay_partners": {
        rate: 2,
        type: "Cashback (%)",
        notes: "2% cashback on bill payments and recharges through Amazon Pay.",
        merchants: ["Amazon Pay"]
      },
      "other_spends": {
        rate: 1,
        type: "Cashback (%)",
        notes: "1% cashback on all other spends."
      }
    },
    partnerships: {
      "Amazon": {
        reward_rate: 5,
        benefits: [
          "5% unlimited cashback for Prime members",
          "3% cashback for non-Prime members",
          "No minimum spend requirement",
          "Cashback credited directly to Amazon Pay balance"
        ],
        merchants: ["Amazon.in", "Amazon Pay"]
      }
    },
    lounge_access: {
      domestic: "None.",
      international: "None."
    },
    suitability: "A must-have for heavy Amazon shoppers, especially Prime members. Best-in-class rewards for Amazon purchases.",
    last_updated: "2024-08-28"
  },
  {
    card_name: "Flipkart Axis Bank",
    issuer: "Axis",
    network: "Mastercard",
    card_type: ["Co-branded", "Cashback"],
    joining_fee: 500,
    annual_fee: 500,
    fee_waiver: "Annual fee waived on spends of ₹3,50,000 in a year.",
    reward_rates: {
      "flipkart_myntra": {
        rate: 5,
        type: "Cashback (%)",
        notes: "Unlimited 5% cashback on Flipkart and Myntra.",
        merchants: ["Flipkart", "Myntra"]
      },
      "preferred_partners": {
        rate: 4,
        type: "Cashback (%)",
        notes: "4% cashback on preferred partners like Swiggy, Uber, PVR, Curefit.",
        merchants: ["Swiggy", "Uber", "PVR", "Curefit"]
      },
      "other_spends": {
        rate: 1.5,
        type: "Cashback (%)",
        notes: "1.5% cashback on all other spends."
      }
    },
    partnerships: {
      "Flipkart_Ecosystem": {
        reward_rate: 5,
        benefits: [
          "5% unlimited cashback on Flipkart & Myntra",
          "Welcome benefits include Flipkart vouchers and Swiggy discounts",
          "Direct statement credit for cashback"
        ],
        merchants: ["Flipkart", "Myntra", "2GUD"]
      }
    },
    lounge_access: {
      domestic: "4 complimentary visits per year.",
      international: "None."
    },
    suitability: "The default choice for frequent shoppers on Flipkart and Myntra, with solid returns on other popular lifestyle categories.",
    last_updated: "2024-08-28"
  },
  {
    card_name: "SBI Cashback Card",
    issuer: "SBI",
    network: "Mastercard",
    card_type: ["Cashback"],
    joining_fee: 999,
    annual_fee: 999,
    fee_waiver: "Annual fee reversed on spending ₹2,00,000 or more in the preceding year.",
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
        notes: "Includes utility bill payments. Excludes rent, fuel, wallet loads."
      }
    },
    partnerships: {
      "Online_Shopping": {
        reward_rate: 5,
        benefits: [
          "5% cashback on all online spends without restrictions",
          "High monthly cap of ₹5,000 cashback",
          "Cashback is credited directly to the statement"
        ],
        merchants: ["All Online Merchants", "E-commerce", "Online Services"]
      }
    },
    lounge_access: {
      domestic: "None (Benefit was discontinued).",
      international: "None."
    },
    suitability: "Excellent for users with high and diverse online spending across various merchants due to its high, uncategorized cashback rate.",
    last_updated: "2024-08-28"
  },
  {
    card_name: "HDFC Millennia",
    issuer: "HDFC",
    network: "Visa/Mastercard",
    card_type: ["Cashback", "Rewards"],
    joining_fee: 1000,
    annual_fee: 1000,
    fee_waiver: "Spend ₹1,00,000 in an anniversary year.",
    reward_rates: {
      "partner_merchants": {
        rate: 5,
        type: "Cashback (%)",
        notes: "On Amazon, Flipkart, Myntra, Swiggy, Zomato, Uber etc. Capped at 1000 CashPoints per month.",
        merchants: ["Amazon", "Flipkart", "Myntra", "Swiggy", "Zomato", "Uber", "BookMyShow"]
      },
      "all_other_spends": {
        rate: 1,
        type: "Cashback (%)",
        notes: "Applies to all other spends, including EMIs and wallet loads. Capped at 1000 CashPoints per month."
      }
    },
    partnerships: {
      "Major_Platforms": {
        reward_rate: 5,
        benefits: [
          "5% cashback on a wide range of popular online platforms",
          "Quarterly milestone benefit of ₹1000 voucher on spending ₹1 Lakh",
          "1 CashPoint = ₹1 for statement credit"
        ],
        merchants: ["Amazon", "Flipkart", "Myntra", "Swiggy", "Zomato", "Uber"]
      }
    },
    lounge_access: {
      domestic: "8 complimentary visits per year (2 per quarter).",
      international: "None."
    },
    suitability: "Ideal for young professionals with spending concentrated on major online platforms and who can meet quarterly spending milestones.",
    last_updated: "2024-08-28"
  },
  {
    card_name: "Axis Bank ACE",
    issuer: "Axis",
    network: "Visa",
    card_type: ["Cashback"],
    joining_fee: 499,
    annual_fee: 499,
    fee_waiver: "Annual fee waived on spends of ₹2,00,000 in a year.",
    reward_rates: {
      "bill_payments_google_pay": {
        rate: 5,
        type: "Cashback (%)",
        notes: "Bill payments, recharges via Google Pay. Capped at ₹500 per month.",
        merchants: ["Google Pay"]
      },
      "food_delivery_cabs": {
        rate: 4,
        type: "Cashback (%)",
        notes: "Swiggy, Zomato, Ola. Combined monthly cap of ₹500 for 5% & 4% categories.",
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
          "5% cashback on bill payments and recharges via Google Pay",
          "High flat 2% cashback on all other spends"
        ],
        merchants: ["Google Pay"]
      }
    },
    lounge_access: {
      domestic: "4 complimentary visits per year.",
      international: "None."
    },
    suitability: "Best for users who pay utility bills and recharges via Google Pay and have significant food delivery/cab spends.",
    last_updated: "2024-08-28"
  },
  // --- NEW CARDS ADDED ---
  {
    card_name: "Scapia Federal Bank",
    issuer: "Federal Bank",
    network: "Visa",
    card_type: ["Travel", "Rewards", "Lifetime Free"],
    joining_fee: 0,
    annual_fee: 0,
    fee_waiver: "Lifetime Free.",
    reward_rates: {
      "travel_spends": {
        rate: 4,
        type: "Scapia Coins (%)",
        notes: "20% Scapia coins on travel bookings made on the Scapia App. 5 coins = ₹1.",
        merchants: ["Scapia App"]
      },
      "all_other_spends": {
        rate: 2,
        type: "Scapia Coins (%)",
        notes: "10% Scapia coins on all online and offline spends."
      }
    },
    partnerships: {
      "Travel": {
        reward_rate: 4,
        benefits: [
          "Zero forex markup on all international transactions",
          "Unlimited domestic lounge access on spending ₹5,000 in a statement cycle",
          "High reward rate on travel bookings via Scapia app"
        ],
        merchants: ["Scapia App", "Airlines", "Hotels"]
      }
    },
    lounge_access: {
      domestic: "Unlimited (conditional on spending ₹5k in previous billing cycle).",
      international: "None."
    },
    suitability: "The best lifetime-free card for international travelers due to its zero forex markup. Ideal for those who can meet the minimum spend for unlimited lounge access.",
    last_updated: "2024-08-28"
  },
  {
    card_name: "Kotak Myntra",
    issuer: "Kotak Mahindra",
    network: "Mastercard",
    card_type: ["Co-branded", "Cashback", "Lifestyle"],
    joining_fee: 500,
    annual_fee: 500,
    fee_waiver: "Annual fee waived on spends of ₹2,00,000 in a year.",
    reward_rates: {
      "myntra_spends": {
        rate: 7.5,
        type: "Cashback (%)",
        notes: "Instant 7.5% discount on Myntra, up to ₹750 per transaction.",
        merchants: ["Myntra"]
      },
      "preferred_partners": {
        rate: 5,
        type: "Cashback (%)",
        notes: "5% cashback on partners like Swiggy, Swiggy Instamart, PVR, Cleartrip, Urban Company.",
        merchants: ["Swiggy", "Swiggy Instamart", "PVR", "Cleartrip", "Urban Company"]
      },
      "other_spends": {
        rate: 1.25,
        type: "Cashback (%)",
        notes: "Unlimited 1.25% cashback on all other spends."
      }
    },
    partnerships: {
      "Myntra_Ecosystem": {
        reward_rate: 7.5,
        benefits: [
          "7.5% instant discount on Myntra",
          "Complimentary Myntra Insider membership",
          "Free access to PVR movie tickets on spending milestones"
        ],
        merchants: ["Myntra"]
      }
    },
    lounge_access: {
      domestic: "8 complimentary visits per year (2 per quarter), on spending ₹50,000 in the previous quarter.",
      international: "None."
    },
    suitability: "A must-have for frequent Myntra shoppers and users who spend on its partner brands like Swiggy and PVR.",
    last_updated: "2024-08-28"
  },
  {
    card_name: "PhonePe SBI Card",
    issuer: "SBI",
    network: "Visa/RuPay",
    card_type: ["Co-branded", "Cashback"],
    joining_fee: 499,
    annual_fee: 499,
    fee_waiver: "Annual fee waived on spends of ₹2,00,000 in a year.",
    reward_rates: {
      "phonepe_spends": {
        rate: 3,
        type: "Cashback (%)",
        notes: "3% cashback on all spends on the PhonePe app, including bill payments, travel, and food orders. Capped at ₹500/month.",
        merchants: ["PhonePe"]
      },
      "partner_merchants": {
        rate: 2,
        type: "Cashback (%)",
        notes: "2% cashback on partner merchants like Flipkart, Myntra, and Swiggy. Capped at ₹500/month.",
        merchants: ["Flipkart", "Myntra", "Swiggy"]
      },
      "other_spends": {
        rate: 1,
        type: "Cashback (%)",
        notes: "1% cashback on all other spends. Capped at ₹200/month."
      }
    },
    partnerships: {
      "PhonePe_Ecosystem": {
        reward_rate: 3,
        benefits: [
          "Good cashback rate for transactions within the PhonePe app",
          "Covers a wide range of categories like bills, travel, and food",
          "RuPay variant can be linked to UPI"
        ],
        merchants: ["PhonePe"]
      }
    },
    lounge_access: {
      domestic: "None.",
      international: "None."
    },
    suitability: "Best for users who extensively use the PhonePe app for various payments and want a simple cashback card integrated with the app.",
    last_updated: "2024-08-28"
  },
  // --- Premium & Travel Cards ---
  {
    card_name: "HDFC Regalia Gold",
    issuer: "HDFC",
    network: "Visa/Mastercard",
    card_type: ["Rewards", "Travel", "Lifestyle"],
    joining_fee: 2500,
    annual_fee: 2500,
    fee_waiver: "Spend ₹4,00,000 in an anniversary year.",
    reward_rates: {
      "partner_brands": {
        rate: "5x",
        type: "Multiplier",
        notes: "20 Reward Points per ₹150 spent at Marks & Spencer, Myntra, Nykaa, Reliance Digital. Capped at 5,000 points per month.",
        merchants: ["Marks & Spencer", "Myntra", "Nykaa", "Reliance Digital"]
      },
      "other_spends": {
        rate: 1.33,
        type: "Points (%)",
        notes: "4 Reward Points per ₹150 spent. Good redemption value on SmartBuy portal for flights."
      }
    },
    partnerships: {
      "Premium_Brands": {
        reward_rate: "5x",
        benefits: [
          "5x rewards on premium brand partners",
          "Complimentary Club Vistara Silver & MMT Black Elite memberships",
          "Milestone benefits include flight vouchers worth ₹5,000"
        ],
        merchants: ["Marks & Spencer", "Myntra", "Nykaa", "Reliance Digital"]
      }
    },
    lounge_access: {
      domestic: "12 complimentary visits per year.",
      international: "6 complimentary visits per year via Priority Pass."
    },
    suitability: "A strong mid-range card for those who spend on travel and premium brands, offering a good mix of rewards and travel perks.",
    last_updated: "2024-08-28"
  },
  {
    card_name: "Axis Bank Magnus",
    issuer: "Axis",
    network: "Visa",
    card_type: ["Super Premium", "Travel", "Rewards"],
    joining_fee: 12500,
    annual_fee: 12500,
    fee_waiver: "Fee is mandatory.",
    reward_rates: {
      "general_spends": {
        rate: 2.4,
        type: "Miles (%)",
        notes: "12 EDGE Reward points per ₹200. Transfer value to airline partners is 5:4.",
        merchants: ["All Merchants"]
      },
      "travel_portal": {
        rate: 6,
        type: "Miles (%)",
        notes: "30 EDGE Reward points per ₹200 on Axis Travel Edge portal.",
        merchants: ["Axis Travel Edge"]
      }
    },
    partnerships: {
      "Airline_Partners": {
        reward_rate: 2.4,
        benefits: [
          "Excellent point transfer ratio (5:4) to a wide range of airlines and hotels",
          "Unlimited international lounge access for primary and guests",
          "Buy One Get One on BookMyShow up to ₹500 twice a month"
        ],
        merchants: ["Vistara", "Singapore Airlines", "Marriott Bonvoy", "ITC", "Qatar Airways", "Etihad", "United Airlines"]
      }
    },
    lounge_access: {
      domestic: "Unlimited, plus 8 guest visits per year.",
      international: "Unlimited with Priority Pass, plus 8 guest visits per year."
    },
    suitability: "For high-spenders and frequent international travelers who can maximize travel benefits and point transfers to airlines.",
    last_updated: "2024-08-28"
  },
  {
    card_name: "HDFC Diners Club Black",
    issuer: "HDFC",
    network: "Diners Club",
    card_type: ["Super Premium", "Travel", "Rewards"],
    joining_fee: 10000,
    annual_fee: 10000,
    fee_waiver: "Spend ₹8,00,000 in an anniversary year.",
    reward_rates: {
      "base_rate": {
        rate: 3.33,
        type: "Points (%)",
        notes: "5 Reward Points for every ₹150 spent. 1 RP = ₹1 on Smartbuy for flights.",
        merchants: ["All Merchants"]
      },
      "smartbuy_portal": {
        rate: "10x",
        type: "Multiplier",
        notes: "Get up to 10x points (33.3% value) on travel & shopping via SmartBuy. Capped at 7,500 points per month.",
        merchants: ["SmartBuy Portal"]
      }
    },
    partnerships: {
      "SmartBuy_Portal": {
        reward_rate: "10x",
        benefits: [
          "Market-leading reward rate on SmartBuy portal",
          "1:1 point transfer to major airlines",
          "Complimentary annual memberships (Amazon Prime, Swiggy One etc.)"
        ],
        merchants: ["Amazon (via SmartBuy)", "Flipkart (via SmartBuy)", "MakeMyTrip", "Yatra"]
      }
    },
    lounge_access: {
      domestic: "Unlimited for primary and add-on members.",
      international: "Unlimited for primary and add-on members."
    },
    suitability: "An iconic premium card, excellent for high-spenders who can leverage the SmartBuy portal for accelerated rewards and enjoy unlimited lounge access.",
    last_updated: "2024-08-28"
  },
  {
    card_name: "IDFC First Wealth",
    issuer: "IDFC",
    network: "Visa",
    card_type: ["Premium", "Rewards", "Lifetime Free"],
    joining_fee: 0,
    annual_fee: 0,
    fee_waiver: "Lifetime Free.",
    reward_rates: {
      "online_spends": {
        rate: "6x",
        type: "Multiplier",
        notes: "6X rewards on online spends up to ₹30,000 per month.",
        merchants: ["All Online Merchants"]
      },
      "offline_spends": {
        rate: "3x",
        type: "Multiplier",
        notes: "3X rewards on offline spends."
      }
    },
    partnerships: {
      "Lifestyle_Benefits": {
        reward_rate: "6x",
        benefits: [
          "Buy one get one on movie tickets up to ₹500, twice a month",
          "Complimentary golf access",
          "Low forex markup of 1.5%"
        ],
        merchants: ["Paytm Movies"]
      }
    },
    lounge_access: {
      domestic: "4 complimentary airport and spa visits per quarter.",
      international: "4 complimentary airport visits per quarter."
    },
    suitability: "One of the best Lifetime Free premium cards, offering great rewards, comprehensive travel benefits, and low forex markup.",
    last_updated: "2024-08-28"
  },
  {
    card_name: "American Express Platinum Travel",
    issuer: "Amex",
    network: "American Express",
    card_type: ["Travel", "Rewards"],
    joining_fee: 3500,
    annual_fee: 5000,
    fee_waiver: "None.",
    reward_rates: {
      "base_rate": {
        rate: 1,
        type: "Points",
        notes: "1 MR Point per ₹50 spent. Value comes from milestone benefits.",
        merchants: ["All Merchants"]
      }
    },
    partnerships: {
      "Milestone_Travel": {
        reward_rate: 7, // Effective rate if milestones are met
        benefits: [
          "Spend ₹1.9L in a year to get travel vouchers worth over ₹6,000",
          "Spend ₹4L in a year to get additional vouchers plus a ₹10,000 Taj Stay voucher",
          "Points can be transferred to airline/hotel partners"
        ],
        merchants: ["Indigo", "Taj Hotels"]
      }
    },
    lounge_access: {
      domestic: "8 complimentary visits per year (2 per quarter).",
      international: "None."
    },
    suitability: "Perfect for users who can consolidate their annual spending to meet milestone targets, offering one of the best reward rates in its class via milestone achievement.",
    last_updated: "2024-08-28"
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
          const currentRate = typeof partnership.reward_rate === 'string' ? parseFloat(partnership.reward_rate) : partnership.reward_rate;
          if (currentRate > bestRate) {
            bestCard = card;
            bestRate = currentRate;
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
          const currentRate = typeof rewardInfo.rate === 'string' ? parseFloat(rewardInfo.rate) : rewardInfo.rate;
          if (currentRate > bestRate) {
            bestCard = card;
            bestRate = currentRate;
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
export function getMerchantSpecificAdvice(merchant: string): string {
  const merchantAdvice: { [key: string]: string } = {
    "bigbasket": "For BigBasket purchases, Tata Neu Infinity HDFC card offers 5% NeuCoins due to Tata's strategic partnership with BigBasket. This is significantly better than generic grocery rewards (typically 1-2%). The partnership also includes priority delivery and exclusive offers.",
    "amazon": "For Amazon purchases, Amazon Pay ICICI Bank card offers 5% unlimited cashback for Prime members (3% for non-Prime). This beats most generic online shopping rewards. HDFC Millennia also offers 5% on Amazon but with monthly caps.",
    "swiggy": "For Swiggy orders, the Flipkart Axis card offers 4% cashback. HDFC Millennia offers 5% on Swiggy, and Axis ACE offers 4% cashback.",
    "flipkart": "For Flipkart purchases, the Flipkart Axis Bank card is the top choice with 5% unlimited cashback. HDFC Millennia also offers 5% cashback but with monthly caps. SBI Cashback card offers 5% on all online spends including Flipkart.",
    "zomato": "For Zomato orders, HDFC Millennia offers 5% cashback, while Axis ACE offers 4% cashback. Both are better than generic dining rewards.",
    "myntra": "For Myntra purchases, the Kotak Myntra card gives 7.5% instant discount, the Flipkart Axis Bank card gives 5% unlimited cashback. HDFC Millennia also offers 5% cashback, and HDFC Regalia Gold offers 5x reward points on Myntra.",
    "uber": "For Uber rides, HDFC Millennia and Flipkart Axis Bank card both offer cashback.",
    "croma": "For Croma purchases, Tata Neu Infinity HDFC card offers 5% NeuCoins due to Tata's ownership of Croma electronics retail chain.",
    "1mg": "For 1mg pharmacy purchases, Tata Neu Infinity HDFC card offers 5% NeuCoins as 1mg is part of the Tata ecosystem.",
    "taj": "For Taj Hotels bookings, Tata Neu Infinity HDFC card offers 5% NeuCoins plus additional hotel benefits due to Tata's ownership of Taj Hotels.",
    "nykaa": "For Nykaa purchases, HDFC Regalia Gold offers 5x reward points on Nykaa, making it excellent for beauty and cosmetics shopping.",
    "reliance digital": "For Reliance Digital purchases, HDFC Regalia Gold offers 5x reward points, making it great for electronics shopping.",
    "hpcl": "For HPCL fuel purchases, ICICI HPCL Super Saver offers 5.5% total rewards (4% cashback + 1.5% via HP Pay app), making it the best choice for HPCL fuel.",
    "google pay": "For bill payments via Google Pay, Axis ACE offers 5% cashback (capped at ₹500/month), making it excellent for utility bill payments.",
    "phonepe": "For PhonePe transactions, PhonePe SBI Card offers 3% cashback on all spends within the PhonePe app, including bill payments, travel, and food orders.",
    "paytm": "For Paytm transactions, check cards with online spending bonuses like SBI Cashback (5% on online) or specific Paytm partnerships.",
    "apparel": "For apparel and clothing purchases, check for cards with specific fashion partnerships like Flipkart Axis for Myntra.",
    "fashion": "For fashion purchases, check for cards with specific fashion partnerships like Flipkart Axis for Myntra.",
    "clothing": "For clothing purchases, check for cards with specific fashion partnerships like Flipkart Axis for Myntra.",
    "departmental stores": "For departmental store purchases, check cards with broad shopping categories."
  };

  return merchantAdvice[merchant.toLowerCase()] || "";
}