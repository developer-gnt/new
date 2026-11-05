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
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { SignupCategoryPage } from '../pages/SignupCategoryPage';
import { MemberRegistrationPage } from '../pages/MemberRegistrationPage';
import { SeekerRegistrationPage } from '../pages/SeekerRegistrationPage';
import { NotFoundPage } from '../pages/NotFoundPage';

// Authentication & Guards
import { AdminGuard } from '../features/auth/components/AdminGuard';
import { useAuth } from '../features/auth/store/authStore';

// Donation Seeker User-Facing Portal
import { SeekerLayout } from '../features/seeker/components/SeekerLayout';
import { SeekerHomePage } from '../features/seeker/screens/SeekerHomePage';
import { SeekerRequestsPage } from '../features/seeker/screens/SeekerRequestsPage';
import { SeekerApplyPage } from '../features/seeker/screens/SeekerApplyPage';
import { SeekerRequestDetailsPage } from '../features/seeker/screens/SeekerRequestDetailsPage';
import { SeekerRightsPage } from '../features/seeker/screens/SeekerRightsPage';
import { SeekerRightDetailsPage } from '../features/seeker/screens/SeekerRightDetailsPage';
import { SeekerEventsPage } from '../features/seeker/screens/SeekerEventsPage';
import { SeekerSupportPage } from '../features/seeker/screens/SeekerSupportPage';
import { SeekerCreateTicketPage } from '../features/seeker/screens/SeekerCreateTicketPage';
import { SeekerProfilePage } from '../features/seeker/screens/SeekerProfilePage';
import { SeekerIdCardPage } from '../features/seeker/screens/SeekerIdCardPage';
import { SeekerNotificationsPage } from '../features/seeker/screens/SeekerNotificationsPage';

const RootIndexRoute: React.FC = () => {
  const { isAuthenticated, isSeeker, isAdmin } = useAuth();
  if (isAuthenticated) {
    if (isSeeker && !isAdmin) {
      return <Navigate to="/seeker/home" replace />;
    }
    return <Navigate to="/admin/dashboard" replace />;
  }
  return <LoginPage />;
};

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Initial Entry Point: Root Index Route (Login Page for guests; Dashboard when authenticated) */}
        <Route path="/" element={<RootIndexRoute />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signin" element={<Navigate to="/login" replace />} />
        <Route path="/auth/login" element={<Navigate to="/login" replace />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/public" element={<HomePage />} />
        <Route path="/portal" element={<HomePage />} />

        {/* Step 1: Signup Category / Account Type Selection */}
        <Route path="/register" element={<SignupCategoryPage />} />
        <Route path="/signup" element={<SignupCategoryPage />} />
        <Route path="/create-account" element={<SignupCategoryPage />} />
        <Route path="/auth/register" element={<SignupCategoryPage />} />
        <Route path="/register/type" element={<SignupCategoryPage />} />
        <Route path="/register/category" element={<SignupCategoryPage />} />

        {/* General User Registration (Personal Details) */}
        <Route path="/register/user" element={<RegisterPage />} />
        <Route path="/register/general" element={<RegisterPage />} />

        {/* Member Registration Experience */}
        <Route path="/membership/apply" element={<MemberRegistrationPage />} />
        <Route path="/membership/categories" element={<MemberRegistrationPage />} />
        <Route path="/membership" element={<MemberRegistrationPage />} />
        <Route path="/member/register" element={<MemberRegistrationPage />} />
        <Route path="/become-a-member" element={<MemberRegistrationPage />} />
        <Route path="/apply-membership" element={<MemberRegistrationPage />} />

        {/* Public Donation Seeker Registration & Assistance Application */}
        <Route path="/assistance/apply" element={<SeekerRegistrationPage />} />
        <Route path="/assistance/track" element={<SeekerRegistrationPage />} />
        <Route path="/apply-assistance" element={<SeekerRegistrationPage />} />
        <Route path="/donation-seeker" element={<SeekerRegistrationPage />} />
        <Route path="/seeker/register" element={<SeekerRegistrationPage />} />

        {/* Authenticated Donation Seeker Portal Routes (User-Facing) */}
        <Route path="/seeker" element={<SeekerLayout />}>
          <Route index element={<Navigate to="/seeker/home" replace />} />
          <Route path="home" element={<SeekerHomePage />} />
          <Route path="requests" element={<SeekerRequestsPage />} />
          <Route path="requests/:id" element={<SeekerRequestDetailsPage />} />
          <Route path="aid" element={<Navigate to="/seeker/requests" replace />} />
          <Route path="apply" element={<SeekerApplyPage />} />
          <Route path="apply-aid" element={<Navigate to="/seeker/apply" replace />} />
          <Route path="rights" element={<SeekerRightsPage />} />
          <Route path="rights/:id" element={<SeekerRightDetailsPage />} />
          <Route path="events" element={<SeekerEventsPage />} />
          <Route path="support" element={<SeekerSupportPage />} />
          <Route path="support/create" element={<SeekerCreateTicketPage />} />
          <Route path="complaint" element={<SeekerCreateTicketPage />} />
          <Route path="profile" element={<SeekerProfilePage />} />
          <Route path="profile/id-card" element={<SeekerIdCardPage />} />
          <Route path="id-card" element={<Navigate to="/seeker/profile/id-card" replace />} />
          <Route path="notifications" element={<SeekerNotificationsPage />} />
          <Route path="*" element={<Navigate to="/seeker/home" replace />} />
        </Route>

        {/* Direct Admin Aliases */}
        <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/users" element={<Navigate to="/admin/users" replace />} />
        <Route path="/all-users" element={<Navigate to="/admin/all-users" replace />} />
        <Route path="/members" element={<Navigate to="/admin/members" replace />} />
        <Route path="/membership-applications" element={<Navigate to="/admin/membership-applications" replace />} />
        <Route path="/applications" element={<Navigate to="/admin/membership-applications" replace />} />
        <Route path="/all-applications" element={<Navigate to="/admin/membership-applications" replace />} />
        <Route path="/assistance" element={<Navigate to="/admin/assistance" replace />} />
        <Route path="/support" element={<Navigate to="/admin/support" replace />} />
        <Route path="/complaints" element={<Navigate to="/admin/support" replace />} />
        <Route path="/tickets" element={<Navigate to="/admin/support" replace />} />
        <Route path="/events" element={<Navigate to="/admin/events" replace />} />
        <Route path="/event" element={<Navigate to="/admin/events" replace />} />
        <Route path="/news" element={<Navigate to="/admin/news" replace />} />
        <Route path="/press" element={<Navigate to="/admin/news" replace />} />
        <Route path="/press-releases" element={<Navigate to="/admin/news" replace />} />
        <Route path="/blogs" element={<Navigate to="/admin/blogs" replace />} />
        <Route path="/articles" element={<Navigate to="/admin/blogs" replace />} />
        <Route path="/blog" element={<Navigate to="/admin/blogs" replace />} />
        <Route path="/rights" element={<Navigate to="/admin/rights" replace />} />
        <Route path="/know-your-rights" element={<Navigate to="/admin/rights" replace />} />
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
        <Route path="/reports" element={<ReportsOverviewPage />} />
        <Route path="/financial-reports" element={<Navigate to="/admin/reports" replace />} />
        <Route path="/analytics" element={<Navigate to="/admin/reports" replace />} />
        <Route path="/trial-balance" element={<Navigate to="/admin/reports/trial-balance" replace />} />
        <Route path="/profit-loss" element={<Navigate to="/admin/reports/profit-loss" replace />} />
        <Route path="/balance-sheet" element={<Navigate to="/admin/reports/balance-sheet" replace />} />
        <Route path="/donations" element={<Navigate to="/admin/donations" replace />} />
        <Route path="/donation" element={<Navigate to="/admin/donations" replace />} />
        <Route path="/profile" element={<Navigate to="/admin/profile" replace />} />
        <Route path="/my-profile" element={<Navigate to="/admin/profile" replace />} />
        <Route path="/id-card" element={<Navigate to="/admin/profile/id-card" replace />} />
        <Route path="/my-id-card" element={<Navigate to="/admin/profile/id-card" replace />} />
        <Route path="/notifications" element={<Navigate to="/admin/notifications" replace />} />
        <Route path="/alerts" element={<Navigate to="/admin/notifications" replace />} />
        <Route path="/inbox" element={<Navigate to="/admin/notifications" replace />} />
        <Route path="/settings" element={<Navigate to="/admin/settings" replace />} />
        <Route path="/preferences" element={<Navigate to="/admin/settings" replace />} />
        <Route path="/system-settings" element={<Navigate to="/admin/settings" replace />} />

        {/* Admin Shell Layout — Guarded against unauthorized Seeker access */}
        <Route element={<AdminGuard />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />

            {/* User Management & All Users Directory Modules */}
            <Route path="users" element={<UsersListPage />} />
            <Route path="users/add" element={<AddUserPage />} />
            <Route path="users/:id" element={<UserDetailsPage />} />
            <Route path="users/:id/edit" element={<EditUserPage />} />
            <Route path="users/:id/verification" element={<UserVerificationPage />} />
            <Route path="all-users" element={<AllUsersDirectoryPage />} />
            <Route path="all-users/:id" element={<UserDetailsPage />} />

            {/* All Applications Module */}
            <Route path="membership-applications" element={<ApplicationsListPage />} />
            <Route path="membership-applications/:id" element={<ApplicationDetailsPage />} />
            <Route path="applications" element={<Navigate to="/admin/membership-applications" replace />} />
            <Route path="applications/:id" element={<ApplicationDetailsPage />} />

            {/* Members Directory Module */}
            <Route path="members" element={<MembersListPage />} />
            <Route path="members/add" element={<AddMemberPage />} />
            <Route path="members/:id" element={<MemberDetailsPage />} />
            <Route path="members/:id/edit" element={<EditMemberPage />} />
            <Route path="member" element={<Navigate to="/admin/members" replace />} />
            <Route path="members-directory" element={<Navigate to="/admin/members" replace />} />
            <Route path="all-members" element={<Navigate to="/admin/members" replace />} />

            {/* Donation Seekers & Aid Module (Admin View) */}
            <Route path="assistance" element={<AssistanceListPage />} />
            <Route path="assistance/create" element={<CreateSeekerPage />} />
            <Route path="assistance/:id" element={<AssistanceDetailsPage />} />
            <Route path="donation-seekers" element={<Navigate to="/admin/assistance" replace />} />
            <Route path="aid" element={<Navigate to="/admin/assistance" replace />} />

            {/* Support & Complaints Module */}
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
            <Route path="news" element={<NewsListPage />} />
            <Route path="news/create" element={<CreateNewsPage />} />
            <Route path="news/:id" element={<NewsDetailsPage />} />
            <Route path="news/:id/edit" element={<EditNewsPage />} />
            <Route path="press" element={<Navigate to="/admin/news" replace />} />
            <Route path="press-releases" element={<Navigate to="/admin/news" replace />} />
            <Route path="blogs" element={<BlogsListPage />} />
            <Route path="blogs/create" element={<CreateBlogPage />} />
            <Route path="blogs/:id" element={<BlogDetailsPage />} />
            <Route path="blogs/:id/edit" element={<EditBlogPage />} />
            <Route path="articles" element={<Navigate to="/admin/blogs" replace />} />
            <Route path="blog" element={<Navigate to="/admin/blogs" replace />} />
            <Route path="rights" element={<KnowYourRightsPage />} />
            <Route path="rights/create" element={<CreateRightPage />} />
            <Route path="rights/:id" element={<RightDetailsPage />} />
            <Route path="rights/:id/edit" element={<EditRightPage />} />
            <Route path="know-your-rights" element={<Navigate to="/admin/rights" replace />} />
            <Route path="legal-rights" element={<Navigate to="/admin/rights" replace />} />

            {/* Finance & Accounts */}
            <Route path="expenses" element={<ExpensesListPage />} />
            <Route path="expenses/create" element={<CreateExpensePage />} />
            <Route path="expenses/:id" element={<ExpenseDetailsPage />} />
            <Route path="expense" element={<Navigate to="/admin/expenses" replace />} />
            <Route path="expense-vouchers" element={<Navigate to="/admin/expenses" replace />} />
            <Route path="vouchers" element={<Navigate to="/admin/expenses" replace />} />
            <Route path="receipts" element={<ReceiptsListPage />} />
            <Route path="receipts/create" element={<CreateReceiptPage />} />
            <Route path="receipts/:id" element={<ReceiptDetailsPage />} />
            <Route path="receipt" element={<Navigate to="/admin/receipts" replace />} />
            <Route path="income" element={<Navigate to="/admin/receipts" replace />} />
            <Route path="income/create" element={<Navigate to="/admin/receipts/create" replace />} />
            <Route path="income/:id" element={<ReceiptDetailsPage />} />
            <Route path="income-vouchers" element={<Navigate to="/admin/receipts" replace />} />
            <Route path="accounting" element={<AccountingDashboardPage />} />
            <Route path="accounting/accounts/:id/ledger" element={<AccountLedgerPage />} />
            <Route path="accounting/entries/:id" element={<JournalEntryDetailsPage />} />
            <Route path="ledger" element={<Navigate to="/admin/accounting" replace />} />
            <Route path="chart-of-accounts" element={<Navigate to="/admin/accounting?tab=accounts" replace />} />
            <Route path="journal-entries" element={<Navigate to="/admin/accounting?tab=journals" replace />} />
            <Route path="passbook" element={<Navigate to="/admin/accounting?tab=passbook" replace />} />
            <Route path="reports" element={<ReportsOverviewPage />} />
            <Route path="reports/trial-balance" element={<TrialBalancePage />} />
            <Route path="reports/profit-loss" element={<ProfitLossPage />} />
            <Route path="reports/balance-sheet" element={<BalanceSheetPage />} />
            <Route path="financial-reports" element={<Navigate to="/admin/reports" replace />} />
            <Route path="trial-balance" element={<Navigate to="/admin/reports/trial-balance" replace />} />
            <Route path="profit-loss" element={<Navigate to="/admin/reports/profit-loss" replace />} />
            <Route path="balance-sheet" element={<Navigate to="/admin/reports/balance-sheet" replace />} />
            <Route path="donations" element={<DonationsListPage />} />
            <Route path="donations/:id" element={<DonationDetailsPage />} />
            <Route path="donations/:id/receipt" element={<DonationReceiptPage />} />
            <Route path="donation" element={<Navigate to="/admin/donations" replace />} />

            {/* Platform & System */}
            <Route path="profile" element={<ProfilePage />} />
            <Route path="profile/id-card" element={<MyIdCardPage />} />
            <Route path="id-card" element={<Navigate to="/admin/profile/id-card" replace />} />
            <Route path="my-id-card" element={<Navigate to="/admin/profile/id-card" replace />} />
            <Route path="my-profile" element={<Navigate to="/admin/profile" replace />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="alerts" element={<Navigate to="/admin/notifications" replace />} />
            <Route path="inbox" element={<Navigate to="/admin/notifications" replace />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="preferences" element={<Navigate to="/admin/settings" replace />} />
            <Route path="system-settings" element={<Navigate to="/admin/settings" replace />} />
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Route>
        </Route>

        {/* 404 Not Found Catch-All */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};
