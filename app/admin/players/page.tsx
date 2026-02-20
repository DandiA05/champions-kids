"use client";

import { useEffect, useState, useMemo, ReactNode } from "react";
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
  Tabs,
  Tab,
  Divider,
  Chip,
  DialogContentText,
  TablePagination,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import {
  CldUploadWidget,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { AGE_CATEGORIES, POSITIONS } from "@/lib/constants";

interface Player {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  position: string;
  nationality: string;
  current_team: string;
  past_teams: string;
  birthday: string;
  photo_url: string;
  biography: string;
  // Attributes & Stats
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
  appearances: number;
  goals: number;
  assists: number;
  yellow_cards: number;
  red_cards: number;
  mom: number;
  is_active: boolean;
  is_top_player: boolean;
  jersey_number: number;
  age_category: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`player-tabpanel-${index}`}
      aria-labelledby={`player-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const initialPlayerState = {
  user_id: 0,
  position: "",
  jersey_number: 0,
  age_category: "U7",
  past_teams: "",
  birthday: "",
  photo_url: "",
  biography: "",
  pace: 0,
  shooting: 0,
  passing: 0,
  dribbling: 0,
  defending: 0,
  physical: 0,
  appearances: 0,
  goals: 0,
  assists: 0,
  yellow_cards: 0,
  red_cards: 0,
  mom: 0,
  is_active: true,
  is_top_player: false,
};

export default function PlayerManagementPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dialog State
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedPlayer, setSelectedPlayer] = useState<any>(initialPlayerState);
  const [tabValue, setTabValue] = useState(0);

  const [confirmStatusOpen, setConfirmStatusOpen] = useState(false);
  const [playerToToggle, setPlayerToToggle] = useState<Player | null>(null);

  // Photo Preview State
  const [previewImageOpen, setPreviewImageOpen] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState("");

  // Sort & Filter State
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterAgeCategory, setFilterAgeCategory] = useState<string>("all");
  const [filterPosition, setFilterPosition] = useState<string>("all");
  const [filterTopPlayer, setFilterTopPlayer] = useState<string>("all");

  // Fetch Data
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Players
      const playersRes = await fetch("/api/admin/players");
      const playersData = await playersRes.json();

      // Fetch Users (to select from for new player)
      const usersRes = await fetch("/api/admin/users");
      const usersData = await usersRes.json();

      if (playersRes.ok && usersRes.ok) {
        setPlayers(playersData.players);
        // Filter users who have role 'player'
        const playerRoleUsers = usersData.users.filter(
          (u: User) => u.role === "player",
        );
        setUsers(playerRoleUsers);
      } else {
        setError("Failed to fetch data");
      }
    } catch {
      setError("An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedPlayers = useMemo(() => {
    return players
      .filter((player) => {
        const matchAge =
          filterAgeCategory === "all" ||
          player.age_category === filterAgeCategory;
        const matchPosition =
          filterPosition === "all" || player.position === filterPosition;
        const matchTop =
          filterTopPlayer === "all" ||
          (filterTopPlayer === "yes" && player.is_top_player) ||
          (filterTopPlayer === "no" && !player.is_top_player);
        return matchAge && matchPosition && matchTop;
      })
      .sort((a, b) => {
        let valA: string | number;
        let valB: string | number;

        if (sortBy === "ovr") {
          valA = calculateOVR(a);
          valB = calculateOVR(b);
        } else if (sortBy === "name") {
          valA = (a.user_name || "").toLowerCase();
          valB = (b.user_name || "").toLowerCase();
        } else if (sortBy === "jersey_number") {
          valA = Number(a.jersey_number) || 0;
          valB = Number(b.jersey_number) || 0;
        } else {
          // Default: created_at or other
          valA = a.id;
          valB = b.id;
        }

        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
  }, [
    players,
    sortBy,
    sortOrder,
    filterAgeCategory,
    filterPosition,
    filterTopPlayer,
  ]);

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenDialog = (player?: Player) => {
    setTabValue(0);
    if (player) {
      setIsEditing(true);
      // Ensure date is formatted for input type="date"
      const formattedPlayer = {
        ...player,
        birthday: player.birthday
          ? new Date(player.birthday).toISOString().split("T")[0]
          : "",
      };
      setSelectedPlayer(formattedPlayer);
    } else {
      setIsEditing(false);
      setSelectedPlayer(initialPlayerState);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPlayer(initialPlayerState);
    setError(null);
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

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSave = async () => {
    try {
      const url = isEditing
        ? `/api/admin/players/${selectedPlayer.id}`
        : "/api/admin/players";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedPlayer),
      });

      const data = await res.json();

      if (res.ok) {
        handleCloseDialog();
        fetchData();
      } else {
        setError(data.error || "Failed to save player");
      }
    } catch {
      setError("An error occurred while saving");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this player profile?"))
      return;

    try {
      const res = await fetch(`/api/admin/players/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchData();
      } else {
        alert("Failed to delete player");
      }
    } catch {
      alert("Error deleting player");
    }
  };

  const handleToggleStatusClick = (player: Player) => {
    setPlayerToToggle(player);
    setConfirmStatusOpen(true);
  };

  const handleConfirmToggleStatus = async () => {
    if (!playerToToggle) return;

    try {
      // Send the full player object with toggled status since the current API expects all fields
      const updatedData = {
        ...playerToToggle,
        is_active: !playerToToggle.is_active,
      };

      const res = await fetch(`/api/admin/players/${playerToToggle.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (res.ok) {
        fetchData();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to update status");
      }
    } catch {
      setError("An error occurred while updating status");
    } finally {
      setConfirmStatusOpen(false);
      setPlayerToToggle(null);
    }
  };

  const handleUploadSuccess = (result: CloudinaryUploadWidgetResults) => {
    if (
      result.event === "success" &&
      result.info &&
      typeof result.info !== "string"
    ) {
      setSelectedPlayer({
        ...selectedPlayer,
        photo_url: result.info.secure_url,
      });
    }
  };

  const getPositionColor = (pos: string) => {
    const attackers = ["ST", "CF", "LW", "RW"];
    const midfielders = ["CM", "AM", "DM"];
    const defenders = ["CB", "LB", "RB"];

    if (attackers.includes(pos)) return "#d32f2f"; // Red
    if (midfielders.includes(pos)) return "#2e7d32"; // Green
    if (defenders.includes(pos)) return "#0288d1"; // Blue
    if (pos === "GK") return "#ed6c02"; // Gold/Orange
    return "rgba(0,0,0,0.04)";
  };

  const calculateOVR = (player: Player | Partial<Player>) => {
    const { pace, shooting, passing, dribbling, defending, physical } = player;
    const total =
      (Number(pace) || 0) +
      (Number(shooting) || 0) +
      (Number(passing) || 0) +
      (Number(dribbling) || 0) +
      (Number(defending) || 0) +
      (Number(physical) || 0);
    return Math.round(total / 6);
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
          Player Management
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
          Add New Player
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
        >
          {error}
        </Alert>
      )}

      {/* Filter & Sort Section */}
      <Paper
        sx={{
          p: 3,
          mb: 4,
          borderRadius: "20px",
          border: "1px solid rgba(0,0,0,0.05)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
        }}
      >
        <Box display="flex" flexDirection="column" gap={3}>
          {/* Sorting Section */}
          <Box>
            <Typography
              variant="subtitle2"
              fontWeight="800"
              mb={2}
              color="primary"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <Box
                sx={{
                  width: 4,
                  height: 16,
                  bgcolor: "primary.main",
                  borderRadius: 1,
                }}
              />
              Sorting Options
            </Typography>
            <div className="d-flex flex-wrap gap-4">
              <div style={{ minWidth: "200px", flex: 1 }}>
                <TextField
                  select
                  label="Sort By"
                  fullWidth
                  size="small"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                >
                  <MenuItem value="created_at">Date Added</MenuItem>
                  <MenuItem value="name">Name</MenuItem>
                  <MenuItem value="ovr">OVR Rating</MenuItem>
                  <MenuItem value="jersey_number">Jersey No</MenuItem>
                </TextField>
              </div>
              <div style={{ minWidth: "150px", flex: 1 }}>
                <TextField
                  select
                  label="Order"
                  fullWidth
                  size="small"
                  value={sortOrder}
                  onChange={(e) =>
                    setSortOrder(e.target.value as "asc" | "desc")
                  }
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                >
                  <MenuItem value="asc">Ascending</MenuItem>
                  <MenuItem value="desc">Descending</MenuItem>
                </TextField>
              </div>
              <div style={{ flex: 2 }} /> {/* Spacer */}
            </div>
          </Box>

          <Divider />

          {/* Filtering Section */}
          <Box>
            <Typography
              variant="subtitle2"
              fontWeight="800"
              mb={2}
              color="primary"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <Box
                sx={{
                  width: 4,
                  height: 16,
                  bgcolor: "primary.main",
                  borderRadius: 1,
                }}
              />
              Filter Players
            </Typography>
            <div className="d-flex flex-wrap gap-4">
              <div style={{ minWidth: "180px", flex: 1 }}>
                <TextField
                  select
                  label="Age Category"
                  fullWidth
                  size="small"
                  value={filterAgeCategory}
                  onChange={(e) => setFilterAgeCategory(e.target.value)}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  {AGE_CATEGORIES.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
              <div style={{ minWidth: "180px", flex: 1 }}>
                <TextField
                  select
                  label="Position"
                  fullWidth
                  size="small"
                  value={filterPosition}
                  onChange={(e) => setFilterPosition(e.target.value)}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                >
                  <MenuItem value="all">All Positions</MenuItem>
                  {POSITIONS.map((pos) => (
                    <MenuItem key={pos.code} value={pos.code}>
                      {pos.label}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
              <div style={{ minWidth: "150px", flex: 1 }}>
                <TextField
                  select
                  label="Top Player"
                  fullWidth
                  size="small"
                  value={filterTopPlayer}
                  onChange={(e) => setFilterTopPlayer(e.target.value)}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                >
                  <MenuItem value="all">Any Status</MenuItem>
                  <MenuItem value="yes">Top Only (⭐)</MenuItem>
                  <MenuItem value="no">Normal Only</MenuItem>
                </TextField>
              </div>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-end",
                  pb: 0.5,
                  minWidth: "100px",
                }}
              >
                <Button
                  size="small"
                  color="inherit"
                  onClick={() => {
                    setFilterAgeCategory("all");
                    setFilterPosition("all");
                    setFilterTopPlayer("all");
                    setSortBy("created_at");
                    setSortOrder("desc");
                  }}
                  sx={{ fontWeight: "700", textTransform: "none" }}
                >
                  Clear Filters
                </Button>
              </Box>
            </div>
          </Box>
        </Box>
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
                <TableCell sx={{ fontWeight: "700", py: 2.5 }}>
                  Player
                </TableCell>
                <TableCell sx={{ fontWeight: "700" }}>Jersey No</TableCell>
                <TableCell sx={{ fontWeight: "700" }}>Age Category</TableCell>
                <TableCell sx={{ fontWeight: "700" }}>Position</TableCell>
                <TableCell sx={{ fontWeight: "700" }}>Top</TableCell>
                <TableCell sx={{ fontWeight: "700" }}>OVR</TableCell>
                <TableCell sx={{ fontWeight: "700" }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: "700" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAndSortedPlayers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    align="center"
                    sx={{ py: 6, color: "text.secondary" }}
                  >
                    No players found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedPlayers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((player, index) => (
                    <TableRow
                      key={player.id}
                      hover
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>{page * rowsPerPage + index + 1}.</TableCell>
                      <TableCell>
                        {player.photo_url ? (
                          <Box
                            onClick={() => {
                              setPreviewImageUrl(player.photo_url);
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
                              src={player.photo_url}
                              variant="rounded"
                              sx={{
                                width: 48,
                                height: 64, // 3:4 ratio (48/64 = 0.75)
                                borderRadius: "8px",
                                bgcolor: "#fff",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                "& img": {
                                  objectFit: "cover",
                                },
                              }}
                            />
                          </Box>
                        ) : (
                          <Avatar
                            variant="rounded"
                            sx={{
                              width: 48,
                              height: 64,
                              borderRadius: "8px",
                              bgcolor: "rgba(0,0,0,0.05)",
                            }}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Box>
                            <Typography
                              variant="body2"
                              fontWeight="700"
                              color="black"
                            >
                              {player.user_name || "Unknown"}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="textSecondary"
                              display="block"
                            >
                              {player.user_email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          fontWeight="700"
                          color="primary"
                        >
                          #{player.jersey_number || "0"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "inline-block",
                            px: 1.5,
                            py: 0.5,
                            borderRadius: "8px",
                            bgcolor: "primary.main",
                            color: "white",
                            fontSize: "0.75rem",
                            fontWeight: "700",
                          }}
                        >
                          {player.age_category || "N/A"}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "inline-block",
                            px: 1.5,
                            py: 0.5,
                            borderRadius: "8px",
                            bgcolor: getPositionColor(player.position),
                            color: player.position ? "white" : "inherit",
                            fontSize: "0.75rem",
                            fontWeight: "700",
                          }}
                        >
                          {player.position || "N/A"}
                        </Box>
                      </TableCell>
                      <TableCell>
                        {player.is_top_player ? (
                          <StarIcon sx={{ color: "#ffc107" }} />
                        ) : (
                          <StarBorderIcon sx={{ color: "rgba(0,0,0,0.1)" }} />
                        )}
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 40,
                            height: 40,
                            borderRadius: "10px",
                            bgcolor: "rgba(0,0,0,0.04)",
                            fontWeight: "800",
                            fontSize: "1.1rem",
                            color: "primary.main",
                            border: "2px solid",
                            borderColor: "primary.light",
                          }}
                        >
                          {calculateOVR(player)}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={player.is_active ? "Active" : "Inactive"}
                          color={player.is_active ? "success" : "error"}
                          variant="outlined"
                          size="small"
                          onClick={() => handleToggleStatusClick(player)}
                          sx={{
                            fontWeight: "700",
                            borderRadius: "8px",
                            cursor: "pointer",
                            "&:hover": {
                              bgcolor: player.is_active
                                ? "success.light"
                                : "error.light",
                              opacity: 0.8,
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(player)}
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
                          onClick={() => handleDelete(player.id)}
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
            count={filteredAndSortedPlayers.length}
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
        PaperProps={{
          sx: { borderRadius: "24px", p: 1 },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h5" fontWeight="800">
            {isEditing ? "Edit Player Profile" : "Register New Player"}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {isEditing
              ? "Update skills and stats"
              : "Connect a user to a player profile"}
          </Typography>
        </DialogTitle>

        <Box sx={{ px: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              mb: 1,
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: "700",
                minWidth: 100,
              },
            }}
          >
            <Tab label="Profile" />
            <Tab label="Attributes" />
            <Tab label="Statistics" />
          </Tabs>
        </Box>

        <DialogContent sx={{ minHeight: "400px" }}>
          <TabPanel value={tabValue} index={0}>
            <div className="grid grid-cols-12  d-flex flex-column gap-4">
              {!isEditing && (
                <div className="col-span-12">
                  <TextField
                    select
                    label="Select Existing User"
                    fullWidth
                    value={selectedPlayer.user_id}
                    onChange={(e) =>
                      setSelectedPlayer({
                        ...selectedPlayer,
                        user_id: Number(e.target.value),
                      })
                    }
                    helperText="Only users with role 'player' are shown here."
                    sx={{
                      "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                    }}
                  >
                    <MenuItem value={0} disabled>
                      Select a user...
                    </MenuItem>
                    {users.map((user) => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
              )}

              <div className="col-span-12">
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
                    src={selectedPlayer.photo_url}
                    sx={{
                      width: 80,
                      height: 80,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Box>
                    <Typography
                      variant="subtitle2"
                      fontWeight="700"
                      gutterBottom
                    >
                      Profile Photo
                    </Typography>
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      display="block"
                      sx={{ mb: 1, fontSize: "0.7rem" }}
                    >
                      Recommended: 600x800 px (3:4 aspect ratio) for best
                      display.
                    </Typography>
                    <CldUploadWidget
                      uploadPreset={
                        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ||
                        "champions_kids"
                      }
                      onSuccess={handleUploadSuccess}
                      options={{
                        maxFiles: 1,
                        resourceType: "image",
                        clientAllowedFormats: ["jpg", "png", "webp"],
                      }}
                    >
                      {({ open }) => (
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => open()}
                          sx={{ borderRadius: "8px", textTransform: "none" }}
                        >
                          {selectedPlayer.photo_url
                            ? "Change Photo"
                            : "Upload Photo"}
                        </Button>
                      )}
                    </CldUploadWidget>
                  </Box>
                </Box>
              </div>

              <div className="col-span-12 sm:col-span-6">
                <TextField
                  label="Jersey Number"
                  type="number"
                  fullWidth
                  value={selectedPlayer.jersey_number}
                  onChange={(e) =>
                    setSelectedPlayer({
                      ...selectedPlayer,
                      jersey_number: parseInt(e.target.value),
                    })
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                  }}
                />
              </div>

              <div className="col-span-12 sm:col-span-6">
                <TextField
                  select
                  label="Age Category"
                  fullWidth
                  value={selectedPlayer.age_category}
                  onChange={(e) =>
                    setSelectedPlayer({
                      ...selectedPlayer,
                      age_category: e.target.value,
                    })
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                  }}
                >
                  {AGE_CATEGORIES.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </TextField>
              </div>

              <div className="col-span-12 sm:col-span-6">
                <TextField
                  select
                  label="Position"
                  fullWidth
                  value={selectedPlayer.position}
                  onChange={(e) =>
                    setSelectedPlayer({
                      ...selectedPlayer,
                      position: e.target.value,
                    })
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                  }}
                >
                  {POSITIONS.map((pos) => (
                    <MenuItem key={pos.code} value={pos.code}>
                      {pos.label}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
              <div className="col-span-12 sm:col-span-6">
                <TextField
                  label="Birthday"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={selectedPlayer.birthday}
                  onChange={(e) =>
                    setSelectedPlayer({
                      ...selectedPlayer,
                      birthday: e.target.value,
                    })
                  }
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                />
              </div>

              <div className="col-span-12 sm:col-span-6">
                <TextField
                  select
                  label="Top Player?"
                  fullWidth
                  value={selectedPlayer.is_top_player ? "yes" : "no"}
                  onChange={(e) =>
                    setSelectedPlayer({
                      ...selectedPlayer,
                      is_top_player: e.target.value === "yes",
                    })
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                  }}
                >
                  <MenuItem value="no">No</MenuItem>
                  <MenuItem value="yes">Yes</MenuItem>
                </TextField>
              </div>

              <div className="col-span-12">
                <TextField
                  label="Biography"
                  fullWidth
                  multiline
                  rows={3}
                  value={selectedPlayer.biography}
                  onChange={(e) =>
                    setSelectedPlayer({
                      ...selectedPlayer,
                      biography: e.target.value,
                    })
                  }
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                />
              </div>
            </div>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box
              mb={3}
              p={3}
              sx={{
                bgcolor: "#fafafa",
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                border: "1px solid rgba(0,0,0,0.05)",
              }}
            >
              <Box>
                <Typography variant="h6" fontWeight="800">
                  Overall Rating (OVR)
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Average performance based on core skills
                </Typography>
              </Box>
              <Typography variant="h3" fontWeight="900" color="primary">
                {calculateOVR(selectedPlayer)}
              </Typography>
            </Box>
            <Box mb={2}>
              <Typography variant="subtitle2" color="primary" fontWeight="700">
                Physical & Technical Skills
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Scale from 0 to 100
              </Typography>
            </Box>
            <div className="grid grid-cols-12  d-flex flex-column gap-4">
              {[
                "pace",
                "shooting",
                "passing",
                "dribbling",
                "defending",
                "physical",
              ].map((attr) => (
                <div className="col-span-12 sm:col-span-6" key={attr}>
                  <TextField
                    label={attr.charAt(0).toUpperCase() + attr.slice(1)}
                    type="number"
                    fullWidth
                    value={selectedPlayer[attr]}
                    inputProps={{ min: 0, max: 100 }}
                    onChange={(e) =>
                      setSelectedPlayer({
                        ...selectedPlayer,
                        [attr]: Number(e.target.value),
                      })
                    }
                    sx={{
                      "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                    }}
                  />
                </div>
              ))}
            </div>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Box mb={2}>
              <Typography variant="subtitle2" color="primary" fontWeight="700">
                Career Statistics
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Season totals
              </Typography>
            </Box>
            <div className="grid grid-cols-12  d-flex flex-column gap-4">
              {[
                { key: "appearances", label: "Appearances" },
                { key: "goals", label: "Goals Scored" },
                { key: "assists", label: "Assists" },
                { key: "yellow_cards", label: "Yellow Cards" },
                { key: "red_cards", label: "Red Cards" },
                { key: "mom", label: "Man of the Match" },
              ].map((stat) => (
                <div className="col-span-12 sm:col-span-6" key={stat.key}>
                  <TextField
                    label={stat.label}
                    type="number"
                    fullWidth
                    value={selectedPlayer[stat.key]}
                    inputProps={{ min: 0 }}
                    onChange={(e) =>
                      setSelectedPlayer({
                        ...selectedPlayer,
                        [stat.key]: Number(e.target.value),
                      })
                    }
                    sx={{
                      "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                    }}
                  />
                </div>
              ))}
            </div>
          </TabPanel>
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
            variant="contained"
            onClick={handleSave}
            disabled={!selectedPlayer.user_id && !isEditing}
            sx={{
              borderRadius: "12px",
              px: 4,
              textTransform: "none",
              fontWeight: "600",
              boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
            }}
          >
            {isEditing ? "Update Player" : "Save Profile"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Status Confirmation Dialog */}
      <Dialog
        open={confirmStatusOpen}
        onClose={() => setConfirmStatusOpen(false)}
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
            {playerToToggle?.is_active ? "deactivate" : "activate"} player{" "}
            <strong>{playerToToggle?.user_name}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setConfirmStatusOpen(false)}
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
            color={playerToToggle?.is_active ? "error" : "primary"}
            sx={{
              borderRadius: "10px",
              fontWeight: "600",
              textTransform: "none",
              boxShadow: playerToToggle?.is_active
                ? "0 4px 12px rgba(211, 47, 47, 0.3)"
                : "0 4px 12px rgba(25, 118, 210, 0.3)",
            }}
          >
            Confirm
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
            alt="Profile Preview"
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
