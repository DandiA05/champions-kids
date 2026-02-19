"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  DialogContentText,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [userToToggle, setUserToToggle] = useState<User | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "non-admin" as "admin" | "non-admin" | "player",
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      } else {
        setError("Failed to fetch users");
      }
    } catch {
      setError("An error occurred while fetching users");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setIsEditing(true);
      setSelectedUserId(user.id);
      setFormData({
        name: user.name,
        email: user.email,
        password: "", // Password is optional when editing
        role: user.role as "admin" | "non-admin" | "player",
      });
    } else {
      setIsEditing(false);
      setSelectedUserId(null);
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "non-admin",
      });
    }
    setOpenDialog(true);
    setError("");
    setSuccess("");
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setIsEditing(false);
    setSelectedUserId(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "non-admin",
    });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setError("");

    try {
      const url = isEditing
        ? `/api/admin/users/${selectedUserId}`
        : "/api/admin/users";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error || `Failed to ${isEditing ? "update" : "create"} user`,
        );
        setFormLoading(false);
        return;
      }

      setSuccess(`User ${isEditing ? "updated" : "created"} successfully!`);
      handleCloseDialog();
      fetchUsers(); // Refresh the user list
    } catch {
      setError(
        `An error occurred while ${isEditing ? "updating" : "creating"} user`,
      );
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggleStatusClick = (user: User) => {
    setUserToToggle(user);
    setConfirmDialogOpen(true);
  };

  const handleConfirmToggleStatus = async () => {
    if (!userToToggle) return;

    try {
      const res = await fetch(`/api/admin/users/${userToToggle.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !userToToggle.is_active }),
      });

      if (res.ok) {
        setSuccess(
          `User ${!userToToggle.is_active ? "activated" : "deactivated"} successfully`,
        );
        fetchUsers();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to update status");
      }
    } catch {
      setError("An error occurred while updating status");
    } finally {
      setConfirmDialogOpen(false);
      setUserToToggle(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography
          variant="h4"
          fontWeight="800"
          color="black"
          sx={{
            letterSpacing: "-0.02em",
            background: "linear-gradient(45deg, #000, #444)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          User Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            px: 3,
            py: 1,
            fontWeight: "600",
            boxShadow: "0 4px 14px 0 rgba(0,0,0,0.39)",
            "&:hover": {
              boxShadow: "0 6px 20px rgba(0,0,0,0.23)",
            },
          }}
        >
          Add New User
        </Button>
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      )}

      {success && (
        <Alert
          severity="success"
          sx={{
            mb: 3,
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
          onClose={() => setSuccess("")}
        >
          {success}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" p={8}>
          <CircularProgress thickness={5} size={60} />
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: "20px",
            boxShadow: "0 10px 40px -10px rgba(0,0,0,0.1)",
            overflow: "hidden",
            border: "1px solid rgba(0,0,0,0.05)",
          }}
        >
          <Table>
            <TableHead sx={{ bgcolor: "#fafafa" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "700", py: 2.5 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: "700" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: "700" }}>Email</TableCell>
                <TableCell sx={{ fontWeight: "700" }}>Role</TableCell>
                <TableCell sx={{ fontWeight: "700" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: "700" }}>Created At</TableCell>
                <TableCell align="right" sx={{ fontWeight: "700" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={user.id}
                  hover
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{user.id}</TableCell>
                  <TableCell sx={{ fontWeight: "600" }}>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.role}
                      color={user.role === "admin" ? "primary" : "default"}
                      size="small"
                      sx={{ fontWeight: "700", borderRadius: "8px" }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.is_active ? "Active" : "Inactive"}
                      color={user.is_active ? "success" : "error"}
                      variant="outlined"
                      size="small"
                      onClick={() => handleToggleStatusClick(user)}
                      sx={{
                        fontWeight: "700",
                        borderRadius: "8px",
                        cursor: "pointer",
                        "&:hover": {
                          bgcolor: user.is_active
                            ? "success.light"
                            : "error.light",
                          opacity: 0.8,
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: "textSecondary" }}>
                    {formatDate(user.created_at)}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(user)}
                      sx={{
                        "&:hover": { bgcolor: "primary.light", color: "white" },
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add User Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: "24px", p: 1 },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h5" fontWeight="800">
            {isEditing ? "Edit User" : "Add New User"}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {isEditing
              ? "Update account details"
              : "Create a new administrative or player account"}
          </Typography>
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: "12px" }}>
                {error}
              </Alert>
            )}

            <div className="d-flex flex-column gap-4">
              <TextField
                autoFocus
                label="Name"
                type="text"
                fullWidth
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                disabled={formLoading}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />

              <TextField
                label="Email"
                type="email"
                fullWidth
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                disabled={formLoading}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />

              <TextField
                label="Password"
                type="password"
                fullWidth
                required={!isEditing}
                helperText={
                  isEditing
                    ? "Leave blank to keep unchanged (Min 6 characters)"
                    : "Minimum 6 characters"
                }
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                disabled={formLoading}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />

              <FormControl
                fullWidth
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              >
                <InputLabel>Role</InputLabel>
                <Select
                  value={formData.role}
                  label="Role"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      role: e.target.value as "admin" | "non-admin" | "player",
                    })
                  }
                  disabled={formLoading}
                >
                  <MenuItem value="non-admin">Non-Admin</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="player">Player</MenuItem>
                </Select>
              </FormControl>
            </div>
          </DialogContent>

          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={handleCloseDialog}
              disabled={formLoading}
              sx={{
                textTransform: "none",
                fontWeight: "600",
                color: "text.secondary",
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={formLoading}
              sx={{
                borderRadius: "12px",
                px: 4,
                textTransform: "none",
                fontWeight: "600",
                boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
              }}
            >
              {formLoading ? (
                <CircularProgress size={24} />
              ) : isEditing ? (
                "Update User"
              ) : (
                "Create User"
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Status Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        PaperProps={{
          sx: { borderRadius: "20px", p: 1 },
        }}
      >
        <DialogTitle sx={{ fontWeight: "800" }}>
          Confirm Status Change
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to{" "}
            {userToToggle?.is_active ? "deactivate" : "activate"} user{" "}
            <strong>{userToToggle?.name}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setConfirmDialogOpen(false)}
            sx={{
              borderRadius: "10px",
              fontWeight: "600",
              textTransform: "none",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmToggleStatus}
            variant="contained"
            color={userToToggle?.is_active ? "error" : "primary"}
            sx={{
              borderRadius: "10px",
              fontWeight: "600",
              textTransform: "none",
              boxShadow: userToToggle?.is_active
                ? "0 4px 12px rgba(211, 47, 47, 0.3)"
                : "0 4px 12px rgba(25, 118, 210, 0.3)",
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
