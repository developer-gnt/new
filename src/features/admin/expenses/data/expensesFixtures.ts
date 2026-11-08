import type {
  ExpenseEntryItem,
  OfficialExpenseType,
} from '../types/expenses.types';

export const OFFICIAL_EXPENSE_TYPES: OfficialExpenseType[] = [
  {
    code: '5001',
    name: 'Employee & Staff Expenses',
    description: 'Salaries, wages, staff allowances, bonuses, medical benefits and employee welfare.',
  },
  {
    code: '5002',
    name: 'Office & Administration',
    description: 'Office stationery, printing, courier, utilities, pantry, cleaning and general admin expenses.',
  },
  {
    code: '5003',
    name: 'Program / Project Expenses',
    description: 'Field campaigns, human rights workshops, awareness drives, survey & research projects.',
  },
  {
    code: '5004',
    name: 'Travel & Transportation',
    description: 'Conveyance, fuel, bus/train/flight tickets, local transit, lodging and travel allowances.',
  },
  {
    code: '5005',
    name: 'Communication & Awareness',
    description: 'Pamphlets, brochures, banners, social media marketing, advertising, press releases and public relations.',
  },
  {
    code: '5006',
    name: 'Events & Activities',
    description: 'Venue booking, stage setup, audio/visual equipment, catering, guest honorariums and certificates.',
  },
  {
    code: '5007',
    name: 'IT & Technology',
    description: 'Software licenses, domain/hosting, cloud servers, mobile app/portal maintenance, IT support.',
  },
  {
    code: '5008',
    name: 'Assets & Equipment',
    description: 'Office furniture, computers, cameras, printers, projectors and electronic apparatus purchases/maintenance.',
  },
  {
    code: '5009',
    name: 'Beneficiary Assistance',
    description: 'Direct humanitarian aid, medical relief funds, legal aid subsidies, emergency distress grants.',
  },
  {
    code: '5010',
    name: 'Compliance & Governance',
    description: 'Auditor fees, legal consultancy, ROC filings, 80G/12A renewals, society registration & compliance fees.',
  },
  {
    code: '5011',
    name: 'Fundraising Expenses',
    description: 'Donation collection drives, fundraising campaigns, donor engagement material, crowdfunding charges.',
  },
  {
    code: '5012',
    name: 'Volunteer Expenses',
    description: 'Volunteer stipends, refreshment, volunteer badges/t-shirts, training kits and appreciation awards.',
  },
  {
    code: '5013',
    name: 'Premises Expenses',
    description: 'Office rent, society maintenance charges, electricity, water bills, property repair and lease costs.',
  },
  {
    code: '5014',
    name: 'Financial Expenses',
    description: 'Bank transaction charges, payment gateway processing fees, cheque bounce fees, interest/charges.',
  },
  {
    code: '5015',
    name: 'Miscellaneous',
    description: 'Sundry and ad-hoc minor expenses not covered under other defined heads.',
  },
];

export const ASSET_PAYMENT_ACCOUNTS = [
  { id: 'acc-bank-01', account_code: '1001', account_name: 'State Bank of India — Current A/c (Ending 4092)' },
  { id: 'acc-bank-02', account_code: '1002', account_name: 'HDFC Bank — Operational A/c (Ending 1184)' },
  { id: 'acc-cash-01', account_code: '1010', account_name: 'Central Cash Drawer (Petty Cash)' },
  { id: 'acc-upi-01', account_code: '1020', account_name: 'HRSJM Digital UPI Merchant (sbi.hrsjm@upi)' },
];

export const INITIAL_EXPENSE_FIXTURES: ExpenseEntryItem[] = [];
