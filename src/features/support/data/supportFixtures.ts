import type { SupportTicket, SupportTicketMessage } from '../types/support.types';

export const INITIAL_SUPPORT_MESSAGES: Record<string, SupportTicketMessage[]> = {
  'tkt-001': [
    {
      id: 'msg-101',
      ticket_id: 'tkt-001',
      author_id: 'usr-101',
      author: {
        id: 'usr-101',
        full_name: 'Dr. Rajesh Sharma',
        email: 'rajesh.sharma@example.org',
        roles: ['MEMBER'],
      },
      body: 'Hello Support, I received my membership approval 3 weeks ago, but the physical ID card and welcome kit haven’t arrived at my residential address yet. Tracking reference is not active on India Post portal.',
      created_at: '2026-10-15T09:30:00.000Z',
      updated_at: '2026-10-15T09:30:00.000Z',
    },
    {
      id: 'msg-102',
      ticket_id: 'tkt-001',
      author_id: 'admin-001',
      author: {
        id: 'admin-001',
        full_name: 'Administrator',
        email: 'admin@hrsjm.org',
        roles: ['ADMIN'],
      },
      body: 'Dear Dr. Rajesh, we have verified your dispatch request. The kit batch was dispatched on 12th October via Speed Post (Consignment: SP-HRSJM884129). Due to regional sorting delays in Delhi Hub, delivery is scheduled for tomorrow. We are actively tracking it.',
      created_at: '2026-10-15T11:45:00.000Z',
      updated_at: '2026-10-15T11:45:00.000Z',
    },
    {
      id: 'msg-103',
      ticket_id: 'tkt-001',
      author_id: 'usr-101',
      author: {
        id: 'usr-101',
        full_name: 'Dr. Rajesh Sharma',
        email: 'rajesh.sharma@example.org',
        roles: ['MEMBER'],
      },
      body: 'Thank you for the prompt update! I will watch for the postman tomorrow morning.',
      created_at: '2026-10-15T14:10:00.000Z',
      updated_at: '2026-10-15T14:10:00.000Z',
    },
  ],
  'tkt-002': [
    {
      id: 'msg-201',
      ticket_id: 'tkt-002',
      author_id: 'usr-102',
      author: {
        id: 'usr-102',
        full_name: 'Sunita Devi',
        email: 'sunita.devi@example.org',
        roles: ['USER'],
      },
      body: 'Sir, I donated ₹5,000 online on 18th Oct via UPI for the winter relief drive, but the 80G tax exemption receipt was not emailed to me. Transaction UTR is 428910482910.',
      created_at: '2026-10-19T10:15:00.000Z',
      updated_at: '2026-10-19T10:15:00.000Z',
    },
    {
      id: 'msg-202',
      ticket_id: 'tkt-002',
      author_id: 'admin-001',
      author: {
        id: 'admin-001',
        full_name: 'Administrator',
        email: 'admin@hrsjm.org',
        roles: ['ADMIN'],
      },
      body: 'Namaste Sunita ji, we have matched UTR 428910482910 with our bank settlement ledger. The 80G certificate (No. HRSJM/80G/2026/0491) is regenerated and attached in your documents tab. A copy is also resent to your email.',
      created_at: '2026-10-19T12:00:00.000Z',
      updated_at: '2026-10-19T12:00:00.000Z',
    },
  ],
  'tkt-003': [
    {
      id: 'msg-301',
      ticket_id: 'tkt-003',
      author_id: 'usr-103',
      author: {
        id: 'usr-103',
        full_name: 'Adv. Meenakshi Sundaram',
        email: 'm.sundaram@legalcell.in',
        roles: ['MEMBER'],
      },
      body: 'URGENT: Illegal eviction reported by municipal authorities in slum cluster Ward 14 without statutory 30-day notice. 42 families affected. Local police refusing to accept representation. We need state chapter legal intervention letter immediately.',
      created_at: '2026-10-24T08:00:00.000Z',
      updated_at: '2026-10-24T08:00:00.000Z',
    },
  ],
};

export const INITIAL_SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: 'tkt-001',
    user_id: 'usr-101',
    user: {
      id: 'usr-101',
      full_name: 'Dr. Rajesh Sharma',
      email: 'rajesh.sharma@example.org',
      mobile_number: '+91 98765 43210',
      roles: ['MEMBER'],
    },
    subject: '[Membership] Membership Card & Welcome Kit Dispatch Status',
    description: `Complainant Information:
- Full Name: Dr. Rajesh Sharma
- Mobile: +91 98765 43210
- Email: rajesh.sharma@example.org
- State: Delhi
- District: New Delhi
- Address: Flat 402, Sunshine Apartments, Mayur Vihar Phase 1

Details of Concern:
I have not received my membership physical card yet. It has been over 3 weeks since registration approval. The local post office has no record of consignment SP-HRSJM884129.

--- Verified Documents
- Aadhaar Card (KYC Verified)
- Fee Payment Receipt (₹1,500)`,
    status: 'UNDER_REVIEW',
    category: 'Membership',
    priority: 'HIGH',
    source: 'app',
    created_at: '2026-10-15T09:30:00.000Z',
    updated_at: '2026-10-15T11:45:00.000Z',
    documents: [
      {
        id: 'att-1',
        name: 'Aadhaar_Card_Front_Back.pdf',
        size: 1420000,
        formattedSize: '1.4 MB',
        type: 'application/pdf',
        uploadedAt: '15 Oct 2026',
      },
      {
        id: 'att-2',
        name: 'Membership_Receipt_2026.pdf',
        size: 890000,
        formattedSize: '890 KB',
        type: 'application/pdf',
        uploadedAt: '15 Oct 2026',
      },
    ],
  },
  {
    id: 'tkt-002',
    user_id: 'usr-102',
    user: {
      id: 'usr-102',
      full_name: 'Sunita Devi',
      email: 'sunita.devi@example.org',
      mobile_number: '+91 98111 22334',
      roles: ['USER'],
    },
    subject: '[Donation] 80G Tax Exemption Receipt Not Received for Online Donation',
    description: `[Priority: NORMAL]
[Source: Website]

I have made an online donation of ₹5,000 on 18th Oct via UPI for the winter relief drive, but the 80G tax exemption receipt was not emailed to me. Transaction UTR is 428910482910. Please issue the 80G certificate so I can file my IT returns.`,
    status: 'RESOLVED',
    category: 'Donation',
    priority: 'NORMAL',
    source: 'website',
    resolved_by: 'admin-001',
    resolved_by_user: {
      id: 'admin-001',
      full_name: 'Administrator',
      email: 'admin@hrsjm.org',
    },
    resolved_at: '2026-10-19T12:00:00.000Z',
    resolution_note: 'Verified UTR in bank ledger. Regenerated 80G Certificate No. HRSJM/80G/2026/0491 and dispatched via automated email.',
    created_at: '2026-10-19T10:15:00.000Z',
    updated_at: '2026-10-19T12:00:00.000Z',
    documents: [
      {
        id: 'att-3',
        name: 'UPI_Payment_Screenshot.png',
        size: 650000,
        formattedSize: '650 KB',
        type: 'image/png',
        uploadedAt: '19 Oct 2026',
      },
      {
        id: 'att-4',
        name: 'HRSJM_80G_Certificate_0491.pdf',
        size: 1120000,
        formattedSize: '1.1 MB',
        type: 'application/pdf',
        uploadedAt: '19 Oct 2026',
      },
    ],
  },
  {
    id: 'tkt-003',
    user_id: 'usr-103',
    user: {
      id: 'usr-103',
      full_name: 'Adv. Meenakshi Sundaram',
      email: 'm.sundaram@legalcell.in',
      mobile_number: '+91 94440 12345',
      roles: ['MEMBER'],
    },
    subject: '[Human Rights] Urgent: Illegal Eviction Without Statutory Notice in Slum Ward 14',
    description: `Complainant Information:
- Full Name: Adv. Meenakshi Sundaram
- Mobile: +91 94440 12345
- Email: m.sundaram@legalcell.in
- State: Tamil Nadu
- District: Chennai
- Address: 12, High Court Chambers, Chennai

Details of Concern:
URGENT: Municipal authorities have started demolitions in Ward 14 without statutory 30-day notice under Town & Country Planning Act. 42 families face displacement. Local police station refusing to register complaint. Requesting state chapter official intervention letter and legal delegation.

--- Verified Documents
- Municipal notice copy
- Site photographs`,
    status: 'SUBMITTED',
    category: 'Human Rights',
    priority: 'URGENT',
    source: 'web',
    created_at: '2026-10-24T08:00:00.000Z',
    updated_at: '2026-10-24T08:00:00.000Z',
    documents: [
      {
        id: 'att-5',
        name: 'Demolition_Notice_Ward14.pdf',
        size: 3400000,
        formattedSize: '3.4 MB',
        type: 'application/pdf',
        uploadedAt: '24 Oct 2026',
      },
      {
        id: 'att-6',
        name: 'Site_Photographs_Cluster.jpg',
        size: 4200000,
        formattedSize: '4.2 MB',
        type: 'image/jpeg',
        uploadedAt: '24 Oct 2026',
      },
    ],
  },
  {
    id: 'tkt-004',
    user_id: 'usr-104',
    user: {
      id: 'usr-104',
      full_name: 'Mohammad Farooq',
      email: 'm.farooq@gmail.com',
      mobile_number: '+91 97000 55667',
      roles: ['USER'],
    },
    subject: '[Technical] Unable to update residential address in mobile app profile',
    description: `[Priority: NORMAL]
[Source: App]

When attempting to edit state and district dropdowns in the profile screen, the submit button remains greyed out. Android version 14 on Samsung Galaxy S23. App version 2.1.0.`,
    status: 'SUBMITTED',
    category: 'Technical',
    priority: 'NORMAL',
    source: 'app',
    created_at: '2026-10-26T14:20:00.000Z',
    updated_at: '2026-10-26T14:20:00.000Z',
    documents: [
      {
        id: 'att-7',
        name: 'Screenshot_Error_Profile.png',
        size: 980000,
        formattedSize: '980 KB',
        type: 'image/png',
        uploadedAt: '26 Oct 2026',
      },
    ],
  },
  {
    id: 'tkt-005',
    user_id: 'usr-105',
    user: {
      id: 'usr-105',
      full_name: 'Anjali Sharma',
      email: 'anjali.s@community.org',
      mobile_number: '+91 99887 76655',
      roles: ['MEMBER'],
    },
    subject: '[KYC] Aadhaar verification pending for over 10 working days',
    description: `Complainant Information:
- Full Name: Anjali Sharma
- Mobile: +91 99887 76655
- Email: anjali.s@community.org
- State: Uttar Pradesh
- District: Lucknow
- Address: 56, Hazratganj, Lucknow

Details of Concern:
Aadhaar card upload completed on 12th October. Status still shows "Verification Pending". Please expedite verification so I can participate in upcoming state delegate council elections.`,
    status: 'UNDER_REVIEW',
    category: 'KYC',
    priority: 'HIGH',
    source: 'website',
    created_at: '2026-10-27T16:45:00.000Z',
    updated_at: '2026-10-28T09:10:00.000Z',
    documents: [
      {
        id: 'att-8',
        name: 'Aadhaar_Clear_Scan.pdf',
        size: 1900000,
        formattedSize: '1.9 MB',
        type: 'application/pdf',
        uploadedAt: '27 Oct 2026',
      },
    ],
  },
  {
    id: 'tkt-006',
    user_id: 'usr-106',
    user: {
      id: 'usr-106',
      full_name: 'Vikramaditya Rao',
      email: 'vikram.rao@enterprise.co.in',
      mobile_number: '+91 98450 99881',
      roles: ['MEMBER'],
    },
    subject: '[General] Inquiry regarding annual conclave delegate registration pass',
    description: `Query regarding corporate CSR participation and registration fee exemptions for NGO volunteers in the upcoming National Human Rights Conclave 2026 in New Delhi.`,
    status: 'CLOSED',
    category: 'General',
    priority: 'NORMAL',
    source: 'web',
    resolved_by: 'admin-001',
    resolved_by_user: {
      id: 'admin-001',
      full_name: 'Administrator',
      email: 'admin@hrsjm.org',
    },
    resolved_at: '2026-10-22T17:30:00.000Z',
    resolution_note: 'Provided delegate handbook and special volunteer pass link via email. Query satisfied and closed by user.',
    created_at: '2026-10-21T11:00:00.000Z',
    updated_at: '2026-10-22T17:30:00.000Z',
  },
];

