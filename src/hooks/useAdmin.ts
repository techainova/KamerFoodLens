// src/hooks/useAdmin.ts
import { useState } from 'react';

export type AdminTab = 'dashboard' | 'users' | 'pro' | 'finance' | 'push' | 'settings';

export interface AdminStats {
  activeUsers:    number;
  proAccounts:    number;
  totalRevenue:   number;
  aiScans:        number;
  pendingPro:     number;
  pendingPayouts: number;
}

export interface AdminUser {
  id:     string;
  name:   string;
  email:  string;
  role:   'standard' | 'pro' | 'admin';
  joined: string;
  scans:  number;
  status: 'active' | 'suspended' | 'banned';
}

export interface ProRequest {
  id:           string;
  businessName: string;
  owner:        string;
  type:         string;
  submitted:    string;
  status:       'pending' | 'approved' | 'rejected';
}

const MOCK_STATS: AdminStats = {
  activeUsers: 12847, proAccounts: 342,
  totalRevenue: 4280000, aiScans: 98432,
  pendingPro: 7, pendingPayouts: 3,
};

const MOCK_USERS: AdminUser[] = [
  { id: '1', name: 'Amah Ndongo',    email: 'amah@kmerfoodlens.com', role: 'standard', joined: 'Nov 2026', scans: 1250, status: 'active' },
  { id: '2', name: 'Chef Joelle K.', email: 'joelle@chef.cm',        role: 'pro',      joined: 'Oct 2026', scans: 840,  status: 'active' },
  { id: '3', name: 'Sami Ngo',       email: 'sami@ngo.cm',           role: 'standard', joined: 'Oct 2026', scans: 320,  status: 'suspended' },
];

const MOCK_PRO: ProRequest[] = [
  { id: '1', businessName: 'Resto Le Ndole', owner: 'Paul Mbida', type: 'Restaurant', submitted: 'il y a 2h', status: 'pending' },
  { id: '2', businessName: 'Chef Amina S.',  owner: 'Amina Sow',  type: 'Chef',       submitted: 'il y a 5h', status: 'pending' },
  { id: '3', businessName: 'Ecole Saveurs',  owner: 'Marie T.',   type: 'Ecole',      submitted: 'il y a 1j', status: 'pending' },
];

export function useAdmin() {
  const [tab, setTab]             = useState<AdminTab>('dashboard');
  const [users, setUsers]         = useState<AdminUser[]>(MOCK_USERS);
  const [proRequests, setProRequests] = useState<ProRequest[]>(MOCK_PRO);
  const [searchQuery, setSearchQuery] = useState('');

  function suspendUser(id: string) {
    setUsers((p) => p.map((u) => u.id === id ? { ...u, status: 'suspended' as const } : u));
  }
  function banUser(id: string) {
    setUsers((p) => p.filter((u) => u.id !== id));
  }
  function approvePro(id: string) {
    setProRequests((p) => p.map((r) => r.id === id ? { ...r, status: 'approved' as const } : r));
  }
  function rejectPro(id: string) {
    setProRequests((p) => p.map((r) => r.id === id ? { ...r, status: 'rejected' as const } : r));
  }

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return {
    tab, setTab, stats: MOCK_STATS,
    users: filteredUsers, proRequests,
    searchQuery, setSearchQuery,
    suspendUser, banUser, approvePro, rejectPro,
  };
}