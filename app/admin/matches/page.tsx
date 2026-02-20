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
  MenuItem,
  Avatar,
  CircularProgress,
  Alert,
  Chip,
  TablePagination,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { formatDate, getLocalDateString } from "@/helper/helper";

interface Club {
  id: number;
  name: string;
  logo_url: string | null;
  is_our_team: boolean | null;
}

interface Match {
  id: number;
  home_club_id: number;
  away_club_id: number;
  home_club_name: string;
  home_club_logo: string | null;
  home_club_is_our_team: boolean | null;
  away_club_name: string;
  away_club_logo: string | null;
  away_club_is_our_team: boolean | null;
  match_date: string;
  match_time: string | null;
  venue: string | null;
  score_home: number | null;
  score_away: number | null;
  result: string | null;
  remark: string | null;
  created_at: string;
}

interface MatchFormState {
  id?: number;
  home_club_id: string | number;
  away_club_id: string | number;
  match_date: string;
  match_time: string;
  venue: string;
  score_home: string | number;
  score_away: string | number;
  result: string;
  remark: string;
}

const initialMatchState: MatchFormState = {
  id: undefined,
  home_club_id: "",
  away_club_id: "",
  match_date: "",
  match_time: "",
  venue: "",
  score_home: "",
  score_away: "",
  result: "",
  remark: "",
};

export default function MatchManagementPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedMatch, setSelectedMatch] =
    useState<MatchFormState>(initialMatchState);
  const [filter, setFilter] = useState("all"); // all, win, lose, draw
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [matchesRes, clubsRes] = await Promise.all([
        fetch("/api/admin/matches"),
        fetch("/api/admin/clubs"),
      ]);
      const matchesData = await matchesRes.json();
      const clubsData = await clubsRes.json();

      if (matchesRes.ok) setMatches(matchesData.matches);
      if (clubsRes.ok) setClubs(clubsData.clubs);
      if (!matchesRes.ok || !clubsRes.ok) setError("Failed to fetch data");
    } catch {
      setError("An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  const filteredMatches = matches.filter((m) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      m.home_club_name?.toLowerCase().includes(searchLower) ||
      m.away_club_name?.toLowerCase().includes(searchLower) ||
      m.venue?.toLowerCase().includes(searchLower);

    const matchesFilter = filter === "all" || m.result === filter;

    return matchesSearch && matchesFilter;
  });

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenDialog = (match?: Match) => {
    if (match) {
      setIsEditing(true);
      setSelectedMatch({
        id: match.id,
        home_club_id: match.home_club_id,
        away_club_id: match.away_club_id,
        match_date: match.match_date
          ? getLocalDateString(match.match_date)
          : "",
        match_time: match.match_time || "",
        venue: match.venue || "",
        score_home: match.score_home !== null ? String(match.score_home) : "",
        score_away: match.score_away !== null ? String(match.score_away) : "",
        result: match.result || "",
        remark: match.remark || "",
      });
    } else {
      setIsEditing(false);
      setSelectedMatch(initialMatchState);
    }
    setError(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedMatch(initialMatchState);
    setError(null);
  };

  const handleSave = async () => {
    if (
      !selectedMatch.home_club_id ||
      !selectedMatch.away_club_id ||
      !selectedMatch.match_date
    ) {
      setError("Home club, away club, and match date are required");
      return;
    }
    if (selectedMatch.home_club_id === selectedMatch.away_club_id) {
      setError("Home and Away club cannot be the same");
      return;
    }
    setSaving(true);
    try {
      const url = isEditing
        ? `/api/admin/matches/${selectedMatch.id}`
        : "/api/admin/matches";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          home_club_id: Number(selectedMatch.home_club_id),
          away_club_id: Number(selectedMatch.away_club_id),
          match_date: selectedMatch.match_date,
          match_time: selectedMatch.match_time || null,
          venue: selectedMatch.venue || null,
          score_home:
            selectedMatch.score_home !== ""
              ? Number(selectedMatch.score_home)
              : null,
          score_away:
            selectedMatch.score_away !== ""
              ? Number(selectedMatch.score_away)
              : null,
          result: selectedMatch.result || null,
          remark: selectedMatch.remark || null,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        handleCloseDialog();
        fetchData();
      } else {
        setError(data.error || "Failed to save match");
      }
    } catch {
      setError("An error occurred while saving");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this match?")) return;
    try {
      const res = await fetch(`/api/admin/matches/${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
      else alert("Failed to delete match");
    } catch {
      alert("Error deleting match");
    }
  };

  const isMatchFinished = (match: Match) =>
    match.score_home !== null && match.score_away !== null;

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatTime = (timeStr: string | null) => {
    if (!timeStr) return "-";
    return timeStr.slice(0, 5); // HH:MM
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
          Match Management
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
          Add New Match
        </Button>
      </Box>

      {/* Stats Cards */}
      <Box
        sx={{
          display: "flex",
          gap: 3,
          mb: 4,
          flexDirection: { xs: "column", sm: "row" },
          flexWrap: { sm: "wrap", md: "nowrap" },
          "& > *": {
            flex: 1,
            minWidth: { xs: "100%", sm: "calc(50% - 12px)", md: "0" },
          },
        }}
      >
        <Paper
          sx={{
            p: 2.5,
            borderRadius: "16px",
            border: "1px solid rgba(0,0,0,0.05)",
            boxShadow: "0 4px 20px -5px rgba(0,0,0,0.05)",
          }}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Box
              sx={{
                bgcolor: "rgba(0,0,0,0.04)",
                p: 1.5,
                borderRadius: "12px",
              }}
            >
              <EmojiEventsIcon sx={{ color: "text.secondary" }} />
            </Box>
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight="600"
              >
                Total Played
              </Typography>
              <Typography variant="h5" fontWeight="800">
                {matches.length}
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Paper
          sx={{
            p: 2.5,
            borderRadius: "16px",
            border: "1px solid rgba(0,0,0,0.05)",
            boxShadow: "0 4px 20px -5px rgba(0,0,0,0.05)",
          }}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Box
              sx={{
                bgcolor: "rgba(34, 197, 94, 0.1)",
                p: 1.5,
                borderRadius: "12px",
              }}
            >
              <EmojiEventsIcon sx={{ color: "#22c55e" }} />
            </Box>
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight="600"
              >
                Wins
              </Typography>
              <Typography
                variant="h5"
                fontWeight="800"
                sx={{ color: "#22c55e" }}
              >
                {matches.filter((m) => m.result === "win").length}
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Paper
          sx={{
            p: 2.5,
            borderRadius: "16px",
            border: "1px solid rgba(0,0,0,0.05)",
            boxShadow: "0 4px 20px -5px rgba(0,0,0,0.05)",
          }}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Box
              sx={{
                bgcolor: "rgba(239, 68, 68, 0.1)",
                p: 1.5,
                borderRadius: "12px",
              }}
            >
              <EmojiEventsIcon sx={{ color: "#ef4444" }} />
            </Box>
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight="600"
              >
                Losses
              </Typography>
              <Typography
                variant="h5"
                fontWeight="800"
                sx={{ color: "#ef4444" }}
              >
                {matches.filter((m) => m.result === "lose").length}
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Paper
          sx={{
            p: 2.5,
            borderRadius: "16px",
            border: "1px solid rgba(0,0,0,0.05)",
            boxShadow: "0 4px 20px -5px rgba(0,0,0,0.05)",
          }}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Box
              sx={{
                bgcolor: "rgba(245, 158, 11, 0.1)",
                p: 1.5,
                borderRadius: "12px",
              }}
            >
              <EmojiEventsIcon sx={{ color: "#f59e0b" }} />
            </Box>
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight="600"
              >
                Draws
              </Typography>
              <Typography
                variant="h5"
                fontWeight="800"
                sx={{ color: "#f59e0b" }}
              >
                {matches.filter((m) => m.result === "draw").length}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Statistics & Filters */}
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
          placeholder="Cari lawan atau venue..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            flexGrow: 1,
            minWidth: "250px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
            },
          }}
        />
        <TextField
          select
          size="small"
          label="Filter Hasil"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          sx={{
            minWidth: "160px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
            },
          }}
        >
          <MenuItem value="all">Semua Hasil</MenuItem>
          <MenuItem value="win">Menang (WIN)</MenuItem>
          <MenuItem value="lose">Kalah (LOSE)</MenuItem>
          <MenuItem value="draw">Seri (DRAW)</MenuItem>
        </TextField>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: "12px" }}>
          {error}
        </Alert>
      )}

      {clubs.length === 0 && !loading && (
        <Alert severity="warning" sx={{ mb: 3, borderRadius: "12px" }}>
          No clubs found. Please add clubs in <strong>Club Management</strong>{" "}
          first before adding matches.
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
                <TableCell sx={{ fontWeight: "700" }}>Match</TableCell>
                <TableCell sx={{ fontWeight: "700" }}>Score</TableCell>
                <TableCell sx={{ fontWeight: "700" }}>Date</TableCell>
                <TableCell sx={{ fontWeight: "700" }}>Time</TableCell>
                <TableCell sx={{ fontWeight: "700" }}>Venue</TableCell>
                <TableCell sx={{ fontWeight: "700" }}>Remark</TableCell>
                <TableCell sx={{ fontWeight: "700" }}>Result</TableCell>
                <TableCell sx={{ fontWeight: "700" }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: "700" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMatches.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    align="center"
                    sx={{ py: 6, color: "text.secondary" }}
                  >
                    No matches found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredMatches
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((match, index) => (
                    <TableRow
                      key={match.id}
                      hover
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>{page * rowsPerPage + index + 1}.</TableCell>
                      {/* Match column: Home vs Away */}
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Avatar
                              src={match.home_club_logo || undefined}
                              variant="rounded"
                              sx={{
                                width: 36,
                                height: 36,
                                borderRadius: "8px",
                                bgcolor: "rgba(0,0,0,0.05)",
                                "& img": { objectFit: "contain", p: "2px" },
                              }}
                            >
                              {!match.home_club_logo &&
                                match.home_club_name?.charAt(0)}
                            </Avatar>
                            <Typography
                              variant="body2"
                              fontWeight="700"
                              color="black"
                            >
                              {match.home_club_name}
                            </Typography>
                          </Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            fontWeight="800"
                            sx={{ mx: 0.5 }}
                          >
                            vs
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Avatar
                              src={match.away_club_logo || undefined}
                              variant="rounded"
                              sx={{
                                width: 36,
                                height: 36,
                                borderRadius: "8px",
                                bgcolor: "rgba(0,0,0,0.05)",
                                "& img": { objectFit: "contain", p: "2px" },
                              }}
                            >
                              {!match.away_club_logo &&
                                match.away_club_name?.charAt(0)}
                            </Avatar>
                            <Typography
                              variant="body2"
                              fontWeight="700"
                              color="black"
                            >
                              {match.away_club_name}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      {/* Score */}
                      <TableCell>
                        {isMatchFinished(match) ? (
                          <Box
                            sx={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 0.5,
                              bgcolor: "rgba(0,0,0,0.04)",
                              borderRadius: "8px",
                              px: 1.5,
                              py: 0.5,
                            }}
                          >
                            <Typography
                              variant="body2"
                              fontWeight="800"
                              color="black"
                            >
                              {match.score_home}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              :
                            </Typography>
                            <Typography
                              variant="body2"
                              fontWeight="800"
                              color="black"
                            >
                              {match.score_away}
                            </Typography>
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            -
                          </Typography>
                        )}
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2" color="black">
                          {formatDate(match.match_date)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {formatTime(match.match_time)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {match.venue || "-"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {match.remark || "-"}
                        </Typography>
                      </TableCell>

                      {/* Result */}
                      <TableCell>
                        {match.result ? (
                          <Chip
                            label={
                              match.result === "win"
                                ? "WIN"
                                : match.result === "lose"
                                  ? "LOSE"
                                  : "DRAW"
                            }
                            size="small"
                            sx={{
                              fontWeight: 900,
                              borderRadius: "6px",
                              bgcolor:
                                match.result === "win"
                                  ? "#22c55e"
                                  : match.result === "lose"
                                    ? "#ef4444"
                                    : "#f59e0b",
                              color: "white",
                              width: "60px",
                            }}
                          />
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            -
                          </Typography>
                        )}
                      </TableCell>

                      {/* Status badge */}
                      <TableCell>
                        <Chip
                          label={
                            isMatchFinished(match) ? "Selesai" : "Upcoming"
                          }
                          color={isMatchFinished(match) ? "success" : "warning"}
                          variant="outlined"
                          size="small"
                          icon={
                            isMatchFinished(match) ? (
                              <EmojiEventsIcon />
                            ) : undefined
                          }
                          sx={{ fontWeight: "700", borderRadius: "8px" }}
                        />
                      </TableCell>

                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(match)}
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
                          onClick={() => handleDelete(match.id)}
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
            count={filteredMatches.length}
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
          {isEditing ? "Edit Match" : "Add New Match"}
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

          <Box display="flex" flexDirection="column" gap={2.5} pt={1}>
            {/* Club selection */}
            <Box display="flex" gap={2}>
              <TextField
                select
                label="Home Club"
                fullWidth
                required
                value={selectedMatch.home_club_id}
                onChange={(e) =>
                  setSelectedMatch({
                    ...selectedMatch,
                    home_club_id: e.target.value,
                  })
                }
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
              >
                {clubs.map((club) => (
                  <MenuItem key={club.id} value={club.id}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar
                        src={club.logo_url || undefined}
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: "4px",
                          bgcolor: "rgba(0,0,0,0.08)",
                        }}
                      >
                        {!club.logo_url && club.name.charAt(0)}
                      </Avatar>
                      {club.name}
                    </Box>
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Away Club"
                fullWidth
                required
                value={selectedMatch.away_club_id}
                onChange={(e) =>
                  setSelectedMatch({
                    ...selectedMatch,
                    away_club_id: e.target.value,
                  })
                }
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
              >
                {clubs.map((club) => (
                  <MenuItem key={club.id} value={club.id}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar
                        src={club.logo_url || undefined}
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: "4px",
                          bgcolor: "rgba(0,0,0,0.08)",
                        }}
                      >
                        {!club.logo_url && club.name.charAt(0)}
                      </Avatar>
                      {club.name}
                    </Box>
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            {/* Date & Time */}
            <Box display="flex" gap={2}>
              <TextField
                label="Match Date"
                type="date"
                fullWidth
                required
                value={selectedMatch.match_date}
                onChange={(e) =>
                  setSelectedMatch({
                    ...selectedMatch,
                    match_date: e.target.value,
                  })
                }
                InputLabelProps={{ shrink: true }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
              />
              <TextField
                label="Match Time"
                type="time"
                fullWidth
                value={selectedMatch.match_time}
                onChange={(e) =>
                  setSelectedMatch({
                    ...selectedMatch,
                    match_time: e.target.value,
                  })
                }
                InputLabelProps={{ shrink: true }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
              />
            </Box>

            {/* Venue & Remark */}
            <Box display="flex" gap={2}>
              <TextField
                label="Venue / Alamat"
                fullWidth
                value={selectedMatch.venue}
                onChange={(e) =>
                  setSelectedMatch({ ...selectedMatch, venue: e.target.value })
                }
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
              />
              <TextField
                label="Remark (Final, Liga, etc)"
                fullWidth
                value={selectedMatch.remark}
                onChange={(e) =>
                  setSelectedMatch({ ...selectedMatch, remark: e.target.value })
                }
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
              />
            </Box>

            {/* Score (optional — fill only if match is done) */}
            <Box>
              <Typography
                variant="subtitle2"
                fontWeight="700"
                mb={1}
                color="text.secondary"
              >
                Hasil Pertandingan (kosongkan jika belum selesai)
              </Typography>
              <Box display="flex" gap={2} alignItems="center">
                <TextField
                  label="Score Home"
                  type="number"
                  fullWidth
                  value={selectedMatch.score_home}
                  onChange={(e) =>
                    setSelectedMatch({
                      ...selectedMatch,
                      score_home: e.target.value,
                    })
                  }
                  inputProps={{ min: 0 }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                />
                <Typography
                  variant="h5"
                  fontWeight="800"
                  color="text.secondary"
                >
                  :
                </Typography>
                <TextField
                  label="Score Away"
                  type="number"
                  fullWidth
                  value={selectedMatch.score_away}
                  onChange={(e) =>
                    setSelectedMatch({
                      ...selectedMatch,
                      score_away: e.target.value,
                    })
                  }
                  inputProps={{ min: 0 }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                />
              </Box>
            </Box>

            <TextField
              select
              label="Hasil Akhir (Relatif ke Tim Kita)"
              fullWidth
              value={selectedMatch.result}
              onChange={(e) =>
                setSelectedMatch({
                  ...selectedMatch,
                  result: e.target.value,
                })
              }
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            >
              <MenuItem value="">Belum Ada Hasil</MenuItem>
              <MenuItem value="win">MENANG (WIN)</MenuItem>
              <MenuItem value="lose">KALAH (LOSE)</MenuItem>
              <MenuItem value="draw">SERI (DRAW)</MenuItem>
            </TextField>
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
            {saving ? "Saving..." : isEditing ? "Save Changes" : "Add Match"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
