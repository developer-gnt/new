import { useSyncExternalStore } from 'react';
import type {
  BalanceSheetReportResponse,
  BalanceSheetSummaryResponse,
  DatePresetKey,
  ProfitLossReportResponse,
  ProfitLossSummaryResponse,
  ReportsAnalyticsResponse,
  TrialBalanceReportResponse,
  TrialBalanceSummaryResponse,
} from '../types/reports.types';
import {
  getDatePresets,
  getDefaultDatePreset,
  MOCK_BALANCE_SHEET,
  MOCK_BALANCE_SHEET_SUMMARY,
  MOCK_PROFIT_LOSS,
  MOCK_PROFIT_LOSS_SUMMARY,
  MOCK_REPORTS_ANALYTICS,
  MOCK_TRIAL_BALANCE,
  MOCK_TRIAL_BALANCE_SUMMARY,
} from '../data/reportsFixtures';
import { reportsService } from '../services/reportsService';

export interface ReportsStoreState {
  selectedPreset: DatePresetKey;
  startDate: string;
  endDate: string;
  asOfDate: string;
  analytics: ReportsAnalyticsResponse;
  trialBalance: TrialBalanceReportResponse;
  trialBalanceSummary: TrialBalanceSummaryResponse;
  profitLoss: ProfitLossReportResponse;
  profitLossSummary: ProfitLossSummaryResponse;
  balanceSheet: BalanceSheetReportResponse;
  balanceSheetSummary: BalanceSheetSummaryResponse;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
}

type Listener = () => void;

class ReportsStore {
  private selectedPreset: DatePresetKey;
  private startDate: string;
  private endDate: string;
  private asOfDate: string;
  private analytics: ReportsAnalyticsResponse = MOCK_REPORTS_ANALYTICS;
  private trialBalance: TrialBalanceReportResponse = MOCK_TRIAL_BALANCE;
  private trialBalanceSummary: TrialBalanceSummaryResponse = MOCK_TRIAL_BALANCE_SUMMARY;
  private profitLoss: ProfitLossReportResponse = MOCK_PROFIT_LOSS;
  private profitLossSummary: ProfitLossSummaryResponse = MOCK_PROFIT_LOSS_SUMMARY;
  private balanceSheet: BalanceSheetReportResponse = MOCK_BALANCE_SHEET;
  private balanceSheetSummary: BalanceSheetSummaryResponse = MOCK_BALANCE_SHEET_SUMMARY;
  private isLoading = false;
  private isRefreshing = false;
  private error: string | null = null;
  private listeners = new Set<Listener>();
  private cachedSnapshot: ReportsStoreState;

  constructor() {
    const defaultPreset = getDefaultDatePreset();
    this.selectedPreset = defaultPreset.key;
    this.startDate = defaultPreset.startDate;
    this.endDate = defaultPreset.endDate;
    this.asOfDate = defaultPreset.asOfDate;

    this.cachedSnapshot = {
      selectedPreset: this.selectedPreset,
      startDate: this.startDate,
      endDate: this.endDate,
      asOfDate: this.asOfDate,
      analytics: this.analytics,
      trialBalance: this.trialBalance,
      trialBalanceSummary: this.trialBalanceSummary,
      profitLoss: this.profitLoss,
      profitLossSummary: this.profitLossSummary,
      balanceSheet: this.balanceSheet,
      balanceSheetSummary: this.balanceSheetSummary,
      isLoading: this.isLoading,
      isRefreshing: this.isRefreshing,
      error: this.error,
    };
  }

  private emit(): void {
    this.cachedSnapshot = {
      selectedPreset: this.selectedPreset,
      startDate: this.startDate,
      endDate: this.endDate,
      asOfDate: this.asOfDate,
      analytics: this.analytics,
      trialBalance: this.trialBalance,
      trialBalanceSummary: this.trialBalanceSummary,
      profitLoss: this.profitLoss,
      profitLossSummary: this.profitLossSummary,
      balanceSheet: this.balanceSheet,
      balanceSheetSummary: this.balanceSheetSummary,
      isLoading: this.isLoading,
      isRefreshing: this.isRefreshing,
      error: this.error,
    };
    for (const listener of this.listeners) {
      listener();
    }
  }

  public subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  public getSnapshot = (): ReportsStoreState => {
    return this.cachedSnapshot;
  };

  public setPreset(
    presetKey: DatePresetKey,
    customRange?: { startDate: string; endDate: string; asOfDate?: string }
  ): void {
    this.selectedPreset = presetKey;
    if (presetKey === 'CUSTOM' && customRange) {
      this.startDate = customRange.startDate;
      this.endDate = customRange.endDate;
      this.asOfDate = customRange.asOfDate || customRange.endDate;
    } else {
      const presets = getDatePresets();
      const match = presets.find(p => p.key === presetKey);
      if (match) {
        this.startDate = match.startDate;
        this.endDate = match.endDate;
        this.asOfDate = match.asOfDate;
      }
    }
    this.emit();
    // Auto-fetch data for the new period
    this.refreshAll();
  }

  public setCustomDateRange(startDate: string, endDate: string): void {
    this.selectedPreset = 'CUSTOM';
    this.startDate = startDate;
    this.endDate = endDate;
    this.asOfDate = endDate;
    this.emit();
    this.refreshAll();
  }

  public setAsOfDate(asOfDate: string): void {
    this.asOfDate = asOfDate;
    this.emit();
    this.fetchTrialBalance();
    this.fetchBalanceSheet();
  }

  public async fetchAnalytics(): Promise<void> {
    try {
      const res = await reportsService.getAnalytics({
        start_date: this.startDate,
        end_date: this.endDate,
      });
      this.analytics = res;
      this.error = null;
    } catch (err: any) {
      this.error = err.message || 'Failed to fetch analytics';
    } finally {
      this.emit();
    }
  }

  public async fetchTrialBalance(includeZeroBalances = false, accountType = 'ALL'): Promise<void> {
    try {
      const [tb, summary] = await Promise.all([
        reportsService.getTrialBalance({
          as_of_date: this.asOfDate,
          include_zero_balances: includeZeroBalances,
          account_type: accountType !== 'ALL' ? accountType : undefined,
        }),
        reportsService.getTrialBalanceSummary({ as_of_date: this.asOfDate }),
      ]);
      this.trialBalance = tb;
      this.trialBalanceSummary = summary;
      this.error = null;
    } catch (err: any) {
      this.error = err.message || 'Failed to fetch trial balance';
    } finally {
      this.emit();
    }
  }

  public async fetchProfitLoss(includeZeroBalances = false): Promise<void> {
    try {
      const [pl, summary] = await Promise.all([
        reportsService.getProfitLoss({
          from_date: this.startDate,
          to_date: this.endDate,
          include_zero_balances: includeZeroBalances,
        }),
        reportsService.getProfitLossSummary({
          from_date: this.startDate,
          to_date: this.endDate,
        }),
      ]);
      this.profitLoss = pl;
      this.profitLossSummary = summary;
      this.error = null;
    } catch (err: any) {
      this.error = err.message || 'Failed to fetch profit and loss';
    } finally {
      this.emit();
    }
  }

  public async fetchBalanceSheet(): Promise<void> {
    try {
      const [bs, summary] = await Promise.all([
        reportsService.getBalanceSheet({ as_of_date: this.asOfDate }),
        reportsService.getBalanceSheetSummary({ as_of_date: this.asOfDate }),
      ]);
      this.balanceSheet = bs;
      this.balanceSheetSummary = summary;
      this.error = null;
    } catch (err: any) {
      this.error = err.message || 'Failed to fetch balance sheet';
    } finally {
      this.emit();
    }
  }

  public async refreshAll(): Promise<void> {
    this.isRefreshing = true;
    this.emit();
    try {
      await Promise.all([
        this.fetchAnalytics(),
        this.fetchTrialBalance(),
        this.fetchProfitLoss(),
        this.fetchBalanceSheet(),
      ]);
    } finally {
      this.isRefreshing = false;
      this.emit();
    }
  }
}

export const reportsStore = new ReportsStore();

export function useReportsStore(): ReportsStoreState {
  return useSyncExternalStore(reportsStore.subscribe, reportsStore.getSnapshot);
}
