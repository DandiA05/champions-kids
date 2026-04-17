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
  CircularProgress,
  Alert,
  MenuItem,
  TablePagination,
  Chip,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import GroupsIcon from "@mui/icons-material/Groups";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import { formatDate, getLocalDateString } from "@/helper/helper";


interface Schedule {
  id: number;
  name: string;
  date: string;
  category: "training" | "sparing" | "tournament" | "liga";
  description: string;
  created_at: string;
  updated_at: string;
}

const CATEGORIES = [
  {
    value: "training",
    label: "Training",
    icon: <FitnessCenterIcon />,
    color: "#4caf50",
  },
  {
    value: "sparing",
    label: "Sparing",
    icon: <SportsSoccerIcon />,
    color: "#2196f3",
  },
  {
    value: "tournament",
    label: "Tournament",
    icon: <EmojiEventsIcon />,
    color: "#ff9800",
  },
  { value: "liga", label: "Liga", icon: <GroupsIcon />, color: "#9c27b0" },
];

export default function ScheduleManagementPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Dialog states
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null,
  );
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    date: new Date().toLocaleDateString("en-CA"), // YYYY-MM-DD format in local time
    category: "training",
    description: "",
  });

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/schedules");
      const data = await response.json();
      if (response.ok) {
        setSchedules(data.schedules);
      } else {
        setError(data.error || "Failed to fetch schedules");
      }
    } catch {
      setError("An error occurred while fetching schedules");
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedSchedules = useMemo(() => {
    return schedules
      .filter((item) => {
        const matchesSearch =
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory =
          filterCategory === "all" || item.category === filterCategory;

        const scheduleDate = new Date(item.date).getTime();
        const matchesStartDate =
          !startDate || scheduleDate >= new Date(startDate).getTime();
        const matchesEndDate =
          !endDate || scheduleDate <= new Date(endDate).getTime();

        return (
          matchesSearch && matchesCategory && matchesStartDate && matchesEndDate
        );
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by date desc
  }, [schedules, searchQuery, filterCategory, startDate, endDate]);

  const handleOpen = (schedule?: Schedule) => {
    if (schedule) {
      setSelectedSchedule(schedule);
      setFormData({
        name: schedule.name,
        date: schedule.date ? getLocalDateString(schedule.date) : "",
        category: schedule.category,
        description: schedule.description || "",
      });
    } else {
      setSelectedSchedule(null);
      setFormData({
        name: "",
        date: new Date().toLocaleDateString("en-CA"),
        category: "training",
        description: "",
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedSchedule(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const url = selectedSchedule
      ? `/api/admin/schedules/${selectedSchedule.id}`
      : "/api/admin/schedules";
    const method = selectedSchedule ? "PATCH" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess(
          `Schedule ${selectedSchedule ? "updated" : "created"} successfully`,
        );
        handleClose();
        fetchSchedules();
      } else {
        setError(data.error || "Failed to save schedule");
      }
    } catch {
      setError("An error occurred while saving the schedule");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteOpen = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedSchedule) return;
    setSubmitting(true);
    try {
      const response = await fetch(
        `/api/admin/schedules/${selectedSchedule.id}`,
        {
          method: "DELETE",
        },
      );
      if (response.ok) {
        setSuccess("Schedule deleted successfully");
        setDeleteDialogOpen(false);
        fetchSchedules();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to delete schedule");
      }
    } catch {
      setError("An error occurred while deleting the schedule");
    } finally {
      setSubmitting(false);
    }
  };

  const getCategoryTheme = (catValue: string) => {
    return CATEGORIES.find((c) => c.value === catValue) || CATEGORIES[0];
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, minHeight: "100vh" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
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
            Schedule Management
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
            Manage training, sparing, tournaments, and liga schedules
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            px: 3,
            py: 1,
            fontWeight: "600",
            boxShadow: "0 4px 14px 0 rgba(0,0,0,0.39)",
          }}
        >
          Add Schedule
        </Button>
      </Box>

      {/* Filters Section */}
      <Paper
        sx={{
          p: 2,
          mb: 4,
          borderRadius: "16px",
          border: "1px solid rgba(0,0,0,0.05)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          alignItems: "center",
          bgcolor: "white",
        }}
      >
        <TextField
          size="small"
          placeholder="Cari jadwal atau deskripsi..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            flexGrow: 1,
            minWidth: "250px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
            },
          }}
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ mr: 1, color: "text.disabled" }} />
            ),
          }}
        />
        <TextField
          select
          size="small"
          label="Kategori"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          sx={{
            minWidth: "160px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
            },
          }}
        >
          <MenuItem value="all">Semua Kategori</MenuItem>
          {CATEGORIES.map((cat) => (
            <MenuItem key={cat.value} value={cat.value}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {cat.icon} {cat.label}
              </Box>
            </MenuItem>
          ))}
        </TextField>
        <TextField
          type="date"
          size="small"
          label="Start Date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{
            minWidth: "150px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
            },
          }}
        />
        <TextField
          type="date"
          size="small"
          label="End Date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{
            minWidth: "150px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
            },
          }}
        />
      </Paper>

      {success && (
        <Alert
          severity="success"
          sx={{ mb: 3, borderRadius: "12px" }}
          onClose={() => setSuccess(null)}
        >
          {success}
        </Alert>
      )}

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3, borderRadius: "12px" }}
          onClose={() => setError(null)}
        >
          {error}
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
            boxShadow: "0 10px 40px rgba(0,0,0,0.05)",
            overflow: "hidden",
          }}
        >
          <Table>
            <TableHead sx={{ bgcolor: "#F9FAFB" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "700", py: 2.5 }}>No.</TableCell>
                <TableCell sx={{ fontWeight: "700" }}>Schedule Name</TableCell>
                <TableCell sx={{ fontWeight: "700" }}>Date</TableCell>
                <TableCell sx={{ fontWeight: "700" }}>Category</TableCell>
                <TableCell align="right" sx={{ fontWeight: "700" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAndSortedSchedules.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <Typography color="textSecondary">
                      No schedules found matching your criteria.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedSchedules
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item, index) => {
                    const theme = getCategoryTheme(item.category);
                    return (
                      <TableRow key={item.id} hover>
                        <TableCell>{page * rowsPerPage + index + 1}.</TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            fontWeight="700"
                            color="black"
                          >
                            {item.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="textSecondary">
                            {formatDate(item.date)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={theme.icon}
                            label={theme.label}
                            size="small"
                            sx={{
                              bgcolor: `${theme.color}15`,
                              color: theme.color,
                              fontWeight: "700",
                              borderRadius: "8px",
                              "& .MuiChip-icon": { color: "inherit" },
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleOpen(item)}
                              sx={{
                                mr: 1,
                                bgcolor: "rgba(33, 150, 243, 0.08)",
                                "&:hover": {
                                  bgcolor: "primary.main",
                                  color: "white",
                                },
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteOpen(item)}
                              sx={{
                                bgcolor: "rgba(244, 67, 54, 0.08)",
                                "&:hover": {
                                  bgcolor: "error.main",
                                  color: "white",
                                },
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredAndSortedSchedules.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            sx={{
              borderTop: "1px solid rgba(0,0,0,0.05)",
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
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "24px", p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: "800", fontSize: "1.5rem", pb: 1 }}>
          {selectedSchedule ? "Edit Schedule" : "New Schedule"}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}
            >
              <TextField
                fullWidth
                label="Course/Activity Name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
              <Box
                sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
              >
                <TextField
                  fullWidth
                  label="Date"
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  InputLabelProps={{ shrink: true }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                />
                <TextField
                  select
                  fullWidth
                  label="Category"
                  required
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                >
                  {CATEGORIES.map((cat) => (
                    <MenuItem key={cat.value} value={cat.value}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {cat.icon} {cat.label}
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
              <Box>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                />
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button
              onClick={handleClose}
              sx={{
                px: 3,
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: "700",
                color: "text.secondary",
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              sx={{
                px: 4,
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: "700",
                bgcolor: "#000",
                "&:hover": { bgcolor: "#333" },
              }}
            >
              {submitting
                ? "Saving..."
                : selectedSchedule
                  ? "Update"
                  : "Create"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: "20px" } }}
      >
        <DialogTitle sx={{ fontWeight: "700" }}>Delete Schedule?</DialogTitle>
        <DialogContent>
          Are you sure you want to delete <b>{selectedSchedule?.name}</b>? This
          action cannot be undone.
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ color: "text.secondary" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={submitting}
            sx={{ borderRadius: "10px", px: 3 }}
          >
            {submitting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
