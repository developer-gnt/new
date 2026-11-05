import type {
  BalanceSheetReportResponse,
  BalanceSheetSummaryResponse,
  DateRangePreset,
  ProfitLossReportResponse,
  ProfitLossSummaryResponse,
  ReportsAnalyticsResponse,
  TrialBalanceReportResponse,
  TrialBalanceSummaryResponse,
} from '../types/reports.types';

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
export const formatDateStr = (d: Date): string =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const getDatePresets = (): DateRangePreset[] => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed

  // 1. THIS MONTH
  const thisMonthStart = new Date(year, month, 1);
  const thisMonthEnd = new Date(year, month + 1, 0);

  // 2. LAST MONTH
  const lastMonthStart = new Date(year, month - 1, 1);
  const lastMonthEnd = new Date(year, month, 0);

  // 3. THIS QUARTER (Indian Q1: Apr-Jun, Q2: Jul-Sep, Q3: Oct-Dec, Q4: Jan-Mar)
  let qStartMonth = 0;
  if (month >= 3 && month <= 5) qStartMonth = 3;
  else if (month >= 6 && month <= 8) qStartMonth = 6;
  else if (month >= 9 && month <= 11) qStartMonth = 9;
  else qStartMonth = 0;
  const thisQuarterStart = new Date(year, qStartMonth, 1);
  const thisQuarterEnd = new Date(year, qStartMonth + 3, 0);

  // 4. THIS FINANCIAL YEAR (Apr 1 - Mar 31)
  const isAfterApr = month >= 3;
  const fyStartYear = isAfterApr ? year : year - 1;
  const fyEndYear = fyStartYear + 1;
  const thisFyStart = new Date(fyStartYear, 3, 1);
  const thisFyEnd = new Date(fyEndYear, 2, 31);

  // 5. LAST FINANCIAL YEAR
  const lastFyStart = new Date(fyStartYear - 1, 3, 1);
  const lastFyEnd = new Date(fyStartYear, 2, 31);

  return [
    {
      key: 'THIS_MONTH',
      label: 'This Month',
      startDate: formatDateStr(thisMonthStart),
      endDate: formatDateStr(thisMonthEnd),
      asOfDate: formatDateStr(thisMonthEnd),
    },
    {
      key: 'LAST_MONTH',
      label: 'Last Month',
      startDate: formatDateStr(lastMonthStart),
      endDate: formatDateStr(lastMonthEnd),
      asOfDate: formatDateStr(lastMonthEnd),
    },
    {
      key: 'THIS_QUARTER',
      label: 'This Quarter',
      startDate: formatDateStr(thisQuarterStart),
      endDate: formatDateStr(thisQuarterEnd),
      asOfDate: formatDateStr(thisQuarterEnd),
    },
    {
      key: 'THIS_FY',
      label: `FY ${fyStartYear}-${fyEndYear.toString().slice(2)}`,
      startDate: formatDateStr(thisFyStart),
      endDate: formatDateStr(thisFyEnd),
      asOfDate: formatDateStr(thisFyEnd),
    },
    {
      key: 'LAST_FY',
      label: `FY ${fyStartYear - 1}-${fyStartYear.toString().slice(2)}`,
      startDate: formatDateStr(lastFyStart),
      endDate: formatDateStr(lastFyEnd),
      asOfDate: formatDateStr(lastFyEnd),
    },
  ];
};

export const getDefaultDatePreset = (): DateRangePreset => {
  return getDatePresets()[0];
};

// ==========================================
// MOCK PLATFORM ANALYTICS RESPONSE
// ==========================================
export const MOCK_REPORTS_ANALYTICS: ReportsAnalyticsResponse = {
  kpis: {
    total_users: 12480,
    users_growth_pct: 14.8,
    total_donations_amount: 368300,
    donations_growth_pct: 22.4,
    total_donations_count: 342,
    total_complaints: 184,
    complaints_growth_pct: -6.5,
    total_events: 18,
    events_growth_pct: 12.5,
  },
  user_growth: [
    { label: 'May', count: 9100, date: '2026-05-01' },
    { label: 'Jun', count: 9650, date: '2026-06-01' },
    { label: 'Jul', count: 10240, date: '2026-07-01' },
    { label: 'Aug', count: 10980, date: '2026-08-01' },
    { label: 'Sep', count: 11620, date: '2026-09-01' },
    { label: 'Oct', count: 12480, date: '2026-10-01' },
  ],
  user_distribution: [
    { label: 'Life Members', count: 4850, pct: '38.8%', color: '#011F39' },
    { label: 'Annual Members', count: 3920, pct: '31.4%', color: '#2563EB' },
    { label: 'Student / Youth', count: 2150, pct: '17.2%', color: '#10B981' },
    { label: 'Volunteers / Donors', count: 1560, pct: '12.6%', color: '#FAD465' },
  ],
  donations_overview: {
    total_amount: 368300,
    growth_pct: 22.4,
    total_donations: 342,
    donations_count_growth_pct: 18.2,
    timeline: [
      { label: 'May', amount: 48000, count: 46 },
      { label: 'Jun', amount: 54500, count: 52 },
      { label: 'Jul', amount: 62000, count: 58 },
      { label: 'Aug', amount: 59000, count: 54 },
      { label: 'Sep', amount: 69800, count: 64 },
      { label: 'Oct', amount: 75000, count: 68 },
    ],
  },
  complaints_overview: {
    total: 184,
    resolved: 142,
    in_progress: 28,
    pending: 14,
    growth_pct: -6.5,
    resolved_pct: 77.2,
    in_progress_pct: 15.2,
    pending_pct: 7.6,
    timeline: [
      { label: 'May', received: 34, resolved: 28, pending: 6 },
      { label: 'Jun', received: 29, resolved: 26, pending: 3 },
      { label: 'Jul', received: 38, resolved: 32, pending: 6 },
      { label: 'Aug', received: 31, resolved: 29, pending: 2 },
      { label: 'Sep', received: 26, resolved: 24, pending: 2 },
      { label: 'Oct', received: 26, resolved: 23, pending: 3 },
    ],
  },
  top_content: {
    rights: [
      { rank: 1, title: 'Right to Free Legal Aid in Custody (Article 39A)', views: '14.2K' },
      { rank: 2, title: 'Women Safety at Workplace — POSH Guidelines', views: '11.8K' },
      { rank: 3, title: 'Citizens Charter & Police Encounter Guidelines (NHRC)', views: '9.4K' },
      { rank: 4, title: 'Right to Information Act: Step-by-Step Filing Guide', views: '8.1K' },
    ],
    blogs: [
      { rank: 1, title: 'Rehabilitation of Child Labor in Unorganized Sectors', views: '8.9K' },
      { rank: 2, title: 'Combating Human Trafficking: Legal Recourse and Field Aid', views: '7.3K' },
      { rank: 3, title: 'Environmental Justice & Fundamental Rights in India', views: '6.1K' },
      { rank: 4, title: 'Mental Health Rights for Under-Trial Prisoners', views: '5.2K' },
    ],
    news: [
      { rank: 1, title: 'National Conclave on Human Rights 2026 Announced at Vigyan Bhawan', views: '19.5K' },
      { rank: 2, title: 'HRSJM Legal Cell Secures Compensation for 12 Custodial Abuse Victims', views: '16.2K' },
      { rank: 3, title: 'Press Release: Universal Human Rights Day Resolution Passed', views: '13.7K' },
      { rank: 4, title: 'New State Chapter Inauguration in Bhopal, MP', views: '9.8K' },
    ],
  },
  events_overview: {
    total_events: 18,
    events_growth_pct: 12.5,
    total_registrations: 3840,
    registrations_growth_pct: 19.3,
    avg_attendance_pct: 88.4,
    timeline: [
      { label: 'May', events: 2, registrations: 480, attendance: 420 },
      { label: 'Jun', events: 3, registrations: 620, attendance: 560 },
      { label: 'Jul', events: 3, registrations: 590, attendance: 510 },
      { label: 'Aug', events: 4, registrations: 850, attendance: 760 },
      { label: 'Sep', events: 3, registrations: 610, attendance: 540 },
      { label: 'Oct', events: 3, registrations: 690, attendance: 620 },
    ],
  },
};

// ==========================================
// MOCK TRIAL BALANCE REPORT
// ==========================================
export const MOCK_TRIAL_BALANCE: TrialBalanceReportResponse = {
  as_of_date: '2026-10-31',
  accounts: [
    // 1. Assets (Debit normal balance)
    {
      account: {
        id: 'acc-1',
        account_code: 'ACC-1001',
        account_name: 'Main Operating Account (HDFC Bank)',
        account_type: 'ASSET',
      },
      gross_debit: 485000,
      gross_credit: 165000,
      debit_balance: 320000,
      credit_balance: 0,
    },
    {
      account: {
        id: 'acc-2',
        account_code: 'ACC-1002',
        account_name: 'Donation Collection Account (SBI)',
        account_type: 'ASSET',
      },
      gross_debit: 215000,
      gross_credit: 75000,
      debit_balance: 140000,
      credit_balance: 0,
    },
    {
      account: {
        id: 'acc-3',
        account_code: 'ACC-1003',
        account_name: 'Petty Cash Fund',
        account_type: 'ASSET',
      },
      gross_debit: 35000,
      gross_credit: 21500,
      debit_balance: 13500,
      credit_balance: 0,
    },
    {
      account: {
        id: 'acc-4',
        account_code: 'ACC-1004',
        account_name: 'Office Computer & IT Assets',
        account_type: 'ASSET',
      },
      gross_debit: 45000,
      gross_credit: 0,
      debit_balance: 45000,
      credit_balance: 0,
    },
    {
      account: {
        id: 'acc-5',
        account_code: 'ACC-1005',
        account_name: 'Security Deposit - Office Premises',
        account_type: 'ASSET',
      },
      gross_debit: 30000,
      gross_credit: 0,
      debit_balance: 30000,
      credit_balance: 0,
    },

    // 2. Liabilities (Credit normal balance)
    {
      account: {
        id: 'acc-6',
        account_code: 'ACC-2001',
        account_name: 'Sundry Creditors & Vendors',
        account_type: 'LIABILITY',
      },
      gross_debit: 22000,
      gross_credit: 31000,
      debit_balance: 0,
      credit_balance: 9000,
    },
    {
      account: {
        id: 'acc-7',
        account_code: 'ACC-2002',
        account_name: 'Audit & Legal Fees Payable',
        account_type: 'LIABILITY',
      },
      gross_debit: 0,
      gross_credit: 5000,
      debit_balance: 0,
      credit_balance: 5000,
    },
    {
      account: {
        id: 'acc-8',
        account_code: 'ACC-2003',
        account_name: 'TDS Payable (Section 194C/J)',
        account_type: 'LIABILITY',
      },
      gross_debit: 6500,
      gross_credit: 9000,
      debit_balance: 0,
      credit_balance: 2500,
    },
    {
      account: {
        id: 'acc-9',
        account_code: 'ACC-2004',
        account_name: 'Outstanding Staff Reimbursements',
        account_type: 'LIABILITY',
      },
      gross_debit: 14000,
      gross_credit: 16000,
      debit_balance: 0,
      credit_balance: 2000,
    },

    // 3. Equity / Capital Funds (Credit normal balance)
    {
      account: {
        id: 'acc-10',
        account_code: 'ACC-3001',
        account_name: 'Corpus Fund (Permanent Endowment)',
        account_type: 'FUND_EQUITY',
      },
      gross_debit: 0,
      gross_credit: 400000,
      debit_balance: 0,
      credit_balance: 400000,
    },
    {
      account: {
        id: 'acc-11',
        account_code: 'ACC-3002',
        account_name: 'General Reserve & Retained Surplus',
        account_type: 'FUND_EQUITY',
      },
      gross_debit: 0,
      gross_credit: 31700,
      debit_balance: 0,
      credit_balance: 31700,
    },

    // 4. Income (Credit normal balance)
    {
      account: {
        id: 'acc-12',
        account_code: 'ACC-4001',
        account_name: 'Public Donations & Contributions',
        account_type: 'INCOME',
      },
      gross_debit: 0,
      gross_credit: 215000,
      debit_balance: 0,
      credit_balance: 215000,
    },
    {
      account: {
        id: 'acc-13',
        account_code: 'ACC-4002',
        account_name: 'Membership Subscription Fees',
        account_type: 'INCOME',
      },
      gross_debit: 0,
      gross_credit: 88300,
      debit_balance: 0,
      credit_balance: 88300,
    },
    {
      account: {
        id: 'acc-14',
        account_code: 'ACC-4003',
        account_name: 'Institutional Grants & CSR Aid',
        account_type: 'INCOME',
      },
      gross_debit: 0,
      gross_credit: 45000,
      debit_balance: 0,
      credit_balance: 45000,
    },
    {
      account: {
        id: 'acc-15',
        account_code: 'ACC-4004',
        account_name: 'Human Rights Conclave Registration Fees',
        account_type: 'INCOME',
      },
      gross_debit: 0,
      gross_credit: 20000,
      debit_balance: 0,
      credit_balance: 20000,
    },

    // 5. Expenses (Debit normal balance)
    {
      account: {
        id: 'acc-16',
        account_code: 'ACC-5001',
        account_name: 'Direct Humanitarian & Legal Aid',
        account_type: 'EXPENSE',
      },
      gross_debit: 125000,
      gross_credit: 0,
      debit_balance: 125000,
      credit_balance: 0,
    },
    {
      account: {
        id: 'acc-17',
        account_code: 'ACC-5002',
        account_name: 'Staff Salaries & Honorariums',
        account_type: 'EXPENSE',
      },
      gross_debit: 82000,
      gross_credit: 0,
      debit_balance: 82000,
      credit_balance: 0,
    },
    {
      account: {
        id: 'acc-18',
        account_code: 'ACC-5003',
        account_name: 'Office Rent & Electricity',
        account_type: 'EXPENSE',
      },
      gross_debit: 38000,
      gross_credit: 0,
      debit_balance: 38000,
      credit_balance: 0,
    },
    {
      account: {
        id: 'acc-19',
        account_code: 'ACC-5004',
        account_name: 'IT, Cloud & Website Hosting',
        account_type: 'EXPENSE',
      },
      gross_debit: 15000,
      gross_credit: 0,
      debit_balance: 15000,
      credit_balance: 0,
    },
    {
      account: {
        id: 'acc-20',
        account_code: 'ACC-5005',
        account_name: 'Statutory Audit & Compliance Fees',
        account_type: 'EXPENSE',
      },
      gross_debit: 10000,
      gross_credit: 0,
      debit_balance: 10000,
      credit_balance: 0,
    },
  ],
  total_debit: 818500,
  total_credit: 818500,
  total_gross_debit: 1072500,
  total_gross_credit: 1072500,
  difference: 0,
  is_balanced: true,
};

export const MOCK_TRIAL_BALANCE_SUMMARY: TrialBalanceSummaryResponse = {
  as_of_date: '2026-10-31',
  total_debit: 818500,
  total_credit: 818500,
  difference: 0,
  is_balanced: true,
  total_accounts: 19,
  by_account_type: {
    ASSET: {
      account_type: 'ASSET',
      total_debit: 548500,
      total_credit: 0,
      net_balance: 548500,
      account_count: 5,
    },
    LIABILITY: {
      account_type: 'LIABILITY',
      total_debit: 0,
      total_credit: 18500,
      net_balance: -18500,
      account_count: 4,
    },
    FUND_EQUITY: {
      account_type: 'FUND_EQUITY',
      total_debit: 0,
      total_credit: 431700,
      net_balance: -431700,
      account_count: 2,
    },
    INCOME: {
      account_type: 'INCOME',
      total_debit: 0,
      total_credit: 368300,
      net_balance: -368300,
      account_count: 4,
    },
    EXPENSE: {
      account_type: 'EXPENSE',
      total_debit: 270000,
      total_credit: 0,
      net_balance: 270000,
      account_count: 5,
    },
  },
};

// ==========================================
// MOCK PROFIT & LOSS REPORT
// ==========================================
export const MOCK_PROFIT_LOSS: ProfitLossReportResponse = {
  from_date: '2026-04-01',
  to_date: '2026-10-31',
  income: {
    total: 368300,
    items: [
      {
        account: {
          id: 'acc-12',
          account_code: 'ACC-4001',
          account_name: 'Public Donations & Contributions',
          account_type: 'INCOME',
        },
        gross_debit: 0,
        gross_credit: 215000,
        amount: 215000,
      },
      {
        account: {
          id: 'acc-13',
          account_code: 'ACC-4002',
          account_name: 'Membership Subscription Fees',
          account_type: 'INCOME',
        },
        gross_debit: 0,
        gross_credit: 88300,
        amount: 88300,
      },
      {
        account: {
          id: 'acc-14',
          account_code: 'ACC-4003',
          account_name: 'Institutional Grants & CSR Aid',
          account_type: 'INCOME',
        },
        gross_debit: 0,
        gross_credit: 45000,
        amount: 45000,
      },
      {
        account: {
          id: 'acc-15',
          account_code: 'ACC-4004',
          account_name: 'Human Rights Conclave Registration Fees',
          account_type: 'INCOME',
        },
        gross_debit: 0,
        gross_credit: 20000,
        amount: 20000,
      },
    ],
  },
  expenses: {
    total: 270000,
    items: [
      {
        account: {
          id: 'acc-16',
          account_code: 'ACC-5001',
          account_name: 'Direct Humanitarian & Legal Aid',
          account_type: 'EXPENSE',
        },
        gross_debit: 125000,
        gross_credit: 0,
        amount: 125000,
      },
      {
        account: {
          id: 'acc-17',
          account_code: 'ACC-5002',
          account_name: 'Staff Salaries & Honorariums',
          account_type: 'EXPENSE',
        },
        gross_debit: 82000,
        gross_credit: 0,
        amount: 82000,
      },
      {
        account: {
          id: 'acc-18',
          account_code: 'ACC-5003',
          account_name: 'Office Rent & Electricity',
          account_type: 'EXPENSE',
        },
        gross_debit: 38000,
        gross_credit: 0,
        amount: 38000,
      },
      {
        account: {
          id: 'acc-19',
          account_code: 'ACC-5004',
          account_name: 'IT, Cloud & Website Hosting',
          account_type: 'EXPENSE',
        },
        gross_debit: 15000,
        gross_credit: 0,
        amount: 15000,
      },
      {
        account: {
          id: 'acc-20',
          account_code: 'ACC-5005',
          account_name: 'Statutory Audit & Compliance Fees',
          account_type: 'EXPENSE',
        },
        gross_debit: 10000,
        gross_credit: 0,
        amount: 10000,
      },
    ],
  },
  total_income: 368300,
  total_expenses: 270000,
  net_result: 98300,
  net_profit_loss: 98300,
  result_type: 'SURPLUS',
};

export const MOCK_PROFIT_LOSS_SUMMARY: ProfitLossSummaryResponse = {
  from_date: '2026-04-01',
  to_date: '2026-10-31',
  total_income: 368300,
  total_expenses: 270000,
  net_result: 98300,
  net_profit_loss: 98300,
  result_type: 'SURPLUS',
  income_accounts_count: 4,
  expense_accounts_count: 5,
};

// ==========================================
// MOCK BALANCE SHEET REPORT
// ==========================================
export const MOCK_BALANCE_SHEET: BalanceSheetReportResponse = {
  as_of_date: '2026-10-31',
  assets: {
    total: 548500,
    items: [
      {
        account: {
          id: 'acc-1',
          account_code: 'ACC-1001',
          account_name: 'Main Operating Account (HDFC Bank)',
          account_type: 'ASSET',
        },
        gross_debit: 485000,
        gross_credit: 165000,
        amount: 320000,
      },
      {
        account: {
          id: 'acc-2',
          account_code: 'ACC-1002',
          account_name: 'Donation Collection Account (SBI)',
          account_type: 'ASSET',
        },
        gross_debit: 215000,
        gross_credit: 75000,
        amount: 140000,
      },
      {
        account: {
          id: 'acc-3',
          account_code: 'ACC-1003',
          account_name: 'Petty Cash Fund',
          account_type: 'ASSET',
        },
        gross_debit: 35000,
        gross_credit: 21500,
        amount: 13500,
      },
      {
        account: {
          id: 'acc-4',
          account_code: 'ACC-1004',
          account_name: 'Office Computer & IT Assets',
          account_type: 'ASSET',
        },
        gross_debit: 45000,
        gross_credit: 0,
        amount: 45000,
      },
      {
        account: {
          id: 'acc-5',
          account_code: 'ACC-1005',
          account_name: 'Security Deposit - Office Premises',
          account_type: 'ASSET',
        },
        gross_debit: 30000,
        gross_credit: 0,
        amount: 30000,
      },
    ],
  },
  liabilities: {
    total: 18500,
    items: [
      {
        account: {
          id: 'acc-6',
          account_code: 'ACC-2001',
          account_name: 'Sundry Creditors & Vendors',
          account_type: 'LIABILITY',
        },
        gross_debit: 22000,
        gross_credit: 31000,
        amount: 9000,
      },
      {
        account: {
          id: 'acc-7',
          account_code: 'ACC-2002',
          account_name: 'Audit & Legal Fees Payable',
          account_type: 'LIABILITY',
        },
        gross_debit: 0,
        gross_credit: 5000,
        amount: 5000,
      },
      {
        account: {
          id: 'acc-8',
          account_code: 'ACC-2003',
          account_name: 'TDS Payable (Section 194C/J)',
          account_type: 'LIABILITY',
        },
        gross_debit: 6500,
        gross_credit: 9000,
        amount: 2500,
      },
      {
        account: {
          id: 'acc-9',
          account_code: 'ACC-2004',
          account_name: 'Outstanding Staff Reimbursements',
          account_type: 'LIABILITY',
        },
        gross_debit: 14000,
        gross_credit: 16000,
        amount: 2000,
      },
    ],
  },
  equity: {
    total: 530000,
    total_equity_accounts: 431700,
    current_surplus_deficit: 98300,
    items: [
      {
        account: {
          id: 'acc-10',
          account_code: 'ACC-3001',
          account_name: 'Corpus Fund (Permanent Endowment)',
          account_type: 'FUND_EQUITY',
        },
        gross_debit: 0,
        gross_credit: 400000,
        amount: 400000,
      },
      {
        account: {
          id: 'acc-11',
          account_code: 'ACC-3002',
          account_name: 'General Reserve & Retained Surplus',
          account_type: 'FUND_EQUITY',
        },
        gross_debit: 0,
        gross_credit: 31700,
        amount: 31700,
      },
    ],
  },
  total_assets: 548500,
  total_liabilities: 18500,
  total_equity: 530000,
  total_liabilities_and_equity: 548500,
  difference: 0,
  is_balanced: true,
};

export const MOCK_BALANCE_SHEET_SUMMARY: BalanceSheetSummaryResponse = {
  as_of_date: '2026-10-31',
  total_assets: 548500,
  total_liabilities: 18500,
  total_equity: 530000,
  current_surplus_deficit: 98300,
  total_liabilities_and_equity: 548500,
  difference: 0,
  is_balanced: true,
  asset_accounts_count: 5,
  liability_accounts_count: 4,
  equity_accounts_count: 2,
};
