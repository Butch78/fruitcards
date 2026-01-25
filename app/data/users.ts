export interface UserItem {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "Admin" | "Member" | "Owner";
  status: "Active" | "Invited" | "Inactive";
  lastLogin: string;
}

export const users: UserItem[] = [
  {
    id: 'usr-001',
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
    role: 'Admin',
    status: 'Active',
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: 'usr-002',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    role: 'Member',
    status: 'Active',
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), // 1 day ago
  },
  {
    id: 'usr-003',
    name: 'Peter Jones',
    email: 'peter.jones@example.com',
    avatar: 'https://i.pravatar.cc/150?u=a04258114e29026702d',
    role: 'Member',
    status: 'Invited',
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
  },
  {
    id: 'usr-004',
    name: 'Mary Williams',
    email: 'mary.williams@example.com',
    avatar: 'https://i.pravatar.cc/150?u=a048581f4e29026701d',
    role: 'Owner',
    status: 'Active',
    lastLogin: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
  },
  {
    id: 'usr-005',
    name: 'David Brown',
    email: 'david.brown@example.com',
    avatar: 'https://i.pravatar.cc/150?u=a092581f4e29026705d',
    role: 'Member',
    status: 'Inactive',
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), // 30 days ago
  },
  {
    id: 'usr-006',
    name: 'Sarah Miller',
    email: 'sarah.miller@example.com',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026706d',
    role: 'Member',
    status: 'Active',
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
  },
  {
    id: 'usr-007',
    name: 'Chris Wilson',
    email: 'chris.wilson@example.com',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026707d',
    role: 'Member',
    status: 'Active',
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
  },
  {
    id: 'usr-008',
    name: 'Jessica Taylor',
    email: 'jessica.taylor@example.com',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026708d',
    role: 'Member',
    status: 'Invited',
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), // 10 days ago
  },
  {
    id: 'usr-009',
    name: 'Michael Martinez',
    email: 'michael.martinez@example.com',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026709d',
    role: 'Admin',
    status: 'Active',
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(), // 1 hour ago
  },
  {
    id: 'usr-010',
    name: 'Emily Anderson',
    email: 'emily.anderson@example.com',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026710d',
    role: 'Member',
    status: 'Inactive',
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(), // 60 days ago
  },
  {
    id: 'usr-011',
    name: 'Robert Davis',
    email: 'robert.davis@example.com',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026711d',
    role: 'Member',
    status: 'Active',
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
  },
  {
    id: 'usr-012',
    name: 'Linda White',
    email: 'linda.white@example.com',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026712d',
    role: 'Member',
    status: 'Invited',
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), // 1 day ago
  },
  {
    id: 'usr-013',
    name: 'James Rodriguez',
    email: 'james.rodriguez@example.com',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026713d',
    role: 'Owner',
    status: 'Active',
    lastLogin: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
  },
  {
    id: 'usr-014',
    name: 'Patricia Garcia',
    email: 'patricia.garcia@example.com',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026714d',
    role: 'Admin',
    status: 'Active',
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(), // 4 days ago
  },
  {
    id: 'usr-015',
    name: 'Daniel Lee',
    email: 'daniel.lee@example.com',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026715d',
    role: 'Member',
    status: 'Inactive',
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(), // 90 days ago
  },
  {
    id: 'usr-016',
    name: 'Nancy Hall',
    email: 'nancy.hall@example.com',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026716d',
    role: 'Member',
    status: 'Active',
    lastLogin: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
  },
  {
    id: 'usr-017',
    name: 'Charles Moore',
    email: 'charles.moore@example.com',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026717d',
    role: 'Member',
    status: 'Invited',
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
  },
  {
    id: 'usr-018',
    name: 'Karen Clark',
    email: 'karen.clark@example.com',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026718d',
    role: 'Member',
    status: 'Active',
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
  },
  {
    id: 'usr-019',
    name: 'Thomas Lewis',
    email: 'thomas.lewis@example.com',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026719d',
    role: 'Admin',
    status: 'Inactive',
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 50).toISOString(), // 50 days ago
  },
  {
    id: 'usr-020',
    name: 'Betty King',
    email: 'betty.king@example.com',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026720d',
    role: 'Member',
    status: 'Active',
    lastLogin: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
  },
];