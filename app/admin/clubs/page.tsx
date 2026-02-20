"use client";

import { useEffect, useState } from "react";
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
  Avatar,
  CircularProgress,
  Alert,
  FormControlLabel,
  Checkbox,
  Chip,
  TablePagination,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import {
  CldUploadWidget,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";

interface Club {
  id: number;
  name: string;
  logo_url: string | null;
  is_our_team: boolean;
  created_at: string;
}

interface ClubFormState {
  id?: number;
  name: string;
  logo_url: string;
  is_our_team: boolean;
}

const initialState: ClubFormState = {
  name: "",
  logo_url: "",
  is_our_team: false,
};

export default function ClubManagementPage() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedClub, setSelectedClub] = useState<ClubFormState>(initialState);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/clubs");
      const data = await res.json();
      if (res.ok) setClubs(data.clubs);
      else setError("Failed to fetch clubs");
    } catch {
      setError("An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenDialog = (club?: Club) => {
    if (club) {
      setIsEditing(true);
      setSelectedClub({
        name: club.name,
        logo_url: club.logo_url || "",
        is_our_team: club.is_our_team || false,
        id: club.id,
      });
    } else {
      setIsEditing(false);
      setSelectedClub(initialState);
    }
    setError(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedClub(initialState);
    setError(null);
  };

  const handleSave = async () => {
    if (!selectedClub.name.trim()) {
      setError("Club name is required");
      return;
    }
    setSaving(true);
    try {
      const url = isEditing
        ? `/api/admin/clubs/${selectedClub.id}`
        : "/api/admin/clubs";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: selectedClub.name,
          logo_url: selectedClub.logo_url,
          is_our_team: selectedClub.is_our_team,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        handleCloseDialog();
        fetchData();
      } else {
        setError(data.error || "Failed to save club");
      }
    } catch {
      setError("An error occurred while saving");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this club?")) return;
    try {
      const res = await fetch(`/api/admin/clubs/${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
      else alert("Failed to delete club");
    } catch {
      alert("Error deleting club");
    }
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleUploadSuccess = (result: CloudinaryUploadWidgetResults) => {
    if (
      result.event === "success" &&
      result.info &&
      typeof result.info !== "string"
    ) {
      setSelectedClub({ ...selectedClub, logo_url: result.info.secure_url });
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Header */}
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
          Club Management
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
          Add New Club
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: "12px" }}>
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
            boxShadow: "0 10px 40px -10px rgba(0,0,0,0.1)",
            overflow: "hidden",
            border: "1px solid rgba(0,0,0,0.05)",
          }}
        >
          <Table>
            <TableHead sx={{ bgcolor: "#fafafa" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "700", py: 2.5 }}>No.</TableCell>
                <TableCell sx={{ fontWeight: "700" }}>Logo</TableCell>
                <TableCell sx={{ fontWeight: "700" }}>Club Name</TableCell>
                <TableCell sx={{ fontWeight: "700" }}>Created</TableCell>
                <TableCell align="right" sx={{ fontWeight: "700" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clubs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    align="center"
                    sx={{ py: 6, color: "text.secondary" }}
                  >
                    No clubs found. Add your first club!
                  </TableCell>
                </TableRow>
              ) : (
                clubs
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((club, idx) => (
                    <TableRow
                      key={club.id}
                      hover
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell
                        sx={{ color: "text.secondary", fontWeight: 600 }}
                      >
                        {page * rowsPerPage + idx + 1}.
                      </TableCell>
                      <TableCell>
                        <Avatar
                          src={club.logo_url || undefined}
                          variant="rounded"
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: "10px",
                            bgcolor: "rgba(0,0,0,0.05)",
                            "& img": { objectFit: "contain", p: "4px" },
                          }}
                        >
                          {!club.logo_url && club.name.charAt(0).toUpperCase()}
                        </Avatar>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography
                            variant="body2"
                            fontWeight="700"
                            color="black"
                          >
                            {club.name}
                          </Typography>
                          {club.is_our_team && (
                            <Chip
                              label="Our Team"
                              size="small"
                              color="primary"
                              sx={{
                                fontSize: "10px",
                                height: "18px",
                                fontWeight: 800,
                                borderRadius: "4px",
                              }}
                            />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(club.created_at).toLocaleDateString(
                            "id-ID",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(club)}
                          sx={{
                            mr: 1,
                            "&:hover": {
                              bgcolor: "primary.light",
                              color: "white",
                            },
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(club.id)}
                          sx={{
                            "&:hover": {
                              bgcolor: "error.light",
                              color: "white",
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
            count={clubs.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            sx={{
              borderTop: "1px solid rgba(0,0,0,0.05)",
              "& .MuiTablePagination-toolbar": {
                justifyContent: "start", // Matches User Management
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
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontWeight: 700,
          }}
        >
          {isEditing ? "Edit Club" : "Add New Club"}
          <IconButton onClick={handleCloseDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: "10px" }}>
              {error}
            </Alert>
          )}

          <Box display="flex" flexDirection="column" gap={3} pt={1}>
            {/* Logo Upload */}
            <Box textAlign="center">
              <Avatar
                src={selectedClub.logo_url || undefined}
                variant="rounded"
                sx={{
                  width: 96,
                  height: 96,
                  mx: "auto",
                  mb: 2,
                  borderRadius: "16px",
                  bgcolor: "rgba(0,0,0,0.05)",
                  fontSize: "2rem",
                  "& img": { objectFit: "contain", p: "8px" },
                }}
              >
                {!selectedClub.logo_url &&
                  (selectedClub.name?.charAt(0)?.toUpperCase() || "?")}
              </Avatar>

              <CldUploadWidget
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                onSuccess={handleUploadSuccess}
              >
                {({ open }) => (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => open()}
                    sx={{ borderRadius: "8px", textTransform: "none" }}
                  >
                    {selectedClub.logo_url ? "Change Logo" : "Upload Logo"}
                  </Button>
                )}
              </CldUploadWidget>

              {selectedClub.logo_url && (
                <Button
                  size="small"
                  color="error"
                  sx={{ ml: 1, textTransform: "none" }}
                  onClick={() =>
                    setSelectedClub({ ...selectedClub, logo_url: "" })
                  }
                >
                  Remove
                </Button>
              )}
            </Box>

            {/* Name input */}
            <TextField
              label="Club Name"
              fullWidth
              required
              value={selectedClub.name}
              onChange={(e) =>
                setSelectedClub({ ...selectedClub, name: e.target.value })
              }
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedClub.is_our_team}
                  onChange={(e) =>
                    setSelectedClub({
                      ...selectedClub,
                      is_our_team: e.target.checked,
                    })
                  }
                />
              }
              label="Centang jika ini adalah Tim Kita (Our Team)"
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={handleCloseDialog} sx={{ textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving}
            startIcon={
              saving ? <CircularProgress size={20} color="inherit" /> : null
            }
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 700,
              px: 3,
            }}
          >
            {saving ? "Saving..." : isEditing ? "Save Changes" : "Add Club"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
