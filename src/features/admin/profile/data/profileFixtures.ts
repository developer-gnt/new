/**
 * Initial fixtures for HRSJM Administrator Profile & ID Card.
 * Consistent with Central HRSJM Database & Mobile Profile Store.
 */

import type { AdminProfile } from '../types/profile.types';

export const INITIAL_ADMIN_PROFILE: AdminProfile = {
  accountName: 'Aman Shaikh',
  adminId: 'ADMIN001',
  memberId: 'HRSJM-00001',
  fullName: 'Aman Shaikh',
  email: 'admin@hrsjm.org',
  phone: '+91 98765 43210',
  dateOfBirth: '15 Aug 1988',
  bloodGroup: 'O+',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  role: 'Super Admin',
  designation: 'National General Secretary & Trustee',
  department: 'Central Executive Committee',
  accountStatus: 'Active',
  membershipType: 'National Executive Member',
  memberSince: '12 Oct 2024',
  issueDate: '12 Oct 2024',
  validTill: '31 Dec 2027',
  emergencyContact: '+91 98765 43211',
  address: 'Plot No. 14, Human Rights Bhavan, Institutional Area, Lodhi Road',
  city: 'New Delhi',
  state: 'Delhi',
  pincode: '110003',
  hasAppliedMembership: true,
  membershipStatus: 'Active',
  applicationId: 'HRSJM-00001',
  appliedMembershipType: 'National Executive Member',
};

export const BLOOD_GROUPS: string[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const ADMIN_ROLES: string[] = [
  'Super Admin',
  'Admin',
  'National Executive Member',
  'Hon\'ble State Director',
  'State President',
  'Zonal Incharge',
  'District Secretary',
  'Legal Cell Incharge',
];

export const AVATAR_PRESETS = [
  {
    id: 'avatar-1',
    label: 'Professional Male 1',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'avatar-2',
    label: 'Professional Male 2',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'avatar-3',
    label: 'Professional Male 3',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'avatar-4',
    label: 'Professional Female 1',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'avatar-5',
    label: 'Professional Female 2',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'avatar-6',
    label: 'Formal Portrait',
    url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
  },
];
