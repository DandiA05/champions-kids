"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Avatar,
  CircularProgress,
  Alert,
  Chip,
  TablePagination,
  InputAdornment,
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import {
  CldUploadWidget,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";

interface StaffMember {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  role: string;
  photo_url: string;
  description: string;
  created_at: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const initialStaffState = {
  user_id: "",
  photo_url: "",
  description: "",
};

export default function StaffManagementPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dialog State
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedStaff, setSelectedStaff] = useState<any>(initialStaffState);
  const [searchQuery, setSearchQuery] = useState("");

  // Photo Preview State
  const [previewImageOpen, setPreviewImageOpen] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [staffRes, usersRes] = await Promise.all([
        fetch("/api/admin/staff"),
        fetch("/api/admin/users"),
      ]);

      const staffData = await staffRes.json();
      const usersData = await usersRes.json();

      if (staffRes.ok || usersRes.ok) {
        setStaff(staffData.staff || []);
        // Filter users who have role 'coach' or 'staff'
        const eligibleUsers = usersData.users.filter(
          (u: User) => u.role === "coach" || u.role === "staff",
        );
        setUsers(eligibleUsers);
      } else {
        setError("Failed to fetch data");
      }
    } catch {
      setError("An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredStaff = useMemo(() => {
    if (!Array.isArray(staff)) return [];
    return staff.filter((member) => {
      const search = searchQuery.toLowerCase();
      return (
        (member.user_name || "").toLowerCase().includes(search) ||
        (member.user_email || "").toLowerCase().includes(search) ||
        (member.description || "").toLowerCase().includes(search)
      );
    });
  }, [staff, searchQuery]);

  const handleOpenDialog = (member?: StaffMember) => {
    if (member) {
      setIsEditing(true);
      setSelectedStaff({
        id: member.id,
        user_id: member.user_id,
        photo_url: member.photo_url,
        description: member.description,
      });
    } else {
      setIsEditing(false);
      setSelectedStaff(initialStaffState);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedStaff(initialStaffState);
    setError(null);
  };

  const handleSave = async () => {
    if (!selectedStaff.user_id) {
      setError("User is required");
      return;
    }

    try {
      const url = isEditing
        ? `/api/admin/staff/${selectedStaff.id}`
        : "/api/admin/staff";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedStaff),
      });

      const data = await res.json();

      if (res.ok) {
        handleCloseDialog();
        fetchData();
      } else {
        setError(data.error || "Failed to save staff member");
      }
    } catch {
      setError("An error occurred while saving");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this staff profile?")) return;

    try {
      const res = await fetch(`/api/admin/staff/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchData();
      } else {
        alert("Failed to delete staff member");
      }
    } catch {
      alert("Error deleting staff member");
    }
  };

  const handleUploadSuccess = (result: CloudinaryUploadWidgetResults) => {
    if (
      result.event === "success" &&
      result.info &&
      typeof result.info !== "string"
    ) {
      setSelectedStaff({
        ...selectedStaff,
        photo_url: result.info.secure_url,
      });
    }
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
          sx={{
            letterSpacing: "-0.02em",
            background: "linear-gradient(45deg, #000, #444)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Staff Management
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
          }}
        >
          Add New Staff
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: "12px" }}>
          {error}
        </Alert>
      )}

      {/* Search Bar */}
      <Paper
        sx={{
          p: 2,
          mb: 4,
          borderRadius: "16px",
          border: "1px solid rgba(0,0,0,0.05)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Search staff by name, email, or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" fontSize="small" />
              </InputAdornment>
            ),
            sx: { borderRadius: "10px" },
          }}
        />
      </Paper>

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
                <TableCell sx={{ fontWeight: "700", py: 2.5 }}>No.</TableCell>
                <TableCell sx={{ fontWeight: "700" }}>Photo</TableCell>
                <TableCell sx={{ fontWeight: "700" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: "700" }}>Role</TableCell>
                <TableCell sx={{ fontWeight: "700" }}>Description</TableCell>
                <TableCell align="right" sx={{ fontWeight: "700" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStaff.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                    <Typography color="textSecondary">
                      No staff members found.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredStaff
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((member, index) => (
                    <TableRow key={member.id} hover>
                      <TableCell>{page * rowsPerPage + index + 1}.</TableCell>
                      <TableCell>
                        {member.photo_url ? (
                          <Box
                            onClick={() => {
                              setPreviewImageUrl(member.photo_url);
                              setPreviewImageOpen(true);
                            }}
                            sx={{
                              cursor: "zoom-in",
                              transition: "all 0.2s",
                              "&:hover": {
                                transform: "scale(1.1)",
                                filter: "brightness(0.9)",
                              },
                            }}
                          >
                            <Avatar
                              src={member.photo_url}
                              variant="rounded"
                              sx={{
                                width: 50,
                                height: 50,
                                borderRadius: "10px",
                                bgcolor: "rgba(0,0,0,0.05)",
                              }}
                            />
                          </Box>
                        ) : (
                          <Avatar
                            variant="rounded"
                            sx={{
                              width: 50,
                              height: 50,
                              borderRadius: "10px",
                              bgcolor: "rgba(0,0,0,0.05)",
                            }}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight="700" color="textPrimary">
                          {member.user_name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {member.user_email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={member.role.toUpperCase()}
                          size="small"
                          color={
                            member.role === "coach" ? "primary" : "secondary"
                          }
                          sx={{ fontWeight: "700", borderRadius: "6px" }}
                        />
                      </TableCell>
                      <TableCell sx={{ maxWidth: "300px" }}>
                        <Typography
                          variant="body2"
                          noWrap
                          color="textPrimary"
                          title={member.description}
                        >
                          {member.description || "-"}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(member)}
                          sx={{
                            mr: 1,
                            "&:hover": { bgcolor: "rgba(0,0,0,0.05)" },
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(member.id)}
                          sx={{
                            "&:hover": {
                              bgcolor: "rgba(255,0,0,0.05)",
                              color: "error.main",
                            },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredStaff.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            sx={{
              "& .MuiTablePagination-toolbar": {
                justifyContent: "start",
              },
              "& .MuiTablePagination-spacer": {
                display: "none",
              },
              "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows, & .MuiTablePagination-select":
                {
                  fontWeight: "600",
                  color: "black",
                  margin: "0 8px",
                },
              "& .MuiTablePagination-actions": {
                color: "black",
                marginLeft: 0,
              },
            }}
          />
        </TableContainer>
      )}

      {/* Add/Edit Dialog */}
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
            {isEditing ? "Edit Staff Profile" : "Add New Staff Member"}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {isEditing
              ? "Update staff information and biography"
              : "Connect a user to a staff profile"}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}>
            <TextField
              select
              fullWidth
              label="Select User"
              value={selectedStaff.user_id}
              onChange={(e) =>
                setSelectedStaff({ ...selectedStaff, user_id: e.target.value })
              }
              disabled={isEditing}
              required
              helperText="Only users with role 'coach' or 'staff' are shown here."
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: "12px" },
              }}
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name} ({user.role})
                </MenuItem>
              ))}
            </TextField>

            <Box
              display="flex"
              alignItems="center"
              gap={3}
              sx={{
                p: 2,
                bgcolor: "rgba(0,0,0,0.02)",
                borderRadius: "16px",
                border: "1px dashed rgba(0,0,0,0.1)",
              }}
            >
              <Avatar
                src={selectedStaff.photo_url}
                variant="rounded"
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
              <Box>
                <Typography variant="subtitle2" fontWeight="700" gutterBottom>
                  Profile Photo
                </Typography>
                <Typography
                  variant="caption"
                  color="textSecondary"
                  display="block"
                  sx={{ mb: 1, fontSize: "0.7rem" }}
                >
                  Recommended: Square aspect ratio (1:1) for best display.
                </Typography>
                <CldUploadWidget
                  uploadPreset="champions_kids"
                  onSuccess={handleUploadSuccess}
                >
                  {({ open }) => (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => open()}
                      sx={{ borderRadius: "8px", textTransform: "none" }}
                    >
                      {selectedStaff.photo_url
                        ? "Change Photo"
                        : "Upload Photo"}
                    </Button>
                  )}
                </CldUploadWidget>
              </Box>
            </Box>

            <TextField
              fullWidth
              label="Description / Biography"
              multiline
              rows={4}
              value={selectedStaff.description}
              onChange={(e) =>
                setSelectedStaff({
                  ...selectedStaff,
                  description: e.target.value,
                })
              }
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            />
          </Box>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={handleCloseDialog}
            sx={{
              textTransform: "none",
              fontWeight: "600",
              color: "text.secondary",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={!selectedStaff.user_id && !isEditing}
            sx={{
              borderRadius: "12px",
              px: 4,
              textTransform: "none",
              fontWeight: "600",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            }}
          >
            {isEditing ? "Update Staff" : "Save Profile"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Photo Preview Dialog */}
      <Dialog
        open={previewImageOpen}
        onClose={() => setPreviewImageOpen(false)}
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: "24px",
            p: 1,
            overflow: "hidden",
            bgcolor: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(10px)",
          },
        }}
      >
        <Box sx={{ position: "relative" }}>
          <IconButton
            onClick={() => setPreviewImageOpen(false)}
            sx={{
              position: "absolute",
              right: 16,
              top: 16,
              bgcolor: "rgba(255,255,255,0.8)",
              "&:hover": { bgcolor: "rgba(255,255,255,1)" },
              zIndex: 1,
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
          <img
            src={previewImageUrl}
            alt="Staff Preview"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              borderRadius: "16px",
            }}
          />
        </Box>
      </Dialog>
    </Box>
  );
}
