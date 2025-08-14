export const mockSpendCategories: string[] = [
  'Dining & Restaurants',
  'Online Shopping',
  'Groceries & Supermarkets', 
  'Fuel & Petrol',
  'Utility Bills',
  'Travel & Flights',
  'Hotels & Accommodation',
  'EMI Payments',
  'Education Fees',
  'Entertainment & Movies',
  'Healthcare & Medical',
  'Insurance Premiums',
  'Mobile & DTH Recharge',
  'Rent Payments',
  'Jewellery & Gold',
  'Electronics & Appliances',
  'Fashion & Clothing',
  'Beauty & Personal Care',
  'Pharmacy & Medicine',
  'Government Payments',
  'Mutual Funds & Investments',
  'Cab & Transportation',
  'Coffee & Quick Bites',
  'Department Stores',
  'Home Improvement',
  'Subscription Services',
  'Gift Cards & Vouchers',
  'Charity & Donations',
  'Other'
];

export const getIssuerColorCode = (issuer: string) => {
  switch (issuer?.toLowerCase()) {
    case 'hdfc': return '#ED232A'; // red
    case 'sbi': return '#00B5EF'; // cyan-500
    case 'icici': return '#F99D27'; // orange-500
    case 'axis': return '#AE275F'; // purple-600
    case 'amex': return '#1E40AF'; // blue-800
    case 'idfc': return '#9C1D26'; // red-500
    default: return '#6B7280'; // gray-500
  }
};