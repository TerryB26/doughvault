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
  Tab
} from '@mui/material';
import { Edit, Delete, PersonAdd, Security, Group } from '@mui/icons-material';

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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const renderUsersTab = () => (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          👥 Users Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<PersonAdd />}
          sx={{ 
            bgcolor: '#d32f2f', 
            '&:hover': { bgcolor: '#b71c1c' }
          }}
        >
          Add New User
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="users table">
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>User</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Role</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Last Login</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dummyUsers.map((user) => (
              <TableRow
                key={user.id}
                sx={{ 
                  '&:last-child td, &:last-child th': { border: 0 },
                  '&:hover': { bgcolor: '#f9f9f9' }
                }}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: '#d32f2f', width: 32, height: 32 }}>
                      {user.avatar}
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
                    label={user.status} 
                    color={getStatusColor(user.status)}
                    size="small"
                    sx={{ fontWeight: 500 }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {user.lastLogin}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <IconButton 
                      size="small" 
                      sx={{ color: '#1976d2' }}
                      title="Edit User"
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

      <Box sx={{ mt: 3 }}>
        <Typography variant="body2" color="text.secondary" align="center">
          Total Users: {dummyUsers.length} • Active: {dummyUsers.filter(u => u.status === 'Active').length} • Inactive: {dummyUsers.filter(u => u.status === 'Inactive').length}
        </Typography>
      </Box>
    </>
  );

  const renderRolesTab = () => (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          🛡️ Roles Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Security />}
          sx={{ 
            bgcolor: '#d32f2f', 
            '&:hover': { bgcolor: '#b71c1c' }
          }}
        >
          Add New Role
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="roles table">
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Role Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Permissions</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Users Count</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dummyRoles.map((role) => (
              <TableRow
                key={role.id}
                sx={{ 
                  '&:last-child td, &:last-child th': { border: 0 },
                  '&:hover': { bgcolor: '#f9f9f9' }
                }}
              >
                <TableCell>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {role.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {role.description}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {role.permissions.slice(0, 3).map((permission, index) => (
                      <Chip
                        key={index}
                        label={permission}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    ))}
                    {role.permissions.length > 3 && (
                      <Chip
                        label={`+${role.permissions.length - 3}`}
                        size="small"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {role.userCount} user{role.userCount !== 1 ? 's' : ''}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={role.status} 
                    color={getStatusColor(role.status)}
                    size="small"
                    sx={{ fontWeight: 500 }}
                  />
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <IconButton 
                      size="small" 
                      sx={{ color: '#1976d2' }}
                      title="Edit Role"
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
    </>
  );

  const renderUserRolesTab = () => (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          🔗 User Role Assignments
        </Typography>
        <Button
          variant="contained"
          startIcon={<Group />}
          sx={{ 
            bgcolor: '#d32f2f', 
            '&:hover': { bgcolor: '#b71c1c' }
          }}
        >
          Assign Role
        </Button>
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
            {dummyUserRoles.map((userRole) => (
              <TableRow
                key={userRole.id}
                sx={{ 
                  '&:last-child td, &:last-child th': { border: 0 },
                  '&:hover': { bgcolor: '#f9f9f9' }
                }}
              >
                <TableCell>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {userRole.userName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {userRole.userEmail}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={userRole.roleName} 
                    color={getRoleColor(userRole.roleName)}
                    size="small"
                    sx={{ fontWeight: 500 }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(userRole.assignedDate).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {userRole.assignedBy}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={userRole.status} 
                    color={getStatusColor(userRole.status)}
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
    </>
  );

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
    </Box>
  );
};

export default AdminPage;
