"use client";

import { useEffect, useState } from "react";
import { Box, Card, CardContent, Grid, Typography, Paper } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

interface Stats {
  totalUsers: number;
  adminUsers: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, adminUsers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        const totalUsers = data.users.length;
        const adminUsers = data.users.filter(
          (u: any) => u.role === "admin",
        ).length;
        setStats({ totalUsers, adminUsers });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Dashboard
      </Typography>

      <Typography variant="body1" color="text.secondary" paragraph>
        Welcome to the admin panel. Manage users and view system statistics.
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card elevation={3}>
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Users
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    {loading ? "..." : stats.totalUsers}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    bgcolor: "primary.main",
                    borderRadius: 2,
                    p: 2,
                    color: "white",
                  }}
                >
                  <PeopleIcon fontSize="large" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card elevation={3}>
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Admin Users
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    {loading ? "..." : stats.adminUsers}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    bgcolor: "secondary.main",
                    borderRadius: 2,
                    p: 2,
                    color: "white",
                  }}
                >
                  <AdminPanelSettingsIcon fontSize="large" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Quick Actions
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Use the sidebar to navigate to User Management and other sections.
        </Typography>
      </Paper>
    </Box>
  );
}
