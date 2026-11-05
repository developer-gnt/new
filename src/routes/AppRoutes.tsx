import type React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { MemberLayout } from '@/components/layout/MemberLayout';
import { NotFoundPage } from '@/pages/NotFoundPage';

// Admin Portal Feature Exports
import {
  AdminDashboardPage,
  UsersListPage,
  AllUsersDirectoryPage,
  UserDetailsPage,
  AddUserPage,
  EditUserPage,
  UserVerificationPage,
  ApplicationsListPage,
  ApplicationDetailsPage,
  MembersListPage,
  MemberDetailsPage,
  AddMemberPage,
  EditMemberPage,
  AssistanceListPage,
  AssistanceDetailsPage,
  CreateSeekerPage,
  SupportTicketsListPage,
  SupportTicketDetailsPage,
  SupportTicketChatPage,
  EventsListPage,
  EventDetailsPage,
  NewsListPage,
  NewsDetailsPage,
  CreateNewsPage,
  EditNewsPage,
  BlogsListPage,
  BlogDetailsPage,
  CreateBlogPage,
  EditBlogPage,
  KnowYourRightsPage,
  RightDetailsPage,
  CreateRightPage,
  EditRightPage,
  ExpensesListPage,
  ExpenseDetailsPage,
  CreateExpensePage,
  ReceiptsListPage,
  ReceiptDetailsPage,
  CreateReceiptPage,
  AccountingDashboardPage,
  AccountLedgerPage,
  JournalEntryDetailsPage,
  ReportsOverviewPage,
  TrialBalancePage,
  ProfitLossPage,
  BalanceSheetPage,
  DonationsListPage,
  DonationDetailsPage,
  DonationReceiptPage,
  ProfilePage,
  MyIdCardPage,
  NotificationsPage,
  SettingsPage,
} from '@/features/admin';

// Public Membership Lifecycle
import {
  MembershipCategoriesPage,
  MembershipApplyPage,
  MembershipSubmittedPage,
  MembershipStatusPage,
} from '@/features/membership';

// Member Portal
import {
  MemberDashboardPage,
  MemberIdCardPage,
  MemberCertificatePage,
  MemberRenewalPage,
  MemberCausesPage,
  MemberPassbookPage,
  MemberSupportPage,
  MemberProfilePage,
  MemberAboutPage,
  MemberEventsPage,
  MemberRightsPage,
  MemberNewsPage,
  MemberBlogsPage,
  MemberNotificationsPage,
  MemberSettingsPage,
} from '@/features/member';

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing / Root Redirect: Defaults to Member Portal Experience */}
        <Route path="/" element={<Navigate to="/member/dashboard" replace />} />

        {/* Public Membership Application & Tracking Routes */}
        <Route path="/membership">
          <Route index element={<Navigate to="/membership/categories" replace />} />
          <Route path="categories" element={<MembershipCategoriesPage />} />
          <Route path="apply" element={<MembershipApplyPage />} />
          <Route path="submitted" element={<MembershipSubmittedPage />} />
          <Route path="status" element={<MembershipStatusPage />} />
        </Route>

        {/* Member Self-Service Portal Routes */}
        <Route path="/member" element={<MemberLayout />}>
          <Route index element={<Navigate to="/member/dashboard" replace />} />
          <Route path="dashboard" element={<MemberDashboardPage />} />
          <Route path="id-card" element={<MemberIdCardPage />} />
          <Route path="certificate" element={<MemberCertificatePage />} />
          <Route path="renew" element={<MemberRenewalPage />} />
          <Route path="causes" element={<MemberCausesPage />} />
          <Route path="passbook" element={<MemberPassbookPage />} />
          <Route path="support" element={<MemberSupportPage />} />
          <Route path="profile" element={<MemberProfilePage />} />
          {/* Member Community & Information Views */}
          <Route path="about" element={<MemberAboutPage />} />
          <Route path="events" element={<MemberEventsPage />} />
          <Route path="rights" element={<MemberRightsPage />} />
          <Route path="news" element={<MemberNewsPage />} />
          <Route path="blogs" element={<MemberBlogsPage />} />
          <Route path="notifications" element={<MemberNotificationsPage />} />
          <Route path="settings" element={<MemberSettingsPage />} />
        </Route>

        {/* Admin Back-Office Portal Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />

          {/* User Management */}
          <Route path="users">
            <Route index element={<UsersListPage />} />
            <Route path="directory" element={<AllUsersDirectoryPage />} />
            <Route path="add" element={<AddUserPage />} />
            <Route path=":id" element={<UserDetailsPage />} />
            <Route path=":id/edit" element={<EditUserPage />} />
            <Route path=":id/verify" element={<UserVerificationPage />} />
          </Route>

          {/* Membership Applications Review */}
          <Route path="applications">
            <Route index element={<ApplicationsListPage />} />
            <Route path=":id" element={<ApplicationDetailsPage />} />
          </Route>

          {/* Verified Members Directory */}
          <Route path="members">
            <Route index element={<MembersListPage />} />
            <Route path="add" element={<AddMemberPage />} />
            <Route path=":id" element={<MemberDetailsPage />} />
            <Route path=":id/edit" element={<EditMemberPage />} />
          </Route>

          {/* Assistance & Social Aid */}
          <Route path="assistance">
            <Route index element={<AssistanceListPage />} />
            <Route path="create-seeker" element={<CreateSeekerPage />} />
            <Route path=":id" element={<AssistanceDetailsPage />} />
          </Route>

          {/* Helpdesk & Support Tickets */}
          <Route path="support">
            <Route index element={<SupportTicketsListPage />} />
            <Route path=":id" element={<SupportTicketDetailsPage />} />
            <Route path=":id/chat" element={<SupportTicketChatPage />} />
          </Route>

          {/* Events & Campaigns */}
          <Route path="events">
            <Route index element={<EventsListPage />} />
            <Route path=":id" element={<EventDetailsPage />} />
          </Route>

          {/* News & Press */}
          <Route path="news">
            <Route index element={<NewsListPage />} />
            <Route path="create" element={<CreateNewsPage />} />
            <Route path=":id" element={<NewsDetailsPage />} />
            <Route path=":id/edit" element={<EditNewsPage />} />
          </Route>

          {/* Articles & Blogs */}
          <Route path="blogs">
            <Route index element={<BlogsListPage />} />
            <Route path="create" element={<CreateBlogPage />} />
            <Route path=":id" element={<BlogDetailsPage />} />
            <Route path=":id/edit" element={<EditBlogPage />} />
          </Route>

          {/* Know Your Rights */}
          <Route path="rights">
            <Route index element={<KnowYourRightsPage />} />
            <Route path="create" element={<CreateRightPage />} />
            <Route path=":id" element={<RightDetailsPage />} />
            <Route path=":id/edit" element={<EditRightPage />} />
          </Route>

          {/* Expense Entries */}
          <Route path="expenses">
            <Route index element={<ExpensesListPage />} />
            <Route path="create" element={<CreateExpensePage />} />
            <Route path=":id" element={<ExpenseDetailsPage />} />
          </Route>

          {/* Receipts */}
          <Route path="receipts">
            <Route index element={<ReceiptsListPage />} />
            <Route path="create" element={<CreateReceiptPage />} />
            <Route path=":id" element={<ReceiptDetailsPage />} />
          </Route>

          {/* Accounting & Ledger */}
          <Route path="accounting">
            <Route index element={<AccountingDashboardPage />} />
            <Route path="ledger" element={<AccountLedgerPage />} />
            <Route path="journal/:id" element={<JournalEntryDetailsPage />} />
          </Route>

          {/* Financial Reports */}
          <Route path="reports">
            <Route index element={<ReportsOverviewPage />} />
            <Route path="trial-balance" element={<TrialBalancePage />} />
            <Route path="profit-loss" element={<ProfitLossPage />} />
            <Route path="balance-sheet" element={<BalanceSheetPage />} />
          </Route>

          {/* Donations */}
          <Route path="donations">
            <Route index element={<DonationsListPage />} />
            <Route path=":id" element={<DonationDetailsPage />} />
            <Route path=":id/receipt" element={<DonationReceiptPage />} />
          </Route>

          {/* Settings, Profile, Notifications */}
          <Route path="profile" element={<ProfilePage />} />
          <Route path="profile/id-card" element={<MyIdCardPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Global 404 Catch-All */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
