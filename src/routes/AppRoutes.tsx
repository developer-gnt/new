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
import { PlaceholderPage } from '../pages/PlaceholderPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root Redirects & Direct Aliases */}
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/users" element={<Navigate to="/admin/users" replace />} />
        <Route path="/all-users" element={<Navigate to="/admin/all-users" replace />} />
        <Route path="/members" element={<Navigate to="/admin/members" replace />} />
        <Route path="/membership-applications" element={<Navigate to="/admin/membership-applications" replace />} />
        <Route path="/applications" element={<Navigate to="/admin/membership-applications" replace />} />
        <Route path="/assistance" element={<Navigate to="/admin/assistance" replace />} />
        <Route path="/support" element={<Navigate to="/admin/support" replace />} />
        <Route path="/complaints" element={<Navigate to="/admin/support" replace />} />
        <Route path="/tickets" element={<Navigate to="/admin/support" replace />} />
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
          <Route
            path="events"
            element={
              <PlaceholderPage
                title="Events Management"
                moduleGroup="Content & Media"
                description="Organize human rights conclaves, workshops, delegate registrations and speaker schedules."
              />
            }
          />
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
          <Route
            path="accounting"
            element={
              <PlaceholderPage
                title="Accounting & Ledger"
                moduleGroup="Finance & Accounts"
                description="Double-entry chart of accounts, journal entries and running general ledger."
              />
            }
          />
          <Route
            path="reports"
            element={
              <PlaceholderPage
                title="Financial Reports"
                moduleGroup="Finance & Accounts"
                description="Trial balance, profit & loss statement, and audit-ready annual balance sheet."
              />
            }
          />
          <Route
            path="donations"
            element={
              <PlaceholderPage
                title="Donations Management"
                moduleGroup="Finance & Accounts"
                description="Manage philanthropic contributions, donor database and official 80G tax exemption certificates."
              />
            }
          />

          {/* Platform & System */}
          <Route
            path="profile"
            element={
              <PlaceholderPage
                title="My Profile & ID Card"
                moduleGroup="Platform & System"
                description="Administrator profile credentials, security settings and official printable ID card generator."
              />
            }
          />
          <Route
            path="notifications"
            element={
              <PlaceholderPage
                title="Notifications"
                moduleGroup="Platform & System"
                description="System alerts, pending task reminders and member registration notifications."
              />
            }
          />
          <Route
            path="settings"
            element={
              <PlaceholderPage
                title="Settings & Preferences"
                moduleGroup="Platform & System"
                description="Administrative governance settings, language options and system configurations."
              />
            }
          />
          {/* Admin Catch-All (Keeps admin shell intact instead of breaking out) */}
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Route>

        {/* 404 Not Found Catch-All */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};
