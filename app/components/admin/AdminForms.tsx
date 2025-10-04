"use client";

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Box,
  Typography
} from '@mui/material';
import Swal from 'sweetalert2';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/queryKeys';

interface UserWithRole {
  userid: number;
  useruuid: string;
  name: string;
  email: string;
  role: string;
  isactive: boolean;
  lastlogin: string;
}

interface RoleWithUserCount {
  roleid: number;
  rolename: string;
  roledescription: string;
  isactive: boolean;
  createdon: string;
  usercount: number;
}

interface UserRoleWithDetails {
  userroleid: number;
  userid: number;
  roleid: number;
  username: string;
  useremail: string;
  rolename: string;
  isactive: boolean;
  assignedon: string;
  assignedby: string;
}

interface AdminFormsProps {
  open: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  type: 'user' | 'role' | 'userRole';
  selectedItem?: UserWithRole | RoleWithUserCount | UserRoleWithDetails | null;
  users?: UserWithRole[];
  roles?: RoleWithUserCount[];
  onRefetch?: {
    users: () => void;
    roles: () => void;
    userRoles: () => void;
  };
}

const AdminForms: React.FC<AdminFormsProps> = ({
  open,
  onClose,
  mode,
  type,
  selectedItem,
  users = [],
  roles = [],
  onRefetch
}) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    role: '',
    isactive: true
  });

  const [roleForm, setRoleForm] = useState({
    rolename: '',
    roledescription: '',
    isactive: true
  });

  const [userRoleForm, setUserRoleForm] = useState({
    userid: '',
    roleid: '',
    isactive: true
  });

  useEffect(() => {
    console.log('AdminForms useEffect triggered:', { mode, type, selectedItem, open });
    
    if (mode === 'edit' && selectedItem && open) {
      if (type === 'userRole') {
        console.log('Setting userRole form, selectedItem:', selectedItem);
        const userRole = selectedItem as UserRoleWithDetails;
        const formData = {
          userid: userRole.userid?.toString() || '',
          roleid: userRole.roleid?.toString() || '',
          isactive: userRole.isactive ?? true
        };
        console.log('UserRole form data:', formData);
        setUserRoleForm(formData);
      } else if (type === 'role') {
        const role = selectedItem as RoleWithUserCount;
        setRoleForm({
          rolename: role.rolename || '',
          roledescription: role.roledescription || '',
          isactive: role.isactive ?? true
        });
      } else if (type === 'user') {
        const user = selectedItem as UserWithRole;
        const roleValue = user.role === 'No Role' ? '' : user.role;
        setUserForm({
          name: user.name || '',
          email: user.email || '',
          role: roleValue,
          isactive: user.isactive ?? true
        });
      }
    } else if (!open || mode === 'add') {
      setUserForm({ name: '', email: '', role: '', isactive: true });
      setRoleForm({ rolename: '', roledescription: '', isactive: true });
      setUserRoleForm({ userid: '', roleid: '', isactive: true });
    }
  }, [mode, selectedItem, type, open]);

  const handleUserSubmit = async () => {
    if (!userForm.name || !userForm.email) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill in all required fields (Name and Email)'
      });
      return;
    }

    setLoading(true);
    try {
      const action = mode === 'add' ? 'add' : 'edit';
      
      const nameParts = userForm.name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      const payload = {
        action,
        email: userForm.email,
        firstName,
        lastName,
        role: userForm.role,
        isActive: userForm.isactive,
        ...(mode === 'edit' && { userId: (selectedItem as UserWithRole).userid })
      };

      const response = await fetch('/api/users/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: payload.action, data: payload })
      });

      if (!response.ok) throw new Error('Failed to save user');

      const result = await response.json();

      if (mode === 'add' && userForm.role && result.user?.userid) {
        const selectedRole = roles.find(r => r.rolename === userForm.role);
        if (selectedRole) {
          const userRoleResponse = await fetch('/api/user-roles/actions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'add',
              data: {
                userId: result.user.userid,
                roleId: selectedRole.roleid,
                isActive: true
              }
            })
          });

          if (!userRoleResponse.ok) {
            console.error('Failed to assign role to user');
          }
        }
      }

      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER_ROLES] });

      if (onRefetch) {
        await onRefetch.users();
        await onRefetch.userRoles();
      }

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: `User ${mode === 'add' ? 'created' : 'updated'} successfully`,
        timer: 2000,
        showConfirmButton: false
      });

      onClose();
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Failed to ${mode} user. Please try again.`
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSubmit = async () => {
    if (!roleForm.rolename) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please enter a role name'
      });
      return;
    }

    setLoading(true);
    try {
      const action = mode === 'add' ? 'add' : 'edit';
      
      const payload = {
        action,
        roleName: roleForm.rolename,
        roleDescription: roleForm.roledescription,
        isActive: roleForm.isactive,
        ...(mode === 'edit' && { roleId: (selectedItem as RoleWithUserCount).roleid })
      };

      const response = await fetch('/api/roles/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: payload.action, data: payload })
      });

      if (!response.ok) throw new Error('Failed to save role');

      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ROLES] });
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER_ROLES] });

      if (onRefetch) {
        await onRefetch.roles();
        await onRefetch.userRoles();
      }

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: `Role ${mode === 'add' ? 'created' : 'updated'} successfully`,
        timer: 2000,
        showConfirmButton: false
      });

      onClose();
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Failed to ${mode} role. Please try again.`
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUserRoleSubmit = async () => {
    if (!userRoleForm.userid || !userRoleForm.roleid) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please select both user and role'
      });
      return;
    }

    setLoading(true);
    try {
      const action = mode === 'add' ? 'add' : 'edit';
      
      const payload = {
        action,
        userId: parseInt(userRoleForm.userid),
        roleId: parseInt(userRoleForm.roleid),
        isActive: userRoleForm.isactive,
        ...(mode === 'edit' && { userRoleId: (selectedItem as UserRoleWithDetails).userroleid })
      };

      const response = await fetch('/api/user-roles/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: payload.action, data: payload })
      });

      if (!response.ok) throw new Error('Failed to save user role assignment');

      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER_ROLES] });

      if (onRefetch) {
        await onRefetch.users();
        await onRefetch.roles();
        await onRefetch.userRoles();
      }

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: `User role assignment ${mode === 'add' ? 'created' : 'updated'} successfully`,
        timer: 2000,
        showConfirmButton: false
      });

      onClose();
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Failed to ${mode} user role assignment. Please try again.`
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (type === 'user') handleUserSubmit();
    else if (type === 'role') handleRoleSubmit();
    else if (type === 'userRole') handleUserRoleSubmit();
  };

  const getTitle = () => {
    const action = mode === 'add' ? 'Add' : 'Edit';
    if (type === 'user') return `${action} User`;
    if (type === 'role') return `${action} Role`;
    if (type === 'userRole') return `${action} User Role Assignment`;
    return action;
  };

  const renderUserForm = () => (
    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        fullWidth
        label="Full Name"
        value={userForm.name}
        onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
        required
      />
      <TextField
        fullWidth
        label="Email"
        type="email"
        value={userForm.email}
        onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
        required
      />
      <FormControl fullWidth>
        <InputLabel>Role</InputLabel>
        <Select
          value={userForm.role}
          label="Role"
          onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
        >
          <MenuItem value="">
            <em>No Role</em>
          </MenuItem>
          {roles.filter(r => r.isactive).map((r) => (
            <MenuItem key={r.roleid} value={r.rolename}>
              {r.rolename}
            </MenuItem>
          ))}
          {roles.filter(r => r.isactive).length === 0 && (
            <MenuItem disabled value="">
              No active roles available
            </MenuItem>
          )}
        </Select>
      </FormControl>
      <FormControlLabel
        control={
          <Switch
            checked={userForm.isactive}
            onChange={(e) => setUserForm({ ...userForm, isactive: e.target.checked })}
          />
        }
        label="Active"
      />
    </Box>
  );

  const renderRoleForm = () => (
    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        fullWidth
        label="Role Name"
        value={roleForm.rolename}
        onChange={(e) => setRoleForm({ ...roleForm, rolename: e.target.value })}
        required
      />
      <TextField
        fullWidth
        label="Description"
        multiline
        rows={3}
        value={roleForm.roledescription}
        onChange={(e) => setRoleForm({ ...roleForm, roledescription: e.target.value })}
      />
      <FormControlLabel
        control={
          <Switch
            checked={roleForm.isactive}
            onChange={(e) => setRoleForm({ ...roleForm, isactive: e.target.checked })}
          />
        }
        label="Active"
      />
    </Box>
  );

  const renderUserRoleForm = () => (
    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <FormControl fullWidth required>
        <InputLabel>User</InputLabel>
        <Select
          value={userRoleForm.userid}
          label="User"
          onChange={(e) => setUserRoleForm({ ...userRoleForm, userid: e.target.value })}
        >
          {users.map((user) => (
            <MenuItem key={user.userid} value={user.userid.toString()}>
              {user.name} ({user.email})
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth required>
        <InputLabel>Role</InputLabel>
        <Select
          value={userRoleForm.roleid}
          label="Role"
          onChange={(e) => setUserRoleForm({ ...userRoleForm, roleid: e.target.value })}
        >
          {roles.filter(role => role.isactive).map((role) => (
            <MenuItem key={role.roleid} value={role.roleid.toString()}>
              {role.rolename}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControlLabel
        control={
          <Switch
            checked={userRoleForm.isactive}
            onChange={(e) => setUserRoleForm({ ...userRoleForm, isactive: e.target.checked })}
          />
        }
        label="Active"
      />
    </Box>
  );

  const renderForm = () => {
    if (type === 'user') return renderUserForm();
    if (type === 'role') return renderRoleForm();
    if (type === 'userRole') return renderUserRoleForm();
    return null;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography component="span" variant="h6">{getTitle()}</Typography>
      </DialogTitle>
      <DialogContent>
        {renderForm()}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={loading}
        >
          {loading ? 'Saving...' : (mode === 'add' ? 'Create' : 'Update')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdminForms;
