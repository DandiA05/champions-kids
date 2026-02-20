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
  Avatar,
  DialogContentText,
  Tabs,
  Tab,
  Divider,
  MenuItem,
  TablePagination,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import CollectionsIcon from "@mui/icons-material/Collections";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  CldUploadWidget,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ size: ["small", false, "large", "huge"] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ align: [] }],
    ["blockquote", "code-block"],
    ["link", "image"],
    ["clean"],
  ],
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`event-tabpanel-${index}`}
      aria-labelledby={`event-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

interface Event {
  id: number;
  title: string;
  banner_url: string;
  description: string;
  event_date: string;
  documentation_urls: string[];
  created_at: string;
  updated_at: string;
}

export default function EventManagementPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Dialog states
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Preview states
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    banner_url: "",
    description: "",
    event_date: new Date().toISOString().split("T")[0],
    documentation_urls: [] as string[],
  });

  // Sort & Filter states
  const [sortBy, setSortBy] = useState<string>("event_date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/events");
      const data = await response.json();
      if (response.ok) {
        // Parse documentation_urls if it's a string (from JSONB)
        const parsedEvents = data.events.map((ev: Event) => ({
          ...ev,
          documentation_urls:
            typeof ev.documentation_urls === "string"
              ? JSON.parse(ev.documentation_urls)
              : ev.documentation_urls || [],
        }));
        setEvents(parsedEvents);
      } else {
        setError(data.error || "Failed to fetch events");
      }
    } catch {
      setError("An error occurred while fetching events");
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedEvents = useMemo(() => {
    return events
      .filter((event) => {
        const matchSearch = event.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        return matchSearch;
      })
      .sort((a, b) => {
        let valA: string | number = "";
        let valB: string | number = "";

        if (sortBy === "event_date") {
          valA = a.event_date || "";
          valB = b.event_date || "";
        } else if (sortBy === "title") {
          valA = a.title.toLowerCase();
          valB = b.title.toLowerCase();
        }

        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
  }, [events, sortBy, sortOrder, searchQuery]);

  const handleOpen = (event?: Event) => {
    setTabValue(0);
    if (event) {
      setSelectedEvent(event);
      setFormData({
        title: event.title,
        banner_url: event.banner_url || "",
        description: event.description || "",
        event_date: event.event_date
          ? new Date(
              new Date(event.event_date).getTime() -
                new Date(event.event_date).getTimezoneOffset() * 60000,
            )
              .toISOString()
              .split("T")[0]
          : "",
        documentation_urls: event.documentation_urls || [],
      });
    } else {
      setSelectedEvent(null);
      setFormData({
        title: "",
        banner_url: "",
        description: "",
        event_date: new Date(
          new Date().getTime() - new Date().getTimezoneOffset() * 60000,
        )
          .toISOString()
          .split("T")[0],
        documentation_urls: [],
      });
    }
    setOpen(true);
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

  const handlePreviewClose = () => {
    setPreviewOpen(false);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handlePreviewOpen = (url: string) => {
    setPreviewUrl(url);
    setPreviewOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedEvent(null);
    setError(null);
  };

  const handleDeleteOpen = (event: Event) => {
    setSelectedEvent(event);
    setDeleteDialogOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
    setSelectedEvent(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const url = selectedEvent
      ? `/api/admin/events/${selectedEvent.id}`
      : "/api/admin/events";
    const method = selectedEvent ? "PATCH" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess(
          `Event ${selectedEvent ? "updated" : "created"} successfully`,
        );
        handleClose();
        fetchEvents();
      } else {
        setError(data.error || "Failed to save event");
      }
    } catch {
      setError("An error occurred while saving the event");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedEvent) return;
    setSubmitting(true);
    try {
      const response = await fetch(`/api/admin/events/${selectedEvent.id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setSuccess("Event deleted successfully");
        handleDeleteClose();
        fetchEvents();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to delete event");
      }
    } catch {
      setError("An error occurred while deleting the event");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBannerUpload = (results: CloudinaryUploadWidgetResults) => {
    if (results.info && typeof results.info !== "string") {
      const url = results.info.secure_url;
      setFormData((prev) => ({ ...prev, banner_url: url }));
    }
  };

  const handleDocsUpload = (results: CloudinaryUploadWidgetResults) => {
    if (results.info && typeof results.info !== "string") {
      const url = results.info.secure_url;
      setFormData((prev) => ({
        ...prev,
        documentation_urls: [...prev.documentation_urls, url],
      }));
    }
  };

  const removeDocPhoto = (index: number) => {
    setFormData((prev) => {
      const newUrls = [...prev.documentation_urls];
      newUrls.splice(index, 1);
      return { ...prev, documentation_urls: newUrls };
    });
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
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
          Event Management
        </Typography>
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
            "&:hover": {
              boxShadow: "0 6px 20px rgba(0,0,0,0.23)",
            },
          }}
        >
          Add New Event
        </Button>
      </Box>

      {/* Filters & Search - Premium Styling */}
      <Paper
        sx={{
          p: 3,
          mb: 4,
          borderRadius: "20px",
          border: "1px solid rgba(0,0,0,0.05)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "2fr 1fr 1fr" },
            gap: 3,
          }}
        >
          <TextField
            fullWidth
            size="small"
            label="Search Events"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
          />
          <TextField
            select
            fullWidth
            size="small"
            label="Sort By"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
          >
            <MenuItem value="event_date">Date</MenuItem>
            <MenuItem value="title">Title</MenuItem>
          </TextField>
          <TextField
            select
            fullWidth
            size="small"
            label="Order"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
          >
            <MenuItem value="desc">Descending</MenuItem>
            <MenuItem value="asc">Ascending</MenuItem>
          </TextField>
        </Box>
      </Paper>

      {success && (
        <Alert
          severity="success"
          sx={{
            mb: 3,
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
          onClose={() => setSuccess(null)}
        >
          {success}
        </Alert>
      )}

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
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
            boxShadow: "0 10px 40px -10px rgba(0,0,0,0.1)",
            overflow: "hidden",
            border: "1px solid rgba(0,0,0,0.05)",
          }}
        >
          <Table>
            <TableHead sx={{ bgcolor: "#fafafa" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "700", py: 2.5 }}>No.</TableCell>
                <TableCell sx={{ fontWeight: "700" }}>Banner</TableCell>
                <TableCell sx={{ fontWeight: "700" }}>Title</TableCell>
                <TableCell sx={{ fontWeight: "700" }}>Date</TableCell>
                <TableCell sx={{ fontWeight: "700" }}>Documentation</TableCell>
                <TableCell align="right" sx={{ fontWeight: "700" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAndSortedEvents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    No events found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedEvents
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((event, index) => (
                    <TableRow
                      key={event.id}
                      hover
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>{page * rowsPerPage + index + 1}.</TableCell>
                      <TableCell>
                        <Box
                          onClick={() => {
                            if (event.banner_url) {
                              handlePreviewOpen(event.banner_url);
                            }
                          }}
                          sx={{
                            cursor: "zoom-in",
                            transition: "all 0.2s",
                            display: "inline-block",
                            "&:hover": {
                              transform: "scale(1.05)",
                              filter: "brightness(0.9)",
                            },
                          }}
                        >
                          <Avatar
                            src={event.banner_url}
                            variant="rounded"
                            sx={{
                              width: 60,
                              height: 40,
                              borderRadius: "8px",
                              bgcolor: "rgba(0,0,0,0.05)",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            }}
                          >
                            <ImageIcon />
                          </Avatar>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          fontWeight="700"
                          color="black"
                        >
                          {event.title}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="textSecondary">
                          {event.event_date
                            ? new Date(event.event_date).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                },
                              )
                            : "N/A"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <CollectionsIcon fontSize="small" color="action" />
                          <Typography variant="body2" fontWeight="600">
                            {event.documentation_urls?.length || 0}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleOpen(event)}
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
                          color="error"
                          onClick={() => handleDeleteOpen(event)}
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
            count={filteredAndSortedEvents.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
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
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: "20px" },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontWeight: "bold",
            px: 3,
            pt: 3,
          }}
        >
          {selectedEvent ? "Edit Event" : "Add New Event"}
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers sx={{ px: 3, pb: 4 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                mb: 2,
                "& .MuiTab-root": { fontWeight: "bold", textTransform: "none" },
              }}
            >
              <Tab label="Informasi Dasar" />
              <Tab label="Media & Dokumentasi" />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              <Box display="flex" flexDirection="column" gap={3}>
                <TextField
                  fullWidth
                  label="Event Title"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  variant="outlined"
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                />
                <TextField
                  fullWidth
                  label="Event Date"
                  type="date"
                  required
                  value={formData.event_date}
                  onChange={(e) =>
                    setFormData({ ...formData, event_date: e.target.value })
                  }
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                />
                <Box>
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    sx={{ mb: 1, display: "block", fontWeight: "bold" }}
                  >
                    Event Description
                  </Typography>
                  <Box
                    sx={{
                      "& .quill": {
                        bgcolor: "white",
                        color: "black !important",
                        borderRadius: "10px",
                        overflow: "hidden",
                        border: "1px solid rgba(0,0,0,0.23)",
                        transition: "border-color 0.2s",
                        "&:hover": { borderColor: "rgba(0,0,0,0.87)" },
                        "&:focus-within": {
                          borderColor: "primary.main",
                          borderWidth: "2px",
                        },
                        "& *": {
                          color: "black !important",
                        },
                      },
                      "& .ql-toolbar": {
                        border: "none",
                        borderBottom: "1px solid rgba(0,0,0,0.1)",
                        "& .ql-picker": { color: "black !important" },
                        "& .ql-stroke": { stroke: "black !important" },
                        "& .ql-fill": { fill: "black !important" },
                        "& button": { color: "black !important" },
                      },
                      "& .ql-container": {
                        border: "none",
                        minHeight: "200px",
                        fontSize: "1rem",
                        bgcolor: "white !important",
                        "& .ql-editor": {
                          color: "black !important",
                          bgcolor: "white !important",
                          "& *": { color: "black !important" },
                        },
                        "& .ql-editor.ql-blank::before": {
                          color: "rgba(0,0,0,0.6) !important",
                          fontStyle: "normal",
                        },
                      },
                    }}
                  >
                    <ReactQuill
                      theme="snow"
                      value={formData.description}
                      onChange={(content) =>
                        setFormData((prev) => ({
                          ...prev,
                          description: content,
                        }))
                      }
                      modules={quillModules}
                      placeholder="Write event description here..."
                    />
                  </Box>
                </Box>
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Box sx={{ mb: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight="800"
                    color="primary"
                  >
                    Banner Image
                  </Typography>
                  <CldUploadWidget
                    uploadPreset={
                      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ||
                      "champions_kids"
                    }
                    onSuccess={handleBannerUpload}
                  >
                    {({ open }) => (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => open()}
                        startIcon={<ImageIcon />}
                        sx={{ borderRadius: "8px", fontWeight: "bold" }}
                      >
                        Upload Banner
                      </Button>
                    )}
                  </CldUploadWidget>
                </Box>
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    height: 200,
                    bgcolor: "grey.50",
                    borderRadius: "15px",
                    overflow: "hidden",
                    border: "2px dashed",
                    borderColor: "grey.300",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    transition: "all 0.3s",
                    "&:hover": {
                      borderColor: "primary.main",
                      bgcolor: "primary.50",
                    },
                  }}
                >
                  {formData.banner_url ? (
                    <>
                      <img
                        src={formData.banner_url}
                        alt="Banner"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          inset: 0,
                          bgcolor: "rgba(0,0,0,0.4)",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          opacity: 0,
                          "&:hover": { opacity: 1 },
                          transition: "0.2s",
                        }}
                      >
                        <IconButton
                          color="inherit"
                          onClick={() => handlePreviewOpen(formData.banner_url)}
                          sx={{ color: "white" }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Box>
                    </>
                  ) : (
                    <Box textAlign="center">
                      <ImageIcon
                        sx={{ fontSize: 40, color: "grey.400", mb: 1 }}
                      />
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        display="block"
                      >
                        No banner uploaded
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight="800"
                    color="primary"
                  >
                    Documentation Gallery
                  </Typography>
                  <CldUploadWidget
                    uploadPreset={
                      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ||
                      "champions_kids"
                    }
                    onSuccess={handleDocsUpload}
                  >
                    {({ open }) => (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => open()}
                        startIcon={<CollectionsIcon />}
                        sx={{ borderRadius: "8px", fontWeight: "bold" }}
                      >
                        Add Photos
                      </Button>
                    )}
                  </CldUploadWidget>
                </Box>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(120px, 1fr))",
                    gap: 2,
                  }}
                >
                  {formData.documentation_urls.map((url, index) => (
                    <Box
                      key={index}
                      sx={{
                        position: "relative",
                        aspectRatio: "1/1",
                        borderRadius: "12px",
                        overflow: "hidden",
                        border: "1px solid",
                        borderColor: "divider",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                      }}
                    >
                      <img
                        src={url}
                        alt={`Doc ${index}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          inset: 0,
                          bgcolor: "rgba(0,0,0,0.5)",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          opacity: 0,
                          "&:hover": { opacity: 1 },
                          transition: "0.2s",
                        }}
                      >
                        <IconButton
                          size="small"
                          color="inherit"
                          onClick={() => handlePreviewOpen(url)}
                          sx={{ color: "white" }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => removeDocPhoto(index)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </TabPanel>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 3 }}>
            <Button
              onClick={handleClose}
              color="inherit"
              sx={{ fontWeight: "600", textTransform: "none" }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              sx={{
                minWidth: 140,
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: "600",
                boxShadow: "0 4px 14px 0 rgba(0,0,0,0.2)",
              }}
            >
              {submitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : selectedEvent ? (
                "Save Changes"
              ) : (
                "Create Event"
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteClose}
        PaperProps={{ sx: { borderRadius: "20px" } }}
      >
        <DialogTitle sx={{ fontWeight: "800", pt: 3, px: 3 }}>
          Confirm Delete
        </DialogTitle>
        <DialogContent sx={{ px: 3 }}>
          <DialogContentText fontWeight="500">
            Are you sure you want to delete the event &quot;
            <Box component="span" color="primary.main" fontWeight="700">
              {selectedEvent?.title}
            </Box>
            &quot;? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={handleDeleteClose}
            color="inherit"
            sx={{ fontWeight: "700", textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={submitting}
            sx={{
              borderRadius: "12px",
              px: 3,
              fontWeight: "700",
              textTransform: "none",
            }}
          >
            {submitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Delete Event"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={handlePreviewClose}
        maxWidth="lg"
        PaperProps={{
          sx: { bgcolor: "transparent", boxShadow: "none", overflow: "hidden" },
        }}
      >
        <Box sx={{ position: "relative" }}>
          <IconButton
            onClick={handlePreviewClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              bgcolor: "rgba(0,0,0,0.6)",
              color: "white",
              "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
              zIndex: 1,
            }}
          >
            <CloseIcon />
          </IconButton>
          <img
            src={previewUrl}
            alt="Preview"
            style={{
              maxWidth: "100%",
              maxHeight: "90vh",
              display: "block",
              borderRadius: "15px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            }}
          />
        </Box>
      </Dialog>
    </Box>
  );
}
