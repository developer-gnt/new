/** Member lifecycle status shown as the row pill. */
export type MemberStatus = 'ACTIVE' | 'EXPIRING_SOON' | 'INACTIVE' | 'PENDING';

export type MemberFilterTab = 'ALL' | MemberStatus;

export type MemberSortOption =
  | 'default'
  | 'name_asc'
  | 'joined_desc'
  | 'expiry_asc';

export interface KitFulfillmentData {
  status: 'PENDING' | 'PROCESSING' | 'DISPATCHED' | 'DELIVERED';
  courier_name?: string;
  tracking_number?: string;
  dispatch_date?: string;
  delivery_address?: string;
  notes?: string;
  items?: string[];
}

export interface MemberDocumentItem {
  id: string;
  name: string;
  type: string;
  url?: string;
  uploadedAt?: string;
  fileSize?: string;
}

export interface Member {
  id: string;
  userId?: string;
  name: string;
  phone: string;
  email: string;
  /** Display membership number, e.g. HRSJM202600123. */
  membershipId: string;
  /** ISO date string. */
  joinedDate: string;
  /** ISO date string — membership validity end. */
  validTill: string;
  status: MemberStatus;
  /** Member avatar photo URL */
  photo?: string;
  categoryName?: string;
  categoryId?: string;
  amount?: number | string;
  gender?: string;
  dob?: string;
  qualification?: string;
  fatherName?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  kitFulfillment?: KitFulfillmentData;
  documents?: MemberDocumentItem[];
  adminNotes?: string;
  rawBackend?: unknown;
}

/** Aggregate counts for the statistics cards / filter tabs. */
export interface MemberStats {
  total: number;
  active: number;
  expiringSoon: number;
  inactive: number;
  pending?: number;
}

export interface MembershipCategoryItem {
  id: string;
  name: string;
  code: string;
  fee: number | string;
  description?: string;
  validity_days?: number;
  status: string;
  free_renewal_years?: number | string;
}

export interface CreateMemberPayload {
  category_id: string;
  full_name: string;
  mobile_number: string;
  email?: string;
  personal_details?: {
    dob?: string;
    gender?: string;
    qualification?: string;
    father_name?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  admin_notes?: string;
  auto_activate?: boolean;
}

export interface UpdateMemberPayload {
  category_id?: string;
  application_data?: {
    full_name?: string;
    mobile_number?: string;
    email?: string;
    personal_details?: {
      dob?: string;
      gender?: string;
      qualification?: string;
      other_qualification?: string;
      father_name?: string;
      address?: string;
      city?: string;
      state?: string;
      pincode?: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  admin_notes?: string;
}

