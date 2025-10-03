/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Chip,
  Avatar,
  Button,
  IconButton,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { 
  Edit, 
  Delete, 
  PersonAdd, 
  Security, 
  Group, 
  Search, 
  Add, 
  FilterList 
} from '@mui/icons-material';
import { useUsers, useRoles, useUserRoles } from '@/lib/hooks/useQueries';

// Interface for users with role information returned by getUsersWithRoles
interface UserWithRole {
  userid: number;
  useruuid: string;
  name: string;
  email: string;
  role: string;
  isactive: boolean;
  lastlogin: string;
}

// Interface for roles with user count returned by getRolesWithUserCount
interface RoleWithUserCount {
  roleid: number;
  rolename: string;
  roledescription: string;
  isactive: boolean;
  usercount: number;
  createdon: string;
}

// Interface for user roles with details returned by getUserRolesWithDetails
interface UserRoleWithDetails {
  userroleid: number;
  userid: number;
  username: string;
  useremail: string;
  roleid: number;
  rolename: string;
  assignedon: string;
  assignedby: string;
  isactive: boolean;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
  lastLogin: string;
  avatar?: string;
}

interface Role {
  id: number;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  createdDate: string;
  status: 'Active' | 'Inactive';
}

interface UserRole {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  roleId: number;
  roleName: string;
  assignedDate: string;
  assignedBy: string;
  status: 'Active' | 'Inactive';
}

const dummyUsers: User[] = [
  {
    id: 1,
    name: 'Mario Rossi',
    email: 'mario@pizzashop.com',
    role: 'Manager',
    status: 'Active',
    lastLogin: '2025-10-03 09:15 AM',
    avatar: 'M'
  },
  {
    id: 2,
    name: 'Luigi Verde',
    email: 'luigi@pizzashop.com',
    role: 'Staff',
    status: 'Active',
    lastLogin: '2025-10-03 08:30 AM',
    avatar: 'L'
  },
  {
    id: 3,
    name: 'Anna Bianchi',
    email: 'anna@pizzashop.com',
    role: 'Staff',
    status: 'Active',
    lastLogin: '2025-10-02 06:45 PM',
    avatar: 'A'
  },
  {
    id: 4,
    name: 'Giuseppe Nero',
    email: 'giuseppe@pizzashop.com',
    role: 'Viewer',
    status: 'Inactive',
    lastLogin: '2025-09-28 02:15 PM',
    avatar: 'G'
  },
  {
    id: 5,
    name: 'Francesca Blu',
    email: 'francesca@pizzashop.com',
    role: 'Manager',
    status: 'Active',
    lastLogin: '2025-10-03 07:20 AM',
    avatar: 'F'
  }
];

const dummyRoles: Role[] = [
  {
    id: 1,
    name: 'Admin',
    description: 'Full system access with all permissions',
    permissions: ['Create', 'Read', 'Update', 'Delete', 'Manage Users', 'View Reports'],
    userCount: 1,
    createdDate: '2025-01-15',
    status: 'Active'
  },
  {
    id: 2,
    name: 'Manager',
    description: 'Manage inventory, users, and view reports',
    permissions: ['Read', 'Update', 'Manage Inventory', 'View Reports'],
    userCount: 2,
    createdDate: '2025-01-15',
    status: 'Active'
  },
  {
    id: 3,
    name: 'Staff',
    description: 'Basic inventory operations - view, add, update quantities',
    permissions: ['Read', 'Update Inventory', 'Add Items'],
    userCount: 2,
    createdDate: '2025-01-15',
    status: 'Active'
  },
  {
    id: 4,
    name: 'Viewer',
    description: 'Read-only access to inventory and reports',
    permissions: ['Read'],
    userCount: 1,
    createdDate: '2025-01-15',
    status: 'Inactive'
  }
];

const dummyUserRoles: UserRole[] = [
  {
    id: 1,
    userId: 1,
    userName: 'Mario Rossi',
    userEmail: 'mario@pizzashop.com',
    roleId: 2,
    roleName: 'Manager',
    assignedDate: '2025-02-01',
    assignedBy: 'System Admin',
    status: 'Active'
  },
  {
    id: 2,
    userId: 2,
    userName: 'Luigi Verde',
    userEmail: 'luigi@pizzashop.com',
    roleId: 3,
    roleName: 'Staff',
    assignedDate: '2025-02-15',
    assignedBy: 'Mario Rossi',
    status: 'Active'
  },
  {
    id: 3,
    userId: 3,
    userName: 'Anna Bianchi',
    userEmail: 'anna@pizzashop.com',
    roleId: 3,
    roleName: 'Staff',
    assignedDate: '2025-03-01',
    assignedBy: 'Mario Rossi',
    status: 'Active'
  },
  {
    id: 4,
    userId: 4,
    userName: 'Giuseppe Nero',
    userEmail: 'giuseppe@pizzashop.com',
    roleId: 4,
    roleName: 'Viewer',
    assignedDate: '2025-02-20',
    assignedBy: 'Mario Rossi',
    status: 'Inactive'
  },
  {
    id: 5,
    userId: 5,
    userName: 'Francesca Blu',
    userEmail: 'francesca@pizzashop.com',
    roleId: 2,
    roleName: 'Manager',
    assignedDate: '2025-09-15',
    assignedBy: 'System Admin',
    status: 'Active'
  }
];

const getRoleColor = (role: string): 'primary' | 'secondary' | 'default' => {
  switch (role) {
    case 'Manager': return 'primary';
    case 'Staff': return 'secondary';
    case 'Viewer': return 'default';
    default: return 'default';
  }
};

const getStatusColor = (status: string): 'success' | 'error' => {
  return status === 'Active' ? 'success' : 'error';
};

const AdminPage = () => {
  const [tabValue, setTabValue] = useState(0);

  // Pagination states
  const [userPage, setUserPage] = useState(0);
  const [userRowsPerPage, setUserRowsPerPage] = useState(10);
  const [rolePage, setRolePage] = useState(0);
  const [roleRowsPerPage, setRoleRowsPerPage] = useState(10);
  const [userRolePage, setUserRolePage] = useState(0);
  const [userRoleRowsPerPage, setUserRoleRowsPerPage] = useState(10);

  // Search states
  const [userSearch, setUserSearch] = useState('');
  const [roleSearch, setRoleSearch] = useState('');
  const [userRoleSearch, setUserRoleSearch] = useState('');

  // Filter states
  const [userStatusFilter, setUserStatusFilter] = useState('all');
  const [roleStatusFilter, setRoleStatusFilter] = useState('all');
  const [userRoleStatusFilter, setUserRoleStatusFilter] = useState('all');

  // Modal states
  const [addEditModalOpen, setAddEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<UserWithRole | RoleWithUserCount | UserRoleWithDetails | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('view');

  const { data: users = [], isLoading: usersLoading, error: usersError } = useUsers();
  const { data: roles = [], isLoading: rolesLoading, error: rolesError } = useRoles();
  const { data: userRoles = [], isLoading: userRolesLoading, error: userRolesError } = useUserRoles();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Filter functions
  const getFilteredUsers = () => {
    return users.filter((user: UserWithRole) => {
      const matchesSearch = user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
                           user.email.toLowerCase().includes(userSearch.toLowerCase()) ||
                           user.role.toLowerCase().includes(userSearch.toLowerCase());
      const matchesStatus = userStatusFilter === 'all' || 
                           (userStatusFilter === 'active' && user.isactive) ||
                           (userStatusFilter === 'inactive' && !user.isactive);
      return matchesSearch && matchesStatus;
    });
  };

  const getFilteredRoles = () => {
    return roles.filter((role: RoleWithUserCount) => {
      const matchesSearch = role.rolename.toLowerCase().includes(roleSearch.toLowerCase()) ||
                           (role.roledescription || '').toLowerCase().includes(roleSearch.toLowerCase());
      const matchesStatus = roleStatusFilter === 'all' || 
                           (roleStatusFilter === 'active' && role.isactive) ||
                           (roleStatusFilter === 'inactive' && !role.isactive);
      return matchesSearch && matchesStatus;
    });
  };

  const getFilteredUserRoles = () => {
    return userRoles.filter((userRole: UserRoleWithDetails) => {
      const matchesSearch = userRole.username.toLowerCase().includes(userRoleSearch.toLowerCase()) ||
                           userRole.useremail.toLowerCase().includes(userRoleSearch.toLowerCase()) ||
                           userRole.rolename.toLowerCase().includes(userRoleSearch.toLowerCase());
      const matchesStatus = userRoleStatusFilter === 'all' || 
                           (userRoleStatusFilter === 'active' && userRole.isactive) ||
                           (userRoleStatusFilter === 'inactive' && !userRole.isactive);
      return matchesSearch && matchesStatus;
    });
  };

  // Modal handlers

  const handleAddClick = () => {
    setSelectedItem(null);
    setModalMode('add');
    setAddEditModalOpen(true);
  };

  const handleEditClick = (item: UserWithRole | RoleWithUserCount | UserRoleWithDetails) => {
    setSelectedItem(item);
    setModalMode('edit');
    setAddEditModalOpen(true);
  };

  const renderUsersTab = () => {
    if (usersLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (usersError) {
      return (
        <Alert severity="error" sx={{ m: 2 }}>
          Error loading users: {usersError.message}
        </Alert>
      );
    }

    const filteredUsers = getFilteredUsers();
    const paginatedUsers = filteredUsers.slice(
      userPage * userRowsPerPage,
      userPage * userRowsPerPage + userRowsPerPage
    );

    return (
      <>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            👥 Users Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<PersonAdd />}
            onClick={handleAddClick}
            sx={{ 
              bgcolor: '#d32f2f', 
              '&:hover': { bgcolor: '#b71c1c' }
            }}
          >
            Add New User
          </Button>
        </Box>

        {/* Search and Filters */}
        <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search users..."
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 250 }}
          />
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={userStatusFilter}
              label="Status"
              onChange={(e) => setUserStatusFilter(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
          <Table sx={{ minWidth: 650 }} aria-label="users table">
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>User</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Created</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedUsers.map((user: UserWithRole) => (
                <TableRow
                  key={user.userid}
                  sx={{ 
                    '&:last-child td, &:last-child th': { border: 0 },
                    '&:hover': { bgcolor: '#f9f9f9' }
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: '#d32f2f', width: 32, height: 32 }}>
                        {user.name?.charAt(0) || 'U'}
                      </Avatar>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {user.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {user.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={user.role} 
                      color={getRoleColor(user.role)}
                      size="small"
                      sx={{ fontWeight: 500 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={user.isactive ? 'Active' : 'Inactive'} 
                      color={user.isactive ? 'success' : 'error'}
                      size="small"
                      sx={{ fontWeight: 500 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(user.lastlogin).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <IconButton 
                        size="small" 
                        sx={{ color: '#1976d2' }}
                        title="Edit User"
                        onClick={() => handleEditClick(user)}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        sx={{ color: '#d32f2f' }}
                        title="Delete User"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={userRowsPerPage}
          page={userPage}
          onPageChange={(event, newPage) => setUserPage(newPage)}
          onRowsPerPageChange={(event) => {
            setUserRowsPerPage(parseInt(event.target.value, 10));
            setUserPage(0);
          }}
        />

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" align="center">
            Total Users: {users.length} • Active: {users.filter((u: UserWithRole) => u.isactive).length} • Inactive: {users.filter((u: UserWithRole) => !u.isactive).length}
            {userSearch || userStatusFilter !== 'all' ? ` • Filtered: ${filteredUsers.length}` : ''}
          </Typography>
        </Box>
      </>
    );
  };

  const renderRolesTab = () => {
    if (rolesLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (rolesError) {
      return (
        <Alert severity="error" sx={{ m: 2 }}>
          Error loading roles: {rolesError.message}
        </Alert>
      );
    }

    const filteredRoles = getFilteredRoles();
    const paginatedRoles = filteredRoles.slice(
      rolePage * roleRowsPerPage,
      rolePage * roleRowsPerPage + roleRowsPerPage
    );

    return (
      <>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            🛡️ Roles Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<Security />}
            onClick={handleAddClick}
            sx={{ 
              bgcolor: '#d32f2f', 
              '&:hover': { bgcolor: '#b71c1c' }
            }}
          >
            Add New Role
          </Button>
        </Box>

        {/* Search and Filters */}
        <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search roles..."
            value={roleSearch}
            onChange={(e) => setRoleSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 250 }}
          />
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={roleStatusFilter}
              label="Status"
              onChange={(e) => setRoleStatusFilter(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
          <Table sx={{ minWidth: 650 }} aria-label="roles table">
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Role Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Users Count</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Created</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRoles.map((role: RoleWithUserCount) => (
                <TableRow
                  key={role.roleid}
                  sx={{ 
                    '&:last-child td, &:last-child th': { border: 0 },
                    '&:hover': { bgcolor: '#f9f9f9' }
                  }}
                >
                  <TableCell>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {role.rolename}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {role.roledescription || 'No description available'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {role.usercount} user{role.usercount !== 1 ? 's' : ''}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={role.isactive ? 'Active' : 'Inactive'} 
                      color={role.isactive ? 'success' : 'error'}
                      size="small"
                      sx={{ fontWeight: 500 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(role.createdon).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <IconButton 
                        size="small" 
                        sx={{ color: '#1976d2' }}
                        title="Edit Role"
                        onClick={() => handleEditClick(role)}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        sx={{ color: '#d32f2f' }}
                        title="Delete Role"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredRoles.length}
          rowsPerPage={roleRowsPerPage}
          page={rolePage}
          onPageChange={(event, newPage) => setRolePage(newPage)}
          onRowsPerPageChange={(event) => {
            setRoleRowsPerPage(parseInt(event.target.value, 10));
            setRolePage(0);
          }}
        />

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" align="center">
            Total Roles: {roles.length} • Active: {roles.filter((r: RoleWithUserCount) => r.isactive).length} • Inactive: {roles.filter((r: RoleWithUserCount) => !r.isactive).length}
            {roleSearch || roleStatusFilter !== 'all' ? ` • Filtered: ${filteredRoles.length}` : ''}
          </Typography>
        </Box>
      </>
    );
  };

  const renderUserRolesTab = () => {
    if (userRolesLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (userRolesError) {
      return (
        <Alert severity="error" sx={{ m: 2 }}>
          Error loading user roles: {userRolesError.message}
        </Alert>
      );
    }

    const filteredUserRoles = getFilteredUserRoles();
    const paginatedUserRoles = filteredUserRoles.slice(
      userRolePage * userRoleRowsPerPage,
      userRolePage * userRoleRowsPerPage + userRoleRowsPerPage
    );

    return (
      <>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            🔗 User Role Assignments
          </Typography>
          <Button
            variant="contained"
            startIcon={<Group />}
            onClick={handleAddClick}
            sx={{ 
              bgcolor: '#d32f2f', 
              '&:hover': { bgcolor: '#b71c1c' }
            }}
          >
            Assign Role
          </Button>
        </Box>

        {/* Search and Filters */}
        <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search assignments..."
            value={userRoleSearch}
            onChange={(e) => setUserRoleSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 250 }}
          />
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={userRoleStatusFilter}
              label="Status"
              onChange={(e) => setUserRoleStatusFilter(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
          <Table sx={{ minWidth: 650 }} aria-label="user roles table">
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>User</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Assigned Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Assigned By</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedUserRoles.map((userRole: UserRoleWithDetails) => (
                <TableRow
                  key={userRole.userroleid}
                  sx={{ 
                    '&:last-child td, &:last-child th': { border: 0 },
                    '&:hover': { bgcolor: '#f9f9f9' }
                  }}
                >
                  <TableCell>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {userRole.username}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {userRole.useremail}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={userRole.rolename} 
                      color={getRoleColor(userRole.rolename)}
                      size="small"
                      sx={{ fontWeight: 500 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(userRole.assignedon).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {userRole.assignedby}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={userRole.isactive ? 'Active' : 'Inactive'} 
                      color={userRole.isactive ? 'success' : 'error'}
                      size="small"
                      sx={{ fontWeight: 500 }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <IconButton 
                        size="small" 
                        sx={{ color: '#1976d2' }}
                        title="Edit Assignment"
                        onClick={() => handleEditClick(userRole)}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        sx={{ color: '#d32f2f' }}
                        title="Remove Assignment"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredUserRoles.length}
          rowsPerPage={userRoleRowsPerPage}
          page={userRolePage}
          onPageChange={(event, newPage) => setUserRolePage(newPage)}
          onRowsPerPageChange={(event) => {
            setUserRoleRowsPerPage(parseInt(event.target.value, 10));
            setUserRolePage(0);
          }}
        />

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" align="center">
            Total Assignments: {userRoles.length} • Active: {userRoles.filter((ur: UserRoleWithDetails) => ur.isactive).length} • Inactive: {userRoles.filter((ur: UserRoleWithDetails) => !ur.isactive).length}
            {userRoleSearch || userRoleStatusFilter !== 'all' ? ` • Filtered: ${filteredUserRoles.length}` : ''}
          </Typography>
        </Box>
      </>
    );
  };



  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#d32f2f', mb: 3 }}>
        🍕 Administration Panel
      </Typography>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '1rem'
            },
            '& .Mui-selected': {
              color: '#d32f2f !important'
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#d32f2f'
            }
          }}
        >
          <Tab label="👥 Users" />
          <Tab label="🛡️ Roles" />
          <Tab label="🔗 User Roles" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {tabValue === 0 && renderUsersTab()}
          {tabValue === 1 && renderRolesTab()}
          {tabValue === 2 && renderUserRolesTab()}
        </Box>
      </Paper>



      {/* Add/Edit Modal - Placeholder for now */}
      <Dialog open={addEditModalOpen} onClose={() => setAddEditModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {modalMode === 'add' ? 'Add New' : 'Edit'} {
            tabValue === 0 ? 'User' : 
            tabValue === 1 ? 'Role' : 
            'User Role Assignment'
          }
        </DialogTitle>
        <DialogContent>
          <Typography>Add/Edit form will be implemented here</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddEditModalOpen(false)}>Cancel</Button>
          <Button variant="contained" color="primary">
            {modalMode === 'add' ? 'Add' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminPage;
