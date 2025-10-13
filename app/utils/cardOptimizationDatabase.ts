// Detailed card optimization strategies database
export interface CardOptimizationTips {
  card_name: string;
  issuer: string;
  optimization_strategies: {
    primary_benefits: string[];
    payment_methods: {
      direct_payment: {
        recommended: boolean;
        scenarios: string[];
        reward_rate: string;
      };
      wallet_loading: {
        recommended: boolean;
        scenarios: string[];
        reward_rate: string;
        best_wallets: string[];
      };
      app_specific: {
        recommended_apps: string[];
        benefits: string[];
        tips: string[];
      };
    };
    spending_strategies: {
      category: string;
      strategy: string;
      expected_return: string;
    }[];
    milestone_optimization: {
      annual_targets: string[];
      quarterly_benefits: string[];
      monthly_tips: string[];
    };
    point_redemption: {
      best_options: string[];
      transfer_partners: string[];
      cash_equivalent_value: string;
    };
    common_mistakes: string[];
    pro_tips: string[];
  };
}

export const cardOptimizationDatabase: CardOptimizationTips[] = [
  {
    card_name: "IDFC FIRST Power+ HP Card",
    issuer: "IDFC FIRST Bank",
    optimization_strategies: {
      primary_benefits: [
        "10X reward points on HP Pay app transactions",
        "5X points on fuel at HP petrol pumps",
        "2X points on all other spends",
        "Complimentary fuel delivery service"
      ],
      payment_methods: {
        direct_payment: {
          recommended: false,
          scenarios: ["Emergency fuel purchases when HP Pay is not working"],
          reward_rate: "2X points (1% return)"
        },
        wallet_loading: {
          recommended: true,
          scenarios: ["All HP fuel purchases", "HP Pay app transactions"],
          reward_rate: "10X points (5% return)",
          best_wallets: ["HP Pay app wallet", "Direct HP Pay transactions"]
        },
        app_specific: {
          recommended_apps: ["HP Pay app"],
          benefits: [
            "10X reward points on all transactions",
            "Fuel delivery to your location",
            "Skip queue at petrol pumps",
            "Digital payment convenience"
          ],
          tips: [
            "Always load money to HP Pay wallet first, then use for fuel",
            "Use HP Pay for non-fuel purchases at HP outlets for 10X points",
            "Link your IDFC card as primary payment method in HP Pay",
            "Check for HP Pay cashback offers before fueling"
          ]
        }
      },
      spending_strategies: [
        {
          category: "Fuel",
          strategy: "Use HP Pay app exclusively for 10X points. Load wallet monthly based on fuel needs.",
          expected_return: "5% effective return on fuel spends"
        },
        {
          category: "Groceries at HP outlets",
          strategy: "Use HP Pay app for grocery purchases at HP outlets for 10X points",
          expected_return: "5% return on grocery spends"
        },
        {
          category: "Other spends",
          strategy: "Use for general spends only if no better category card available",
          expected_return: "1% return on other spends"
        }
      ],
      milestone_optimization: {
        annual_targets: [
          "Spend ₹1 lakh annually to waive annual fee",
          "Focus spending on HP Pay transactions for maximum returns"
        ],
        quarterly_benefits: [
          "Track quarterly fuel spends to optimize HP Pay usage",
          "Plan major fuel expenses around HP Pay offers"
        ],
        monthly_tips: [
          "Load HP Pay wallet at month start for better tracking",
          "Use HP fuel delivery service for convenience",
          "Check HP Pay app for monthly cashback offers"
        ]
      },
      point_redemption: {
        best_options: [
          "Redeem against statement balance for 1 point = ₹0.50",
          "Gift vouchers for better value (check current rates)",
          "Travel bookings through IDFC portal"
        ],
        transfer_partners: ["Limited transfer options - focus on direct redemption"],
        cash_equivalent_value: "₹0.50 per point for statement credit"
      },
      common_mistakes: [
        "Using card directly at HP pumps instead of HP Pay app",
        "Not loading HP Pay wallet before transactions",
        "Using for non-HP fuel purchases where other cards give better returns",
        "Ignoring annual fee waiver spending requirement"
      ],
      pro_tips: [
        "Set up auto-debit from IDFC card to HP Pay wallet monthly",
        "Use HP fuel delivery service for convenience and same 10X points",
        "Combine with other fuel cards for non-HP stations",
        "Track spending to ensure annual fee waiver eligibility",
        "Use HP Pay for snacks/beverages at HP outlets for 10X points"
      ]
    }
  },
  {
    card_name: "HDFC Infinia",
    issuer: "HDFC Bank",
    optimization_strategies: {
      primary_benefits: [
        "3.3% return on most spends",
        "1:1 airline mile transfers",
        "Premium lounge access",
        "Comprehensive travel insurance"
      ],
      payment_methods: {
        direct_payment: {
          recommended: true,
          scenarios: ["All high-value transactions", "Travel bookings", "Dining"],
          reward_rate: "3.3% effective return"
        },
        wallet_loading: {
          recommended: false,
          scenarios: ["Only if wallet offers additional cashback"],
          reward_rate: "May not earn points on wallet loads",
          best_wallets: ["Check current HDFC policy on wallet loads"]
        },
        app_specific: {
          recommended_apps: ["HDFC SmartBuy portal", "Airline websites"],
          benefits: [
            "5X points on SmartBuy portal",
            "Direct airline bookings for miles",
            "Hotel bookings for points"
          ],
          tips: [
            "Always check SmartBuy portal before online purchases",
            "Book flights directly with airlines for miles + points",
            "Use for high-value purchases to maximize 3.3% return"
          ]
        }
      },
      spending_strategies: [
        {
          category: "Travel",
          strategy: "Book flights directly with airlines, hotels through SmartBuy for 5X points",
          expected_return: "5-10% effective return with mile transfers"
        },
        {
          category: "Dining",
          strategy: "Use for all restaurant spends for 3.3% return + dining benefits",
          expected_return: "3.3% + additional dining perks"
        },
        {
          category: "Online Shopping",
          strategy: "Use SmartBuy portal for 5X points on major retailers",
          expected_return: "5% effective return"
        }
      ],
      milestone_optimization: {
        annual_targets: [
          "Spend ₹10 lakhs for fee waiver",
          "Focus on high-value transactions for maximum points"
        ],
        quarterly_benefits: [
          "Plan travel bookings to maximize quarterly spends",
          "Use dining benefits regularly"
        ],
        monthly_tips: [
          "Check SmartBuy offers monthly",
          "Plan high-value purchases strategically",
          "Use lounge access benefits"
        ]
      },
      point_redemption: {
        best_options: [
          "Transfer to airline partners at 1:1 ratio",
          "Book travel through HDFC portal",
          "Statement credit as last resort"
        ],
        transfer_partners: ["Singapore Airlines", "British Airways", "Air France KLM"],
        cash_equivalent_value: "₹0.50-1.00 per point depending on redemption"
      },
      common_mistakes: [
        "Not using SmartBuy portal for online shopping",
        "Redeeming points for statement credit instead of transfers",
        "Not maximizing travel category spends",
        "Ignoring annual fee waiver requirements"
      ],
      pro_tips: [
        "Transfer points to Singapore Airlines for premium cabin redemptions",
        "Use SmartBuy for all online shopping",
        "Combine with airline co-brand cards for maximum miles",
        "Book hotels through SmartBuy for 5X points",
        "Use for all dining to maximize category benefits"
      ]
    }
  },
  {
    card_name: "Axis Magnus",
    issuer: "Axis Bank",
    optimization_strategies: {
      primary_benefits: [
        "12 Edge Reward points per ₹200 spent",
        "25,000 points transfer to 5,000 airline miles",
        "Monthly milestone benefits",
        "Premium travel benefits"
      ],
      payment_methods: {
        direct_payment: {
          recommended: true,
          scenarios: ["All transactions above ₹200", "Travel bookings", "High-value purchases"],
          reward_rate: "6% effective return with optimal redemption"
        },
        wallet_loading: {
          recommended: false,
          scenarios: ["Only for specific wallet offers"],
          reward_rate: "Check current Axis policy",
          best_wallets: ["Payzapp (if earning points)"]
        },
        app_specific: {
          recommended_apps: ["Axis Mobile app", "Travel Edge portal"],
          benefits: [
            "Track milestone progress",
            "Book travel for bonus points",
            "Manage point transfers"
          ],
          tips: [
            "Monitor monthly milestone progress",
            "Use Travel Edge for flight bookings",
            "Set up milestone alerts"
          ]
        }
      },
      spending_strategies: [
        {
          category: "Monthly Milestone",
          strategy: "Spend ₹1 lakh monthly for 25,000 bonus points",
          expected_return: "Additional 25% bonus on monthly spends"
        },
        {
          category: "Travel",
          strategy: "Use for all travel bookings to maximize points + miles",
          expected_return: "6-12% effective return with transfers"
        },
        {
          category: "Large Purchases",
          strategy: "Time large purchases to hit monthly milestones",
          expected_return: "Up to 7.2% with milestone bonus"
        }
      ],
      milestone_optimization: {
        annual_targets: [
          "Spend ₹15 lakhs annually for fee waiver",
          "Hit monthly ₹1 lakh milestone consistently"
        ],
        quarterly_benefits: [
          "Plan quarterly spends around milestone targets",
          "Use quarterly travel benefits"
        ],
        monthly_tips: [
          "Track spending to hit ₹1 lakh milestone",
          "Time large purchases for milestone completion",
          "Transfer points in multiples of 25,000"
        ]
      },
      point_redemption: {
        best_options: [
          "Transfer 25,000 points = 5,000 airline miles",
          "Travel bookings through Travel Edge",
          "Gift vouchers for good value"
        ],
        transfer_partners: ["Singapore Airlines", "British Airways", "Etihad"],
        cash_equivalent_value: "₹0.50-2.00 per point depending on transfer"
      },
      common_mistakes: [
        "Not hitting monthly ₹1 lakh milestone",
        "Transferring points in non-optimal quantities",
        "Using for small transactions under ₹200",
        "Not timing large purchases strategically"
      ],
      pro_tips: [
        "Always transfer points in multiples of 25,000 for best ratio",
        "Time large purchases to complete monthly milestones",
        "Use for all transactions above ₹200 for maximum points",
        "Combine with airline cards for double miles earning",
        "Plan annual spends to hit fee waiver target"
      ]
    }
  },
  {
    card_name: "SBI Cashback Card",
    issuer: "State Bank of India",
    optimization_strategies: {
      primary_benefits: [
        "5% cashback on online spends",
        "1% cashback on offline spends",
        "No upper limit on online cashback",
        "Low annual fee"
      ],
      payment_methods: {
        direct_payment: {
          recommended: true,
          scenarios: ["All online transactions", "E-commerce purchases", "Bill payments"],
          reward_rate: "5% cashback online, 1% offline"
        },
        wallet_loading: {
          recommended: true,
          scenarios: ["Loading wallets for offline use to get 5% rate"],
          reward_rate: "5% if wallet load counts as online transaction",
          best_wallets: ["Paytm", "PhonePe", "Amazon Pay"]
        },
        app_specific: {
          recommended_apps: ["Amazon", "Flipkart", "Swiggy", "Zomato"],
          benefits: [
            "5% cashback on all online platforms",
            "No merchant restrictions",
            "Instant cashback credit"
          ],
          tips: [
            "Use for all online shopping without limits",
            "Load wallets online to get 5% for offline use",
            "Use for all bill payments online"
          ]
        }
      },
      spending_strategies: [
        {
          category: "Online Shopping",
          strategy: "Use for all e-commerce purchases - Amazon, Flipkart, etc.",
          expected_return: "5% unlimited cashback"
        },
        {
          category: "Food Delivery",
          strategy: "Use for Swiggy, Zomato, and other food delivery apps",
          expected_return: "5% cashback on food orders"
        },
        {
          category: "Bill Payments",
          strategy: "Pay all utility bills online for 5% cashback",
          expected_return: "5% on utility bills"
        }
      ],
      milestone_optimization: {
        annual_targets: [
          "No specific milestones - maximize online spends",
          "Pay annual fee through online spends for 5% return"
        ],
        quarterly_benefits: [
          "No quarterly limits - consistent 5% online",
          "Plan major online purchases anytime"
        ],
        monthly_tips: [
          "Use for all monthly online shopping",
          "Pay bills online instead of offline",
          "Load wallets online for offline 5% equivalent"
        ]
      },
      point_redemption: {
        best_options: [
          "Automatic cashback credit to statement",
          "No redemption required - direct cashback"
        ],
        transfer_partners: ["Not applicable - direct cashback card"],
        cash_equivalent_value: "Direct 5% cashback - no conversion needed"
      },
      common_mistakes: [
        "Using for offline purchases when better cards available",
        "Not maximizing online spend potential",
        "Using other cards for online shopping",
        "Not loading wallets online for offline use"
      ],
      pro_tips: [
        "Use exclusively for online transactions",
        "Load all wallets through this card online",
        "Pay all bills online instead of offline",
        "Use for subscription services and EMIs",
        "Perfect card for heavy online shoppers"
      ]
    }
  },
  {
    card_name: "ICICI Amazon Pay",
    issuer: "ICICI Bank",
    optimization_strategies: {
      primary_benefits: [
        "5% cashback on Amazon purchases",
        "2% cashback on bill payments",
        "1% cashback on other spends",
        "Amazon Prime benefits"
      ],
      payment_methods: {
        direct_payment: {
          recommended: true,
          scenarios: ["Amazon purchases", "Bill payments", "General spends"],
          reward_rate: "5% Amazon, 2% bills, 1% others"
        },
        wallet_loading: {
          recommended: false,
          scenarios: ["Only if Amazon Pay wallet loading gives 5%"],
          reward_rate: "Check current Amazon Pay policy",
          best_wallets: ["Amazon Pay wallet"]
        },
        app_specific: {
          recommended_apps: ["Amazon", "Amazon Pay", "ICICI iMobile"],
          benefits: [
            "5% cashback on Amazon",
            "Easy bill payments at 2%",
            "Prime membership benefits"
          ],
          tips: [
            "Use Amazon Pay for bill payments to get 2%",
            "Shop on Amazon for maximum 5% benefit",
            "Use Amazon Pay at partner merchants"
          ]
        }
      },
      spending_strategies: [
        {
          category: "Amazon Shopping",
          strategy: "Use exclusively for all Amazon purchases",
          expected_return: "5% cashback on Amazon"
        },
        {
          category: "Bill Payments",
          strategy: "Pay all bills through Amazon Pay for 2% cashback",
          expected_return: "2% on utility and other bills"
        },
        {
          category: "Other Spends",
          strategy: "Use only if no better category card available",
          expected_return: "1% on general spends"
        }
      ],
      milestone_optimization: {
        annual_targets: [
          "Maximize Amazon spends for 5% returns",
          "Use bill payment feature regularly"
        ],
        quarterly_benefits: [
          "Plan Amazon purchases around sale periods",
          "Consistent bill payments for 2% returns"
        ],
        monthly_tips: [
          "Pay all monthly bills through Amazon Pay",
          "Use for Amazon Prime subscription",
          "Shop Amazon for household essentials"
        ]
      },
      point_redemption: {
        best_options: [
          "Automatic cashback to statement",
          "Amazon Pay balance credit"
        ],
        transfer_partners: ["Not applicable - cashback card"],
        cash_equivalent_value: "Direct cashback - 5%/2%/1% as applicable"
      },
      common_mistakes: [
        "Not using for Amazon purchases",
        "Paying bills directly instead of through Amazon Pay",
        "Using for categories where other cards give better returns",
        "Not maximizing Prime membership benefits"
      ],
      pro_tips: [
        "Set up all bill payments through Amazon Pay",
        "Use for Amazon Prime and other Amazon services",
        "Combine with Amazon sale periods for maximum savings",
        "Use Amazon Pay at partner offline merchants",
        "Perfect for Amazon ecosystem users"
      ]
    }
  }
];

// Function to get optimization tips for a specific card
export function getCardOptimizationTips(cardName: string, issuer: string): CardOptimizationTips | null {
  const normalizedCardName = cardName.toLowerCase();
  const normalizedIssuer = issuer.toLowerCase();
  
  return cardOptimizationDatabase.find(card => 
    card.card_name.toLowerCase().includes(normalizedCardName) ||
    normalizedCardName.includes(card.card_name.toLowerCase()) ||
    (card.issuer.toLowerCase().includes(normalizedIssuer) && 
     normalizedCardName.includes(card.card_name.toLowerCase().split(' ')[0]))
  ) || null;
}

// Function to get general optimization advice based on card type
export function getGeneralOptimizationAdvice(cardName: string, issuer: string): string {
  const tips = getCardOptimizationTips(cardName, issuer);
  
  if (tips) {
    return `I found specific optimization strategies for your ${tips.card_name}! Here are the key points:

**Primary Benefits:**
${tips.optimization_strategies.primary_benefits.map(benefit => `• ${benefit}`).join('\n')}

**Best Payment Method:**
${tips.optimization_strategies.payment_methods.direct_payment.recommended ? 
  `✅ Direct payment recommended: ${tips.optimization_strategies.payment_methods.direct_payment.reward_rate}` :
  `⚠️ Use app/wallet method: ${tips.optimization_strategies.payment_methods.wallet_loading.reward_rate}`}

**Top 3 Pro Tips:**
${tips.optimization_strategies.pro_tips.slice(0, 3).map(tip => `💡 ${tip}`).join('\n')}

**Common Mistakes to Avoid:**
${tips.optimization_strategies.common_mistakes.slice(0, 2).map(mistake => `❌ ${mistake}`).join('\n')}

Would you like detailed strategies for any specific category or more information about point redemption options?`;
  }
  
  return `I don't have specific optimization data for your ${cardName} yet, but I can provide general credit card optimization advice. Here are some universal tips:

**General Optimization Strategies:**
• Use cards for their bonus categories (fuel, groceries, online shopping)
• Pay bills online when possible for better reward rates
• Check if your bank has a shopping portal for bonus points
• Keep credit utilization below 30% for better credit score
• Set up autopay to avoid late fees and maintain good standing

**Payment Method Tips:**
• Direct card payments usually earn full rewards
• Wallet loading may or may not earn rewards - check with your bank
• Use bank's mobile app for bill payments if they offer bonus rewards

Would you like me to help you create a spending strategy based on your card's general category or issuer?`;
}