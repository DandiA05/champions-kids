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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

interface Club {
  id: number;
  name: string;
  logo_url: string | null;
}

interface Match {
  id: number;
  home_club_id: number;
  away_club_id: number;
  home_club_name: string;
  home_club_logo: string | null;
  away_club_name: string;
  away_club_logo: string | null;
  match_date: string;
  match_time: string | null;
  venue: string | null;
  score_home: number | null;
  score_away: number | null;
  created_at: string;
}

const initialMatchState = {
  home_club_id: "",
  away_club_id: "",
  match_date: "",
  match_time: "",
  venue: "",
  score_home: "",
  score_away: "",
};

export default function MatchManagementPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<any>(initialMatchState);

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
          ? new Date(match.match_date).toISOString().split("T")[0]
          : "",
        match_time: match.match_time || "",
        venue: match.venue || "",
        score_home: match.score_home !== null ? String(match.score_home) : "",
        score_away: match.score_away !== null ? String(match.score_away) : "",
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

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

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
                <TableCell sx={{ fontWeight: "700", py: 2.5 }}>Match</TableCell>
                <TableCell sx={{ fontWeight: "700" }}>Score</TableCell>
                <TableCell sx={{ fontWeight: "700" }}>Date</TableCell>
                <TableCell sx={{ fontWeight: "700" }}>Time</TableCell>
                <TableCell sx={{ fontWeight: "700" }}>Venue</TableCell>
                <TableCell sx={{ fontWeight: "700" }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: "700" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {matches.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    align="center"
                    sx={{ py: 6, color: "text.secondary" }}
                  >
                    No matches found. Add your first match!
                  </TableCell>
                </TableRow>
              ) : (
                matches.map((match) => (
                  <TableRow
                    key={match.id}
                    hover
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    {/* Match column: Home vs Away */}
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
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
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
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

                    {/* Status badge */}
                    <TableCell>
                      <Chip
                        label={isMatchFinished(match) ? "Selesai" : "Upcoming"}
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
                          "&:hover": { bgcolor: "error.light", color: "white" },
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

            {/* Venue */}
            <TextField
              label="Venue / Alamat"
              fullWidth
              value={selectedMatch.venue}
              onChange={(e) =>
                setSelectedMatch({ ...selectedMatch, venue: e.target.value })
              }
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            />

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
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={handleCloseDialog} sx={{ textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 700,
              px: 3,
            }}
          >
            {isEditing ? "Save Changes" : "Add Match"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
