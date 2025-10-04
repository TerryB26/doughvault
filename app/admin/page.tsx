/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import AdminForms from "@/app/components/admin/AdminForms";
import { useRoles, useUserRoles, useUsers } from "@/lib/hooks/useQueries";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { useUserRoles as useAuth } from "@/lib/hooks/useAuth";
import {
  Delete,
  Edit,
  Group,
  PersonAdd,
  Search,
  Security,
  ToggleOff,
  ToggleOn
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Tabs,
  TextField,
  Typography
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import Swal from "sweetalert2";

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
  usercount: number;
  createdon: string;
}

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
  status: "Active" | "Inactive";
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
  status: "Active" | "Inactive";
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
  status: "Active" | "Inactive";
}

const getRoleColor = (role: string): "primary" | "secondary" | "default" => {
  switch (role) {
    case "Manager":
      return "primary";
    case "Staff":
      return "secondary";
    case "Viewer":
      return "default";
    default:
      return "default";
  }
};

const AdminPage = () => {
  const { isAdmin, canEdit, canDelete } = useAuth();
  
  const [tabValue, setTabValue] = useState(0);

  const [userPage, setUserPage] = useState(0);
  const [userRowsPerPage, setUserRowsPerPage] = useState(10);
  const [rolePage, setRolePage] = useState(0);
  const [roleRowsPerPage, setRoleRowsPerPage] = useState(10);
  const [userRolePage, setUserRolePage] = useState(0);
  const [userRoleRowsPerPage, setUserRoleRowsPerPage] = useState(10);

  const [usersOrder, setUsersOrder] = useState<"asc" | "desc">("asc");
  const [usersOrderBy, setUsersOrderBy] = useState<keyof UserWithRole>("name");
  const [rolesOrder, setRolesOrder] = useState<"asc" | "desc">("asc");
  const [rolesOrderBy, setRolesOrderBy] =
    useState<keyof RoleWithUserCount>("rolename");
  const [userRolesOrder, setUserRolesOrder] = useState<"asc" | "desc">("asc");
  const [userRolesOrderBy, setUserRolesOrderBy] =
    useState<keyof UserRoleWithDetails>("username");

  const [addEditModalOpen, setAddEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<
    UserWithRole | RoleWithUserCount | UserRoleWithDetails | null
  >(null);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [modalType, setModalType] = useState<"user" | "role" | "userRole">(
    "user"
  );

  const queryClient = useQueryClient();

  const [userSearch, setUserSearch] = useState("");
  const [roleSearch, setRoleSearch] = useState("");
  const [userRoleSearch, setUserRoleSearch] = useState("");

  const [userStatusFilter, setUserStatusFilter] = useState("all");
  const [roleStatusFilter, setRoleStatusFilter] = useState("all");
  const [userRoleStatusFilter, setUserRoleStatusFilter] = useState("all");

  const {
    data: users = [],
    isLoading: usersLoading,
    error: usersError,
    refetch: usersRefetch,
  } = useUsers();
  const {
    data: roles = [],
    isLoading: rolesLoading,
    error: rolesError,
    refetch: rolesRefetch,
  } = useRoles();
  const {
    data: userRoles = [],
    isLoading: userRolesLoading,
    error: userRolesError,
    refetch: userRolesRefetch,
  } = useUserRoles();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getFilteredUsers = () => {
    return users.filter((user: UserWithRole) => {
      const matchesSearch =
        user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        user.email.toLowerCase().includes(userSearch.toLowerCase()) ||
        user.role.toLowerCase().includes(userSearch.toLowerCase());
      const matchesStatus =
        userStatusFilter === "all" ||
        (userStatusFilter === "active" && user.isactive) ||
        (userStatusFilter === "inactive" && !user.isactive);
      return matchesSearch && matchesStatus;
    });
  };

  const parseValue = (value: unknown, key: string) => {
    if (value === null || value === undefined)
      return "" as unknown as number | string;
    if (key === "lastlogin" || key === "createdon" || key === "assignedon") {
      const t = new Date(String(value)).getTime();
      return isNaN(t) ? 0 : t;
    }
    if (typeof value === "boolean") return value ? 1 : 0;
    if (typeof value === "number") return value;
    return String(value).toLowerCase();
  };

  const getComparator =
    <T, K extends keyof T>(order: "asc" | "desc", orderBy: K) =>
    (a: T, b: T) => {
      const va = parseValue(a[orderBy] as unknown, String(orderBy));
      const vb = parseValue(b[orderBy] as unknown, String(orderBy));
      if (va < vb) return order === "asc" ? -1 : 1;
      if (va > vb) return order === "asc" ? 1 : -1;
      return 0;
    };

  const stableSort = <T,>(array: T[], comparator: (a: T, b: T) => number) => {
    return array
      .map((el, index) => [el, index] as [T, number])
      .sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
      })
      .map((el) => el[0]);
  };

  const handleUsersRequestSort = (property: typeof usersOrderBy) => {
    const isAsc = usersOrderBy === property && usersOrder === "asc";
    setUsersOrder(isAsc ? "desc" : "asc");
    setUsersOrderBy(property);
  };

  const handleRolesRequestSort = (property: typeof rolesOrderBy) => {
    const isAsc = rolesOrderBy === property && rolesOrder === "asc";
    setRolesOrder(isAsc ? "desc" : "asc");
    setRolesOrderBy(property);
  };

  const handleUserRolesRequestSort = (property: typeof userRolesOrderBy) => {
    const isAsc = userRolesOrderBy === property && userRolesOrder === "asc";
    setUserRolesOrder(isAsc ? "desc" : "asc");
    setUserRolesOrderBy(property);
  };

  const getFilteredRoles = () => {
    return roles.filter((role: RoleWithUserCount) => {
      const matchesSearch =
        role.rolename.toLowerCase().includes(roleSearch.toLowerCase()) ||
        (role.roledescription || "")
          .toLowerCase()
          .includes(roleSearch.toLowerCase());
      const matchesStatus =
        roleStatusFilter === "all" ||
        (roleStatusFilter === "active" && role.isactive) ||
        (roleStatusFilter === "inactive" && !role.isactive);
      return matchesSearch && matchesStatus;
    });
  };

  const getFilteredUserRoles = () => {
    return userRoles.filter((userRole: UserRoleWithDetails) => {
      const matchesSearch =
        userRole.username
          .toLowerCase()
          .includes(userRoleSearch.toLowerCase()) ||
        userRole.useremail
          .toLowerCase()
          .includes(userRoleSearch.toLowerCase()) ||
        userRole.rolename.toLowerCase().includes(userRoleSearch.toLowerCase());
      const matchesStatus =
        userRoleStatusFilter === "all" ||
        (userRoleStatusFilter === "active" && userRole.isactive) ||
        (userRoleStatusFilter === "inactive" && !userRole.isactive);
      return matchesSearch && matchesStatus;
    });
  };

  const handleAddClick = async (type: "user" | "role" | "userRole") => {
    setModalType(type);
    setModalMode("add");
    setSelectedItem(null);

    if (type === "user") {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ROLES] });
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
      await queryClient.refetchQueries({ queryKey: [QUERY_KEYS.ROLES] });
      await queryClient.refetchQueries({ queryKey: [QUERY_KEYS.USERS] });
    } else if (type === "role") {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ROLES] });
      await queryClient.refetchQueries({ queryKey: [QUERY_KEYS.ROLES] });
    } else if (type === "userRole") {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ROLES] });
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.USER_ROLES],
      });
      await queryClient.refetchQueries({ queryKey: [QUERY_KEYS.USERS] });
      await queryClient.refetchQueries({ queryKey: [QUERY_KEYS.ROLES] });
      await queryClient.refetchQueries({ queryKey: [QUERY_KEYS.USER_ROLES] });
    }

    setAddEditModalOpen(true);
  };

  const handleEditClick = async (
    item: UserWithRole | RoleWithUserCount | UserRoleWithDetails
  ) => {
    setSelectedItem(item);
    setModalMode("edit");

    if ("userroleid" in item) {
      setModalType("userRole");
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.USER_ROLES],
      });
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ROLES] });
      await queryClient.refetchQueries({ queryKey: [QUERY_KEYS.USER_ROLES] });
      await queryClient.refetchQueries({ queryKey: [QUERY_KEYS.USERS] });
      await queryClient.refetchQueries({ queryKey: [QUERY_KEYS.ROLES] });
    } else if ("roleid" in item && "usercount" in item) {
      setModalType("role");
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ROLES] });
      await queryClient.refetchQueries({ queryKey: [QUERY_KEYS.ROLES] });
    } else if ("userid" in item) {
      setModalType("user");
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ROLES] });
      await queryClient.refetchQueries({ queryKey: [QUERY_KEYS.USERS] });
      await queryClient.refetchQueries({ queryKey: [QUERY_KEYS.ROLES] });
    }

    setAddEditModalOpen(true);
  };

  const handleToggleStatusClick = async (
    item: UserWithRole | RoleWithUserCount | UserRoleWithDetails
  ) => {
    const isRole = "roleid" in item && "usercount" in item;
    const isUserRole = "userroleid" in item;

    let confirmText = "";
    let confirmButton = "";

    if (isRole) {
      confirmText = item.isactive
        ? "This will deactivate the role and disable related assignments."
        : "This will activate the role and re-enable related assignments where applicable.";
      confirmButton = item.isactive ? "Yes, deactivate" : "Yes, activate";
    } else if (isUserRole) {
      confirmText = item.isactive
        ? "This will deactivate the user role assignment."
        : "This will activate the user role assignment.";
      confirmButton = item.isactive ? "Yes, deactivate" : "Yes, activate";
    }

    const result = await Swal.fire({
      title: "Change Status?",
      text: confirmText,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: confirmButton,
    });

    if (result.isConfirmed) {
      try {
        let endpoint = "";
        let itemData = {};

        if (isUserRole) {
          endpoint = "/api/user-roles/actions";
          itemData = {
            action: "toggle_status",
            data: { userRoleId: (item as UserRoleWithDetails).userroleid },
          };
        } else if (isRole) {
          endpoint = "/api/roles/actions";
          itemData = { action: "toggle_status", data: { roleId: item.roleid } };
        }

        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(itemData),
        });

        if (!response.ok) throw new Error("Failed to toggle status");

        await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
        await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ROLES] });
        await queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.USER_ROLES],
        });

        await usersRefetch();
        await rolesRefetch();
        await userRolesRefetch();

        Swal.fire({
          icon: "success",
          title: "Status Updated!",
          text: "Status updated successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to update status. Please try again.",
        });
      }
    }
  };

  const handleDeleteClick = async (
    item: UserWithRole | RoleWithUserCount | UserRoleWithDetails
  ) => {
    const isUserRole = "userroleid" in item;

    const confirmText = isUserRole
      ? "This will permanently remove this role assignment. This action cannot be undone!"
      : "This action cannot be undone!";

    const result = await Swal.fire({
      title: "Are you sure?",
      text: confirmText,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        let endpoint = "";
        let itemData = {};

        if (isUserRole) {
          endpoint = "/api/user-roles/actions";
          itemData = {
            action: "delete",
            data: { userRoleId: (item as UserRoleWithDetails).userroleid },
          };
        } else if ("userid" in item) {
          endpoint = "/api/users/actions";
          itemData = { action: "delete", data: { userId: item.userid } };
        }

        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(itemData),
        });

        if (!response.ok) throw new Error("Failed to delete");

        await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
        await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ROLES] });
        await queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.USER_ROLES],
        });

        await usersRefetch();
        await rolesRefetch();
        await userRolesRefetch();

        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "The item has been deleted successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to delete the item. Please try again.",
        });
      }
    }
  };

  const renderUsersTab = () => {
    if (usersLoading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
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
    const sortedUsers = stableSort<UserWithRole>(
      filteredUsers,
      getComparator(usersOrder, usersOrderBy)
    );
    const paginatedUsers = sortedUsers.slice(
      userPage * userRowsPerPage,
      userPage * userRowsPerPage + userRowsPerPage
    );

    return (
      <>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            👥 Users Management
          </Typography>
          {isAdmin && (
            <Button
              variant="contained"
              startIcon={<PersonAdd />}
              onClick={() => handleAddClick("user")}
              sx={{
                bgcolor: "#d32f2f",
                "&:hover": { bgcolor: "#b71c1c" },
              }}
            >
              Add New User
            </Button>
          )}
        </Box>

        <Box
          sx={{
            mb: 3,
            display: "flex",
            gap: 2,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
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

        <TableContainer
          component={Paper}
          sx={{ boxShadow: 3, borderRadius: 2 }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="users table">
            <TableHead>
              <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                <TableCell
                  sx={{ fontWeight: "bold", fontSize: "1rem" }}
                  sortDirection={usersOrderBy === "name" ? usersOrder : false}
                >
                  <TableSortLabel
                    active={usersOrderBy === "name"}
                    direction={usersOrderBy === "name" ? usersOrder : "asc"}
                    onClick={() => handleUsersRequestSort("name")}
                  >
                    User
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", fontSize: "1rem" }}
                  sortDirection={usersOrderBy === "email" ? usersOrder : false}
                >
                  <TableSortLabel
                    active={usersOrderBy === "email"}
                    direction={usersOrderBy === "email" ? usersOrder : "asc"}
                    onClick={() => handleUsersRequestSort("email")}
                  >
                    Email
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", fontSize: "1rem" }}
                  sortDirection={usersOrderBy === "role" ? usersOrder : false}
                >
                  <TableSortLabel
                    active={usersOrderBy === "role"}
                    direction={usersOrderBy === "role" ? usersOrder : "asc"}
                    onClick={() => handleUsersRequestSort("role")}
                  >
                    Role
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", fontSize: "1rem" }}
                  sortDirection={
                    usersOrderBy === "isactive" ? usersOrder : false
                  }
                >
                  <TableSortLabel
                    active={usersOrderBy === "isactive"}
                    direction={usersOrderBy === "isactive" ? usersOrder : "asc"}
                    onClick={() => handleUsersRequestSort("isactive")}
                  >
                    Status
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", fontSize: "1rem" }}
                  sortDirection={
                    usersOrderBy === "lastlogin" ? usersOrder : false
                  }
                >
                  <TableSortLabel
                    active={usersOrderBy === "lastlogin"}
                    direction={
                      usersOrderBy === "lastlogin" ? usersOrder : "asc"
                    }
                    onClick={() => handleUsersRequestSort("lastlogin")}
                  >
                    Created
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", fontSize: "1rem" }}
                  align="center"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedUsers.map((user: UserWithRole) => (
                <TableRow
                  key={user.userid}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    "&:hover": { bgcolor: "#f9f9f9" },
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar
                        sx={{ bgcolor: "#d32f2f", width: 32, height: 32 }}
                      >
                        {user.name?.charAt(0) || "U"}
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
                      label={user.isactive ? "Active" : "Inactive"}
                      color={user.isactive ? "success" : "error"}
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
                    <Box
                      sx={{ display: "flex", gap: 1, justifyContent: "center" }}
                    >
                      {canEdit && (
                        <IconButton
                          size="small"
                          sx={{ color: "#1976d2" }}
                          title="Edit User"
                          onClick={() => handleEditClick(user)}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      )}
                      {canDelete && (
                        <IconButton
                          size="small"
                          sx={{ color: "#d32f2f" }}
                          title="Delete User"
                          onClick={() => handleDeleteClick(user)}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      )}
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
            Total Users: {users.length} • Active:{" "}
            {users.filter((u: UserWithRole) => u.isactive).length} • Inactive:{" "}
            {users.filter((u: UserWithRole) => !u.isactive).length}
            {userSearch || userStatusFilter !== "all"
              ? ` • Filtered: ${filteredUsers.length}`
              : ""}
          </Typography>
        </Box>
      </>
    );
  };

  const renderRolesTab = () => {
    if (rolesLoading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
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
    const sortedRoles = stableSort<RoleWithUserCount>(
      filteredRoles,
      getComparator(rolesOrder, rolesOrderBy)
    );
    const paginatedRoles = sortedRoles.slice(
      rolePage * roleRowsPerPage,
      rolePage * roleRowsPerPage + roleRowsPerPage
    );

    return (
      <>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            🛡️ Roles Management
          </Typography>
          {isAdmin && (
            <Button
              variant="contained"
              startIcon={<Security />}
              onClick={() => handleAddClick("role")}
              sx={{
                bgcolor: "#d32f2f",
                "&:hover": { bgcolor: "#b71c1c" },
              }}
            >
              Add New Role
            </Button>
          )}
        </Box>

        <Box
          sx={{
            mb: 3,
            display: "flex",
            gap: 2,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
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

        <TableContainer
          component={Paper}
          sx={{ boxShadow: 3, borderRadius: 2 }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="roles table">
            <TableHead>
              <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                <TableCell
                  sx={{ fontWeight: "bold", fontSize: "1rem" }}
                  sortDirection={
                    rolesOrderBy === "rolename" ? rolesOrder : false
                  }
                >
                  <TableSortLabel
                    active={rolesOrderBy === "rolename"}
                    direction={rolesOrderBy === "rolename" ? rolesOrder : "asc"}
                    onClick={() => handleRolesRequestSort("rolename")}
                  >
                    Role Name
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", fontSize: "1rem" }}
                  sortDirection={
                    rolesOrderBy === "roledescription" ? rolesOrder : false
                  }
                >
                  <TableSortLabel
                    active={rolesOrderBy === "roledescription"}
                    direction={
                      rolesOrderBy === "roledescription" ? rolesOrder : "asc"
                    }
                    onClick={() => handleRolesRequestSort("roledescription")}
                  >
                    Description
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", fontSize: "1rem" }}
                  sortDirection={
                    rolesOrderBy === "usercount" ? rolesOrder : false
                  }
                >
                  <TableSortLabel
                    active={rolesOrderBy === "usercount"}
                    direction={
                      rolesOrderBy === "usercount" ? rolesOrder : "asc"
                    }
                    onClick={() => handleRolesRequestSort("usercount")}
                  >
                    Users Count
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", fontSize: "1rem" }}
                  sortDirection={
                    rolesOrderBy === "isactive" ? rolesOrder : false
                  }
                >
                  <TableSortLabel
                    active={rolesOrderBy === "isactive"}
                    direction={rolesOrderBy === "isactive" ? rolesOrder : "asc"}
                    onClick={() => handleRolesRequestSort("isactive")}
                  >
                    Status
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", fontSize: "1rem" }}
                  sortDirection={
                    rolesOrderBy === "createdon" ? rolesOrder : false
                  }
                >
                  <TableSortLabel
                    active={rolesOrderBy === "createdon"}
                    direction={
                      rolesOrderBy === "createdon" ? rolesOrder : "asc"
                    }
                    onClick={() => handleRolesRequestSort("createdon")}
                  >
                    Created
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", fontSize: "1rem" }}
                  align="center"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRoles.map((role: RoleWithUserCount) => (
                <TableRow
                  key={role.roleid}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    "&:hover": { bgcolor: "#f9f9f9" },
                  }}
                >
                  <TableCell>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {role.rolename}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {role.roledescription || "No description available"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {role.usercount} user{role.usercount !== 1 ? "s" : ""}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={role.isactive ? "Active" : "Inactive"}
                      color={role.isactive ? "success" : "error"}
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
                    <Box
                      sx={{ display: "flex", gap: 1, justifyContent: "center" }}
                    >
                      {canEdit && (
                        <IconButton
                          size="small"
                          sx={{ color: "#1976d2" }}
                          title="Edit Role"
                          onClick={() => handleEditClick(role)}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      )}
                      {isAdmin && (
                        <IconButton
                          size="small"
                          sx={{ color: role.isactive ? "#d32f2f" : "#2e7d32" }}
                          title={
                            role.isactive ? "Deactivate Role" : "Activate Role"
                          }
                          onClick={() => handleToggleStatusClick(role)}
                        >
                          {role.isactive ? (
                            <ToggleOff fontSize="small" />
                          ) : (
                            <ToggleOn fontSize="small" />
                          )}
                        </IconButton>
                      )}
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
            Total Roles: {roles.length} • Active:{" "}
            {roles.filter((r: RoleWithUserCount) => r.isactive).length} •
            Inactive:{" "}
            {roles.filter((r: RoleWithUserCount) => !r.isactive).length}
            {roleSearch || roleStatusFilter !== "all"
              ? ` • Filtered: ${filteredRoles.length}`
              : ""}
          </Typography>
        </Box>
      </>
    );
  };

  const renderUserRolesTab = () => {
    if (userRolesLoading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
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
    const sortedUserRoles = stableSort<UserRoleWithDetails>(
      filteredUserRoles,
      getComparator(userRolesOrder, userRolesOrderBy)
    );
    const paginatedUserRoles = sortedUserRoles.slice(
      userRolePage * userRoleRowsPerPage,
      userRolePage * userRoleRowsPerPage + userRoleRowsPerPage
    );

    return (
      <>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            🔗 User Role Assignments
          </Typography>
          {isAdmin && (
            <Button
              variant="contained"
              startIcon={<Group />}
              onClick={() => handleAddClick("userRole")}
              sx={{
                bgcolor: "#d32f2f",
                "&:hover": { bgcolor: "#b71c1c" },
              }}
            >
              Assign Role
            </Button>
          )}
        </Box>

        <Box
          sx={{
            mb: 3,
            display: "flex",
            gap: 2,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
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

        <TableContainer
          component={Paper}
          sx={{ boxShadow: 3, borderRadius: 2 }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="user roles table">
            <TableHead>
              <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                <TableCell
                  sx={{ fontWeight: "bold", fontSize: "1rem" }}
                  sortDirection={
                    userRolesOrderBy === "username" ? userRolesOrder : false
                  }
                >
                  <TableSortLabel
                    active={userRolesOrderBy === "username"}
                    direction={
                      userRolesOrderBy === "username" ? userRolesOrder : "asc"
                    }
                    onClick={() => handleUserRolesRequestSort("username")}
                  >
                    User
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", fontSize: "1rem" }}
                  sortDirection={
                    userRolesOrderBy === "rolename" ? userRolesOrder : false
                  }
                >
                  <TableSortLabel
                    active={userRolesOrderBy === "rolename"}
                    direction={
                      userRolesOrderBy === "rolename" ? userRolesOrder : "asc"
                    }
                    onClick={() => handleUserRolesRequestSort("rolename")}
                  >
                    Role
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", fontSize: "1rem" }}
                  sortDirection={
                    userRolesOrderBy === "assignedon" ? userRolesOrder : false
                  }
                >
                  <TableSortLabel
                    active={userRolesOrderBy === "assignedon"}
                    direction={
                      userRolesOrderBy === "assignedon" ? userRolesOrder : "asc"
                    }
                    onClick={() => handleUserRolesRequestSort("assignedon")}
                  >
                    Assigned Date
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", fontSize: "1rem" }}
                  sortDirection={
                    userRolesOrderBy === "assignedby" ? userRolesOrder : false
                  }
                >
                  <TableSortLabel
                    active={userRolesOrderBy === "assignedby"}
                    direction={
                      userRolesOrderBy === "assignedby" ? userRolesOrder : "asc"
                    }
                    onClick={() => handleUserRolesRequestSort("assignedby")}
                  >
                    Assigned By
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", fontSize: "1rem" }}
                  sortDirection={
                    userRolesOrderBy === "isactive" ? userRolesOrder : false
                  }
                >
                  <TableSortLabel
                    active={userRolesOrderBy === "isactive"}
                    direction={
                      userRolesOrderBy === "isactive" ? userRolesOrder : "asc"
                    }
                    onClick={() => handleUserRolesRequestSort("isactive")}
                  >
                    Status
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", fontSize: "1rem" }}
                  align="center"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedUserRoles.map((userRole: UserRoleWithDetails) => (
                <TableRow
                  key={userRole.userroleid}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    "&:hover": { bgcolor: "#f9f9f9" },
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
                      label={userRole.isactive ? "Active" : "Inactive"}
                      color={userRole.isactive ? "success" : "error"}
                      size="small"
                      sx={{ fontWeight: 500 }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{ display: "flex", gap: 1, justifyContent: "center" }}
                    >
                      {canEdit && (
                        <IconButton
                          size="small"
                          sx={{ color: "#1976d2" }}
                          title="Edit Assignment"
                          onClick={() => handleEditClick(userRole)}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      )}
                      {isAdmin && (
                        <IconButton
                          size="small"
                          sx={{
                            color: userRole.isactive ? "#ed6c02" : "#2e7d32",
                          }}
                          title={
                            userRole.isactive
                              ? "Deactivate Assignment"
                              : "Activate Assignment"
                          }
                          onClick={() => handleToggleStatusClick(userRole)}
                        >
                          {userRole.isactive ? (
                            <ToggleOff fontSize="small" />
                          ) : (
                            <ToggleOn fontSize="small" />
                          )}
                        </IconButton>
                      )}
                      {canDelete && (
                        <IconButton
                          size="small"
                          sx={{ color: "#d32f2f" }}
                          title="Delete Assignment"
                          onClick={() => handleDeleteClick(userRole)}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      )}
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
            Total Assignments: {userRoles.length} • Active:{" "}
            {userRoles.filter((ur: UserRoleWithDetails) => ur.isactive).length}{" "}
            • Inactive:{" "}
            {userRoles.filter((ur: UserRoleWithDetails) => !ur.isactive).length}
            {userRoleSearch || userRoleStatusFilter !== "all"
              ? ` • Filtered: ${filteredUserRoles.length}`
              : ""}
          </Typography>
        </Box>
      </>
    );
  };

  // Show access denied for non-admin users
  if (!isAdmin && canEdit !== undefined) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ mb: 2, color: '#d32f2f' }}>
          ⛔ Access Denied
        </Typography>
        <Typography variant="body1" color="text.secondary">
          You do not have permission to access the Administration panel.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Please contact your administrator if you believe this is an error.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{ fontWeight: "bold", color: "#d32f2f", mb: 3 }}
      >
        🍕 Administration Panel
      </Typography>

      <Paper sx={{ width: "100%", mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 500,
              fontSize: "1rem",
            },
            "& .Mui-selected": {
              color: "#d32f2f !important",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#d32f2f",
            },
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

      <AdminForms
        open={addEditModalOpen}
        onClose={() => setAddEditModalOpen(false)}
        mode={modalMode}
        type={modalType}
        selectedItem={selectedItem}
        users={users || []}
        roles={roles || []}
        onRefetch={{
          users: usersRefetch,
          roles: rolesRefetch,
          userRoles: userRolesRefetch,
        }}
      />
    </Box>
  );
};

export default AdminPage;
