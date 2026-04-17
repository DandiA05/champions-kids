"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff, ArrowBack } from "@mui/icons-material";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // If success, redirect based on role
      if (data.user.role === "admin") {
        router.push("/admin");
      } else if (data.user.role === "player") {
        router.push("/");
      } else {
        router.push("/");
      }

      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#0B3C5D", // Home page primary color
        backgroundImage:
          "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.05) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(0,0,0,0.2) 0%, transparent 40%)",
        py: 4,
      }}
    >
      <Container maxWidth="xs">
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Link
            href="/"
            style={{
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              color: "rgba(255,255,255,0.7)",
              marginBottom: "2rem",
            }}
          >
            <ArrowBack sx={{ mr: 1, fontSize: "1rem" }} />
            <Typography variant="body2">Back to Home</Typography>
          </Link>

          <Typography
            variant="h4"
            fontWeight="900"
            color="white"
            sx={{ textTransform: "uppercase", letterSpacing: "1px" }}
          >
            Member Login
          </Typography>
          <Typography variant="body2" color="rgba(255,255,255,0.6)">
            Enter your credentials to access your profile
          </Typography>
        </Box>

        <Paper
          elevation={24}
          sx={{
            p: 4,
            borderRadius: "24px",
            bgcolor: "rgba(255,255,255,1)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
          }}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: "12px" }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <TextField
                label="Email Address"
                type="email"
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                  },
                }}
              />
              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                  },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  mt: 1,
                  py: 1.5,
                  borderRadius: "12px",
                  bgcolor: "#0B3C5D",
                  fontWeight: "800",
                  fontSize: "1rem",
                  textTransform: "uppercase",
                  "&:hover": {
                    bgcolor: "#082d47",
                  },
                  boxShadow: "0 8px 16px rgba(11, 60, 93, 0.3)",
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Sign In"
                )}
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
