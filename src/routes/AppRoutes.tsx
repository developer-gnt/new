import type React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from '../components/layout/AdminLayout';
import { AdminDashboardPage } from '../pages/AdminDashboardPage';
import { UsersListPage } from '../features/users/screens/UsersListPage';
import { AllUsersDirectoryPage } from '../features/users/screens/AllUsersDirectoryPage';
import { UserDetailsPage } from '../features/users/screens/UserDetailsPage';
import { AddUserPage } from '../features/users/screens/AddUserPage';
import { EditUserPage } from '../features/users/screens/EditUserPage';
import { UserVerificationPage } from '../features/users/screens/UserVerificationPage';
import { ApplicationsListPage } from '../features/applications/screens/ApplicationsListPage';
import { ApplicationDetailsPage } from '../features/applications/screens/ApplicationDetailsPage';
import { MembersListPage } from '../features/members/screens/MembersListPage';
import { MemberDetailsPage } from '../features/members/screens/MemberDetailsPage';
import { AddMemberPage } from '../features/members/screens/AddMemberPage';
import { EditMemberPage } from '../features/members/screens/EditMemberPage';
import { AssistanceListPage } from '../features/assistance/screens/AssistanceListPage';
import { AssistanceDetailsPage } from '../features/assistance/screens/AssistanceDetailsPage';
import { CreateSeekerPage } from '../features/assistance/screens/CreateSeekerPage';
import { SupportTicketsListPage } from '../features/support/screens/SupportTicketsListPage';
import { SupportTicketDetailsPage } from '../features/support/screens/SupportTicketDetailsPage';
import { SupportTicketChatPage } from '../features/support/screens/SupportTicketChatPage';
import { EventsListPage } from '../features/events/screens/EventsListPage';
import { EventDetailsPage } from '../features/events/screens/EventDetailsPage';
import { NewsListPage } from '../features/news/screens/NewsListPage';
import { NewsDetailsPage } from '../features/news/screens/NewsDetailsPage';
import { CreateNewsPage } from '../features/news/screens/CreateNewsPage';
import { EditNewsPage } from '../features/news/screens/EditNewsPage';
import { BlogsListPage } from '../features/blogs/screens/BlogsListPage';
import { BlogDetailsPage } from '../features/blogs/screens/BlogDetailsPage';
import { CreateBlogPage } from '../features/blogs/screens/CreateBlogPage';
import { EditBlogPage } from '../features/blogs/screens/EditBlogPage';
import { KnowYourRightsPage } from '../features/rights/screens/KnowYourRightsPage';
import { RightDetailsPage } from '../features/rights/screens/RightDetailsPage';
import { CreateRightPage } from '../features/rights/screens/CreateRightPage';
import { EditRightPage } from '../features/rights/screens/EditRightPage';
import { ExpensesListPage } from '../features/expenses/screens/ExpensesListPage';
import { ExpenseDetailsPage } from '../features/expenses/screens/ExpenseDetailsPage';
import { CreateExpensePage } from '../features/expenses/screens/CreateExpensePage';
import { ReceiptsListPage } from '../features/receipts/screens/ReceiptsListPage';
import { ReceiptDetailsPage } from '../features/receipts/screens/ReceiptDetailsPage';
import { CreateReceiptPage } from '../features/receipts/screens/CreateReceiptPage';
import { AccountingDashboardPage } from '../features/accounting/screens/AccountingDashboardPage';
import { AccountLedgerPage } from '../features/accounting/screens/AccountLedgerPage';
import { JournalEntryDetailsPage } from '../features/accounting/screens/JournalEntryDetailsPage';
import { ReportsOverviewPage } from '../features/reports/screens/ReportsOverviewPage';
import { TrialBalancePage } from '../features/reports/screens/TrialBalancePage';
import { ProfitLossPage } from '../features/reports/screens/ProfitLossPage';
import { BalanceSheetPage } from '../features/reports/screens/BalanceSheetPage';
import { DonationsListPage } from '../features/donations/screens/DonationsListPage';
import { DonationDetailsPage } from '../features/donations/screens/DonationDetailsPage';
import { DonationReceiptPage } from '../features/donations/screens/DonationReceiptPage';
import { ProfilePage } from '../features/profile/screens/ProfilePage';
import { MyIdCardPage } from '../features/profile/screens/MyIdCardPage';
import { NotificationsPage } from '../features/notifications/screens/NotificationsPage';
import { SettingsPage } from '../features/settings/screens/SettingsPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { UserLayout } from '../features/user/layout/UserLayout';
import { UserDashboardPage } from '../features/user/screens/UserDashboardPage';
import { UserAboutPage } from '../features/user/screens/UserAboutPage';
import { UserWhatWeDoPage } from '../features/user/screens/UserWhatWeDoPage';
import { UserRightsPage } from '../features/user/screens/UserRightsPage';
import { UserEventsPage } from '../features/user/screens/UserEventsPage';
import { UserNewsPage } from '../features/user/screens/UserNewsPage';
import { UserBlogsPage } from '../features/user/screens/UserBlogsPage';
import { UserDonationsPage } from '../features/user/screens/UserDonationsPage';
import { UserContactPage } from '../features/user/screens/UserContactPage';
import { UserSupportPage } from '../features/user/screens/UserSupportPage';
import { UserMembershipPage } from '../features/user/screens/UserMembershipPage';
import { UserNotificationsPage } from '../features/user/screens/UserNotificationsPage';
import { UserProfilePage } from '../features/user/screens/UserProfilePage';

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root Redirects & Direct Aliases */}
        {/* User Application Routes (Cloned APK User Portal) */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<UserDashboardPage />} />
          <Route path="/home" element={<UserDashboardPage />} />
          <Route path="/user" element={<UserDashboardPage />} />
          <Route path="/user/dashboard" element={<UserDashboardPage />} />
          <Route path="/about" element={<UserAboutPage />} />
          <Route path="/what-we-do" element={<UserWhatWeDoPage />} />
          <Route path="/rights" element={<UserRightsPage />} />
          <Route path="/know-your-rights" element={<UserRightsPage />} />
          <Route path="/events" element={<UserEventsPage />} />
          <Route path="/event" element={<UserEventsPage />} />
          <Route path="/news" element={<UserNewsPage />} />
          <Route path="/press" element={<UserNewsPage />} />
          <Route path="/blogs" element={<UserBlogsPage />} />
          <Route path="/articles" element={<UserBlogsPage />} />
          <Route path="/donations" element={<UserDonationsPage />} />
          <Route path="/contact" element={<UserContactPage />} />
          <Route path="/support" element={<UserSupportPage />} />
          <Route path="/complaints" element={<UserSupportPage />} />
          <Route path="/membership-applications" element={<UserMembershipPage />} />
          <Route path="/membership" element={<UserMembershipPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/my-profile" element={<UserProfilePage />} />
          <Route path="/notifications" element={<UserNotificationsPage />} />
          <Route path="/alerts" element={<UserNotificationsPage />} />
        </Route>

        {/* Admin Direct Aliases (Exclusively for Admin-only modules) */}
        <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/users" element={<Navigate to="/admin/users" replace />} />
        <Route path="/all-users" element={<Navigate to="/admin/all-users" replace />} />
        <Route path="/members" element={<Navigate to="/admin/members" replace />} />
        <Route path="/applications" element={<Navigate to="/admin/membership-applications" replace />} />
        <Route path="/assistance" element={<Navigate to="/admin/assistance" replace />} />
        <Route path="/tickets" element={<Navigate to="/admin/support" replace />} />
        <Route path="/press-releases" element={<Navigate to="/admin/news" replace />} />
        <Route path="/blog" element={<Navigate to="/admin/blogs" replace />} />
        <Route path="/legal-rights" element={<Navigate to="/admin/rights" replace />} />
        <Route path="/expenses" element={<Navigate to="/admin/expenses" replace />} />
        <Route path="/expense" element={<Navigate to="/admin/expenses" replace />} />
        <Route path="/vouchers" element={<Navigate to="/admin/expenses" replace />} />
        <Route path="/expense-vouchers" element={<Navigate to="/admin/expenses" replace />} />
        <Route path="/receipts" element={<Navigate to="/admin/receipts" replace />} />
        <Route path="/receipt" element={<Navigate to="/admin/receipts" replace />} />
        <Route path="/income" element={<Navigate to="/admin/receipts" replace />} />
        <Route path="/income-vouchers" element={<Navigate to="/admin/receipts" replace />} />
        <Route path="/accounting" element={<Navigate to="/admin/accounting" replace />} />
        <Route path="/ledger" element={<Navigate to="/admin/accounting" replace />} />
        <Route path="/chart-of-accounts" element={<Navigate to="/admin/accounting?tab=accounts" replace />} />
        <Route path="/journal-entries" element={<Navigate to="/admin/accounting?tab=journals" replace />} />
        <Route path="/passbook" element={<Navigate to="/admin/accounting?tab=passbook" replace />} />
        <Route path="/reports" element={<Navigate to="/admin/reports" replace />} />
        <Route path="/financial-reports" element={<Navigate to="/admin/reports" replace />} />
        <Route path="/analytics" element={<Navigate to="/admin/reports" replace />} />
        <Route path="/trial-balance" element={<Navigate to="/admin/reports/trial-balance" replace />} />
        <Route path="/profit-loss" element={<Navigate to="/admin/reports/profit-loss" replace />} />
        <Route path="/balance-sheet" element={<Navigate to="/admin/reports/balance-sheet" replace />} />
        <Route path="/donation" element={<Navigate to="/admin/donations" replace />} />
        <Route path="/id-card" element={<Navigate to="/admin/profile/id-card" replace />} />
        <Route path="/my-id-card" element={<Navigate to="/admin/profile/id-card" replace />} />
        <Route path="/inbox" element={<Navigate to="/admin/notifications" replace />} />
        <Route path="/settings" element={<Navigate to="/admin/settings" replace />} />
        <Route path="/preferences" element={<Navigate to="/admin/settings" replace />} />
        <Route path="/system-settings" element={<Navigate to="/admin/settings" replace />} />

        {/* Admin Shell Layout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />

          {/* User Management & All Users Directory Modules (Exact APK Counterparts) */}
          <Route path="users" element={<UsersListPage />} />
          <Route path="users/add" element={<AddUserPage />} />
          <Route path="users/:id" element={<UserDetailsPage />} />
          <Route path="users/:id/edit" element={<EditUserPage />} />
          <Route path="users/:id/verification" element={<UserVerificationPage />} />
          <Route path="all-users" element={<AllUsersDirectoryPage />} />
          <Route path="all-users/:id" element={<UserDetailsPage />} />

          {/* All Applications Module (Exact Counterpart of Mobile App) */}
          <Route path="membership-applications" element={<ApplicationsListPage />} />
          <Route path="membership-applications/:id" element={<ApplicationDetailsPage />} />
          <Route path="applications" element={<Navigate to="/admin/membership-applications" replace />} />
          <Route path="applications/:id" element={<ApplicationDetailsPage />} />

          {/* Members Directory Module (Exact Counterpart of Mobile App) */}
          <Route path="members" element={<MembersListPage />} />
          <Route path="members/add" element={<AddMemberPage />} />
          <Route path="members/:id" element={<MemberDetailsPage />} />
          <Route path="members/:id/edit" element={<EditMemberPage />} />
          <Route path="member" element={<Navigate to="/admin/members" replace />} />
          <Route path="members-directory" element={<Navigate to="/admin/members" replace />} />
          <Route path="all-members" element={<Navigate to="/admin/members" replace />} />

          {/* Donation Seekers & Aid Module (Exact Counterpart of Mobile App) */}
          <Route path="assistance" element={<AssistanceListPage />} />
          <Route path="assistance/create" element={<CreateSeekerPage />} />
          <Route path="assistance/:id" element={<AssistanceDetailsPage />} />
          <Route path="donation-seekers" element={<Navigate to="/admin/assistance" replace />} />
          <Route path="aid" element={<Navigate to="/admin/assistance" replace />} />

        {/* Support & Complaints Module (Exact Counterpart of Mobile App) */}
          <Route path="support" element={<SupportTicketsListPage />} />
          <Route path="support/:id" element={<SupportTicketDetailsPage />} />
          <Route path="support/:id/chat" element={<SupportTicketChatPage />} />
          <Route path="complaints" element={<Navigate to="/admin/support" replace />} />
          <Route path="complaints/:id" element={<SupportTicketDetailsPage />} />
          <Route path="complaints/:id/chat" element={<SupportTicketChatPage />} />
          <Route path="tickets" element={<Navigate to="/admin/support" replace />} />
          <Route path="tickets/:id" element={<SupportTicketDetailsPage />} />
          <Route path="tickets/:id/chat" element={<SupportTicketChatPage />} />

          {/* Content & Media */}
          <Route path="events" element={<EventsListPage />} />
          <Route path="events/:id" element={<EventDetailsPage />} />
          {/* News & Press Module (Exact Counterpart of Mobile APK) */}
          <Route path="news" element={<NewsListPage />} />
          <Route path="news/create" element={<CreateNewsPage />} />
          <Route path="news/:id" element={<NewsDetailsPage />} />
          <Route path="news/:id/edit" element={<EditNewsPage />} />
          <Route path="press" element={<Navigate to="/admin/news" replace />} />
          <Route path="press-releases" element={<Navigate to="/admin/news" replace />} />
          {/* Articles & Blogs Module (Exact Counterpart of Mobile APK) */}
          <Route path="blogs" element={<BlogsListPage />} />
          <Route path="blogs/create" element={<CreateBlogPage />} />
          <Route path="blogs/:id" element={<BlogDetailsPage />} />
          <Route path="blogs/:id/edit" element={<EditBlogPage />} />
          <Route path="articles" element={<Navigate to="/admin/blogs" replace />} />
          <Route path="blog" element={<Navigate to="/admin/blogs" replace />} />
          {/* Know Your Rights Module (Exact Counterpart of Mobile APK) */}
          <Route path="rights" element={<KnowYourRightsPage />} />
          <Route path="rights/create" element={<CreateRightPage />} />
          <Route path="rights/:id" element={<RightDetailsPage />} />
          <Route path="rights/:id/edit" element={<EditRightPage />} />
          <Route path="know-your-rights" element={<Navigate to="/admin/rights" replace />} />
          <Route path="legal-rights" element={<Navigate to="/admin/rights" replace />} />

          {/* Finance & Accounts — Expenses Module (Exact Counterpart of Mobile APK) */}
          <Route path="expenses" element={<ExpensesListPage />} />
          <Route path="expenses/create" element={<CreateExpensePage />} />
          <Route path="expenses/:id" element={<ExpenseDetailsPage />} />
          <Route path="expense" element={<Navigate to="/admin/expenses" replace />} />
          <Route path="expense-vouchers" element={<Navigate to="/admin/expenses" replace />} />
          <Route path="vouchers" element={<Navigate to="/admin/expenses" replace />} />
          {/* Finance & Accounts — Receipts & Income Module (Exact Counterpart of Mobile APK) */}
          <Route path="receipts" element={<ReceiptsListPage />} />
          <Route path="receipts/create" element={<CreateReceiptPage />} />
          <Route path="receipts/:id" element={<ReceiptDetailsPage />} />
          <Route path="receipt" element={<Navigate to="/admin/receipts" replace />} />
          <Route path="income" element={<Navigate to="/admin/receipts" replace />} />
          <Route path="income/create" element={<Navigate to="/admin/receipts/create" replace />} />
          <Route path="income/:id" element={<ReceiptDetailsPage />} />
          <Route path="income-vouchers" element={<Navigate to="/admin/receipts" replace />} />
          {/* Finance & Accounts — Accounting & Ledger Module (Exact Counterpart of Mobile APK) */}
          <Route path="accounting" element={<AccountingDashboardPage />} />
          <Route path="accounting/accounts/:id/ledger" element={<AccountLedgerPage />} />
          <Route path="accounting/entries/:id" element={<JournalEntryDetailsPage />} />
          <Route path="ledger" element={<Navigate to="/admin/accounting" replace />} />
          <Route path="chart-of-accounts" element={<Navigate to="/admin/accounting?tab=accounts" replace />} />
          <Route path="journal-entries" element={<Navigate to="/admin/accounting?tab=journals" replace />} />
          <Route path="passbook" element={<Navigate to="/admin/accounting?tab=passbook" replace />} />
          {/* Finance & Accounts — Financial Reports Module (Exact Counterpart of Mobile APK) */}
          <Route path="reports" element={<ReportsOverviewPage />} />
          <Route path="reports/trial-balance" element={<TrialBalancePage />} />
          <Route path="reports/profit-loss" element={<ProfitLossPage />} />
          <Route path="reports/balance-sheet" element={<BalanceSheetPage />} />
          <Route path="financial-reports" element={<Navigate to="/admin/reports" replace />} />
          <Route path="trial-balance" element={<Navigate to="/admin/reports/trial-balance" replace />} />
          <Route path="profit-loss" element={<Navigate to="/admin/reports/profit-loss" replace />} />
          <Route path="balance-sheet" element={<Navigate to="/admin/reports/balance-sheet" replace />} />
          {/* Finance & Accounts — Donations Management Module (Exact Counterpart of Mobile APK) */}
          <Route path="donations" element={<DonationsListPage />} />
          <Route path="donations/:id" element={<DonationDetailsPage />} />
          <Route path="donations/:id/receipt" element={<DonationReceiptPage />} />
          <Route path="donation" element={<Navigate to="/admin/donations" replace />} />

          {/* Platform & System — My Profile & ID Card Module (Exact Counterpart of Mobile APK) */}
          <Route path="profile" element={<ProfilePage />} />
          <Route path="profile/id-card" element={<MyIdCardPage />} />
          <Route path="id-card" element={<Navigate to="/admin/profile/id-card" replace />} />
          <Route path="my-id-card" element={<Navigate to="/admin/profile/id-card" replace />} />
          <Route path="my-profile" element={<Navigate to="/admin/profile" replace />} />
          {/* Platform & System — Notifications Module (Exact Counterpart of Mobile APK & Backend) */}
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="alerts" element={<Navigate to="/admin/notifications" replace />} />
          <Route path="inbox" element={<Navigate to="/admin/notifications" replace />} />
          {/* Platform & System — Settings & Preferences Module (Exact Counterpart of Mobile APK) */}
          <Route path="settings" element={<SettingsPage />} />
          <Route path="preferences" element={<Navigate to="/admin/settings" replace />} />
          <Route path="system-settings" element={<Navigate to="/admin/settings" replace />} />
          {/* Admin Catch-All (Keeps admin shell intact instead of breaking out) */}
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Route>

        {/* 404 Not Found Catch-All */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};
