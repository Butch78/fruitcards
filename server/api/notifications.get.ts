import type { Notification } from '~/types'

const demoNotifications: Notification[] = [
  {
    id: 1,
    unread: true,
    sender: {
      id: 1,
      name: 'Lindsay Walton',
      email: 'lindsay.walton@example.com',
      status: 'Active',
      lastLogin: '2025-09-23',
      amount: 1200.5,
      imageUrl: 'https://randomuser.me/api/portraits/women/1.jpg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    body: 'You have a new message from Lindsay regarding the project update.',
    date: new Date(Date.now() - 5 * 60000).toISOString() // 5 minutes ago
  },
  {
    id: 2,
    unread: true,
    sender: {
      id: 3,
      name: 'Tom Cook',
      email: 'tom.cook@example.com',
      status: 'Active',
      lastLogin: '2025-09-22',
      amount: 1100.75,
      imageUrl: 'https://randomuser.me/api/portraits/men/3.jpg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    body: 'Your dashboard report is ready. Check the latest analytics.',
    date: new Date(Date.now() - 2 * 3600000).toISOString() // 2 hours ago
  },
  {
    id: 3,
    unread: false,
    sender: {
      id: 2,
      name: 'Courtney Henry',
      email: 'courtney.henry@example.com',
      status: 'Inactive',
      lastLogin: '2025-08-15',
      amount: 950.0,
      imageUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    body: 'Courtney has shared a document with you.',
    date: new Date(Date.now() - 24 * 3600000).toISOString() // 1 day ago
  },
  {
    id: 4,
    unread: false,
    sender: {
      id: 4,
      name: 'Jada Christiansen',
      email: 'jada.christiansen@example.com',
      status: 'Active',
      lastLogin: '2025-09-21',
      amount: 850.25,
      imageUrl: 'https://randomuser.me/api/portraits/women/4.jpg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    body: 'Your team invitation was accepted.',
    date: new Date(Date.now() - 2 * 24 * 3600000).toISOString() // 2 days ago
  },
  {
    id: 5,
    unread: true,
    sender: {
      id: 5,
      name: 'Michael Johnson',
      email: 'michael.johnson@example.com',
      status: 'Active',
      lastLogin: '2025-12-08',
      amount: 1450.0,
      imageUrl: 'https://randomuser.me/api/portraits/men/5.jpg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    body: 'New project assignment: Q4 Marketing Campaign.',
    date: new Date(Date.now() - 15 * 60000).toISOString() // 15 minutes ago
  },
  {
    id: 6,
    unread: true,
    sender: {
      id: 6,
      name: 'Sarah Williams',
      email: 'sarah.williams@example.com',
      status: 'Active',
      lastLogin: '2025-12-08',
      amount: 1350.75,
      imageUrl: 'https://randomuser.me/api/portraits/women/6.jpg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    body: 'Review completed on your budget proposal.',
    date: new Date(Date.now() - 45 * 60000).toISOString() // 45 minutes ago
  },
  {
    id: 7,
    unread: true,
    sender: {
      id: 7,
      name: 'James Brown',
      email: 'james.brown@example.com',
      status: 'Active',
      lastLogin: '2025-12-07',
      amount: 975.50,
      imageUrl: 'https://randomuser.me/api/portraits/men/7.jpg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    body: 'Meeting reminder: Team sync at 2 PM today.',
    date: new Date(Date.now() - 1 * 3600000).toISOString() // 1 hour ago
  },
  {
    id: 8,
    unread: false,
    sender: {
      id: 8,
      name: 'Emma Davis',
      email: 'emma.davis@example.com',
      status: 'Active',
      lastLogin: '2025-12-08',
      amount: 1125.25,
      imageUrl: 'https://randomuser.me/api/portraits/women/8.jpg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    body: 'Your expense report has been approved.',
    date: new Date(Date.now() - 3 * 3600000).toISOString() // 3 hours ago
  },
  {
    id: 9,
    unread: false,
    sender: {
      id: 9,
      name: 'David Martinez',
      email: 'david.martinez@example.com',
      status: 'Inactive',
      lastLogin: '2025-11-30',
      amount: 800.0,
      imageUrl: 'https://randomuser.me/api/portraits/men/9.jpg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    body: 'Project deadline extended to December 20th.',
    date: new Date(Date.now() - 4 * 3600000).toISOString() // 4 hours ago
  },
  {
    id: 10,
    unread: false,
    sender: {
      id: 10,
      name: 'Lisa Anderson',
      email: 'lisa.anderson@example.com',
      status: 'Active',
      lastLogin: '2025-12-08',
      amount: 1300.0,
      imageUrl: 'https://randomuser.me/api/portraits/women/10.jpg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    body: 'New collaboration request from the design team.',
    date: new Date(Date.now() - 6 * 3600000).toISOString() // 6 hours ago
  },
  {
    id: 11,
    unread: false,
    sender: {
      id: 11,
      name: 'Robert Wilson',
      email: 'robert.wilson@example.com',
      status: 'Active',
      lastLogin: '2025-12-07',
      amount: 1050.0,
      imageUrl: 'https://randomuser.me/api/portraits/men/11.jpg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    body: 'Quarterly performance review scheduled for next week.',
    date: new Date(Date.now() - 12 * 3600000).toISOString() // 12 hours ago
  },
  {
    id: 12,
    unread: false,
    sender: {
      id: 12,
      name: 'Jennifer Taylor',
      email: 'jennifer.taylor@example.com',
      status: 'Active',
      lastLogin: '2025-12-06',
      amount: 1175.50,
      imageUrl: 'https://randomuser.me/api/portraits/women/12.jpg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    body: 'Budget allocation for Q1 2026 has been approved.',
    date: new Date(Date.now() - 24 * 3600000).toISOString() // 1 day ago
  },
  {
    id: 13,
    unread: false,
    sender: {
      id: 13,
      name: 'Christopher Lee',
      email: 'christopher.lee@example.com',
      status: 'Inactive',
      lastLogin: '2025-12-01',
      amount: 925.0,
      imageUrl: 'https://randomuser.me/api/portraits/men/13.jpg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    body: 'System maintenance completed successfully.',
    date: new Date(Date.now() - 2 * 24 * 3600000).toISOString() // 2 days ago
  },
  {
    id: 14,
    unread: false,
    sender: {
      id: 14,
      name: 'Michelle Garcia',
      email: 'michelle.garcia@example.com',
      status: 'Active',
      lastLogin: '2025-12-08',
      amount: 1250.75,
      imageUrl: 'https://randomuser.me/api/portraits/women/14.jpg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    body: 'New training module available for all team members.',
    date: new Date(Date.now() - 3 * 24 * 3600000).toISOString() // 3 days ago
  },
  {
    id: 15,
    unread: false,
    sender: {
      id: 15,
      name: 'Daniel Rodriguez',
      email: 'daniel.rodriguez@example.com',
      status: 'Active',
      lastLogin: '2025-12-07',
      amount: 1075.0,
      imageUrl: 'https://randomuser.me/api/portraits/men/15.jpg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    body: 'Client feedback received on the latest proposal.',
    date: new Date(Date.now() - 4 * 24 * 3600000).toISOString() // 4 days ago
  },
  {
    id: 16,
    unread: false,
    sender: {
      id: 16,
      name: 'Karen White',
      email: 'karen.white@example.com',
      status: 'Active',
      lastLogin: '2025-12-06',
      amount: 1400.0,
      imageUrl: 'https://randomuser.me/api/portraits/women/16.jpg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    body: 'Year-end party details have been finalized.',
    date: new Date(Date.now() - 5 * 24 * 3600000).toISOString() // 5 days ago
  },
  {
    id: 17,
    unread: false,
    sender: {
      id: 17,
      name: 'Kevin Thompson',
      email: 'kevin.thompson@example.com',
      status: 'Inactive',
      lastLogin: '2025-11-28',
      amount: 850.25,
      imageUrl: 'https://randomuser.me/api/portraits/men/17.jpg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    body: 'Feedback on Q4 performance metrics requested.',
    date: new Date(Date.now() - 6 * 24 * 3600000).toISOString() // 6 days ago
  },
  {
    id: 18,
    unread: false,
    sender: {
      id: 18,
      name: 'Patricia Martin',
      email: 'patricia.martin@example.com',
      status: 'Active',
      lastLogin: '2025-12-05',
      amount: 1225.0,
      imageUrl: 'https://randomuser.me/api/portraits/women/18.jpg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    body: 'Updated security protocols are now in effect.',
    date: new Date(Date.now() - 7 * 24 * 3600000).toISOString() // 7 days ago
  },
  {
    id: 19,
    unread: false,
    sender: {
      id: 19,
      name: 'Mark Jackson',
      email: 'mark.jackson@example.com',
      status: 'Active',
      lastLogin: '2025-12-04',
      amount: 975.75,
      imageUrl: 'https://randomuser.me/api/portraits/men/19.jpg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    body: 'Infrastructure upgrades scheduled for December 15th.',
    date: new Date(Date.now() - 8 * 24 * 3600000).toISOString() // 8 days ago
  },
  {
    id: 20,
    unread: false,
    sender: {
      id: 20,
      name: 'Susan Harris',
      email: 'susan.harris@example.com',
      status: 'Active',
      lastLogin: '2025-12-08',
      amount: 1350.0,
      imageUrl: 'https://randomuser.me/api/portraits/women/20.jpg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    body: 'Monthly team meeting notes are ready for review.',
    date: new Date(Date.now() - 9 * 24 * 3600000).toISOString() // 9 days ago
  },
  {
    id: 21,
    unread: false,
    sender: {
      id: 21,
      name: 'Andrew Clark',
      email: 'andrew.clark@example.com',
      status: 'Inactive',
      lastLogin: '2025-11-25',
      amount: 800.50,
      imageUrl: 'https://randomuser.me/api/portraits/men/21.jpg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    body: 'Vendor contract negotiations finalized.',
    date: new Date(Date.now() - 10 * 24 * 3600000).toISOString() // 10 days ago
  },
  {
    id: 22,
    unread: false,
    sender: {
      id: 22,
      name: 'Nancy Lewis',
      email: 'nancy.lewis@example.com',
      status: 'Active',
      lastLogin: '2025-12-03',
      amount: 1100.0,
      imageUrl: 'https://randomuser.me/api/portraits/women/22.jpg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    body: 'New product launch timeline has been confirmed.',
    date: new Date(Date.now() - 11 * 24 * 3600000).toISOString() // 11 days ago
  },
  {
    id: 23,
    unread: false,
    sender: {
      id: 23,
      name: 'Timothy Walker',
      email: 'timothy.walker@example.com',
      status: 'Active',
      lastLogin: '2025-12-02',
      amount: 950.25,
      imageUrl: 'https://randomuser.me/api/portraits/men/23.jpg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    body: 'Compliance audit results are now available.',
    date: new Date(Date.now() - 12 * 24 * 3600000).toISOString() // 12 days ago
  },
  {
    id: 24,
    unread: false,
    sender: {
      id: 24,
      name: 'Elizabeth Hall',
      email: 'elizabeth.hall@example.com',
      status: 'Active',
      lastLogin: '2025-12-08',
      amount: 1300.75,
      imageUrl: 'https://randomuser.me/api/portraits/women/24.jpg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    body: 'Strategic planning session scheduled for next month.',
    date: new Date(Date.now() - 13 * 24 * 3600000).toISOString() // 13 days ago
  },
  {
    id: 25,
    unread: false,
    sender: {
      id: 25,
      name: 'Steven Allen',
      email: 'steven.allen@example.com',
      status: 'Active',
      lastLogin: '2025-12-01',
      amount: 1175.0,
      imageUrl: 'https://randomuser.me/api/portraits/men/25.jpg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    body: 'Archive of past communications has been completed.',
    date: new Date(Date.now() - 14 * 24 * 3600000).toISOString() // 14 days ago
  }
]

export default defineEventHandler(async () => {
  return demoNotifications
})
