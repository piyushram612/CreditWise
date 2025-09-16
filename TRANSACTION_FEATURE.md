# Transaction Confirmation Feature

## Overview
This feature adds transaction confirmation prompts to the credit card management system. Users receive notifications asking "Have you made this transaction?" and can confirm or deny transactions, which automatically updates their card's used amount and available credit.

## Components Added

### 1. TransactionConfirmModal
- **Location**: `app/components/cards/TransactionConfirmModal.tsx`
- **Purpose**: Modal dialog for confirming/denying transactions
- **Features**:
  - Shows transaction details (amount, merchant, card)
  - Displays current vs. new utilization
  - Updates card's used amount when confirmed
  - Prevents transactions that exceed credit limit
  - Records transactions (if transactions table exists)

### 2. TransactionPrompt
- **Location**: `app/components/cards/TransactionPrompt.tsx`
- **Purpose**: Floating notification that appears automatically
- **Features**:
  - Generates random transaction prompts every 30-60 seconds
  - Shows transaction amount and suggested card
  - Dismissible notification
  - Opens confirmation modal when clicked

### 3. TransactionTestButton
- **Location**: `app/components/cards/TransactionTestButton.tsx`
- **Purpose**: Manual testing button for developers
- **Features**:
  - Fixed position button (bottom-right)
  - Generates random transactions on demand
  - Only visible when user has cards

### 4. Transaction Generator Utility
- **Location**: `app/utils/transactionGenerator.ts`
- **Purpose**: Generates realistic transaction scenarios
- **Features**:
  - 30+ predefined merchants with realistic amount ranges
  - Categories include food, shopping, travel, utilities, etc.
  - Smart card selection based on available credit
  - Transaction insights and utilization warnings

## How It Works

1. **Automatic Prompts**: When a user has cards, random transaction prompts appear every 30-60 seconds
2. **Transaction Generation**: System selects random merchant and amount from predefined realistic ranges
3. **Card Selection**: Automatically suggests the best card based on available credit
4. **User Confirmation**: User sees a notification and can click to review the transaction
5. **Confirmation Modal**: Shows detailed transaction info and impact on credit utilization
6. **Credit Update**: If confirmed, the card's used amount is updated in the database
7. **Validation**: Prevents transactions that would exceed the credit limit

## Database Changes

### Optional Transactions Table
```sql
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id),
  card_id UUID REFERENCES user_owned_cards(id),
  amount DECIMAL(10,2) NOT NULL,
  merchant_name TEXT NOT NULL,
  transaction_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('confirmed', 'pending', 'declined')),
  category TEXT
);
```

## Integration

The feature is integrated into:
- **MyCardsView**: Shows transaction prompts and test button
- **ClientApp**: Handles transaction processing callbacks
- **Database Types**: Updated to include transaction schema

## Testing

1. **Manual Testing**: Use the blue bell icon button (bottom-right) to trigger test transactions
2. **Automatic Testing**: Wait for automatic prompts (10 seconds initial, then every 30-60 seconds)
3. **Edge Cases**: Test with cards at different utilization levels and credit limits

## Configuration

### Merchant Data
Edit `app/utils/transactionGenerator.ts` to:
- Add new merchants
- Modify transaction amount ranges
- Update categories
- Adjust prompt frequency

### Prompt Timing
In `TransactionPrompt.tsx`:
- Initial delay: 10 seconds (line 35)
- Interval: 30 seconds (line 38)
- Probability: 30% per interval (line 39)

## Features

### Smart Notifications
- Only appears when user has cards
- Suggests best card based on available credit
- Shows transaction category and amount

### Credit Management
- Real-time utilization calculation
- Credit limit validation
- Visual utilization warnings (red >80%, yellow >60%, green ≤60%)

### User Experience
- Non-intrusive floating notifications
- Easy dismiss option
- Clear transaction details
- Immediate feedback on credit impact

## Future Enhancements

1. **Merchant-Specific Rewards**: Integration with card knowledge base for optimal card suggestions
2. **Transaction History**: Full transaction logging and history view
3. **Spending Analytics**: Monthly/weekly spending patterns
4. **Budget Alerts**: Warnings when approaching spending limits
5. **Fraud Detection**: Unusual transaction pattern detection
6. **Mobile Notifications**: Push notifications for native apps