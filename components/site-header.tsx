"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Box,
  Button,
  Typography,
  Divider,
  CircularProgress,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import DashboardIcon from "@mui/icons-material/Dashboard";

interface SiteHeaderProps {
  isHomePage?: boolean;
}

export function SiteHeader({ isHomePage = false }: SiteHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Fetch user error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [pathname]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      handleMenuClose();
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      <header
        className={`header header-sticky default inner-page-header ${
          !isHomePage ? "inner-page-header" : ""
        }`}
      >
        <nav className="navbar navbar-static-top navbar-expand-xl">
          <div className="container-fluid main-header position-relative">
            <button
              type="button"
              className="navbar-toggler"
              data-bs-toggle="collapse"
              data-bs-target=".navbar-collapse"
            >
              <i className="fas fa-align-left"></i>
            </button>
            <Link className="navbar-brand" href="/">
              <img
                width={180}
                height={60}
                className="logo img-fluid"
                src="/images/logo-champions-kids.png"
                alt="logo"
                style={{
                  objectFit: "contain",
                }}
              />
              <img
                width={180}
                height={60}
                className="sticky-logo img-fluid"
                src="/images/logo-champions-kids.png"
                alt="logo"
              />
            </Link>
            <div className="navbar-collapse collapse">
              <ul className="nav navbar-nav">
                <li className="dropdown nav-item">
                  <Link className="nav-link" href="/">
                    Home
                  </Link>
                </li>

                <li className="dropdown nav-item">
                  <Link className="nav-link" href="/team">
                    Team
                  </Link>
                </li>

                <li className="dropdown nav-item">
                  <Link className="nav-link" href="/event">
                    Event
                  </Link>
                </li>
                <li className="dropdown nav-item">
                  <Link className="nav-link" href="/calendar">
                    Calendar
                  </Link>
                </li>
                <li className="dropdown nav-item">
                  <Link className="nav-link" href="/about-us">
                    About us
                  </Link>
                </li>
              </ul>
            </div>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                marginLeft: 4,
              }}
            >
              {loading ? (
                <CircularProgress
                  size={20}
                  color="inherit"
                  sx={{ opacity: 0.5 }}
                />
              ) : user ? (
                <Box>
                  <IconButton
                    onClick={handleMenuOpen}
                    sx={{ p: 0.5, border: "2px solid rgba(255,255,255,0.2)" }}
                  >
                    <Avatar
                      sx={{
                        width: 35,
                        height: 35,
                        bgcolor: user.role === "admin" ? "#ffcc00" : "#2196f3",
                        fontSize: "0.9rem",
                        fontWeight: "bold",
                        color: user.role === "admin" ? "black" : "white",
                      }}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </Avatar>
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    PaperProps={{
                      sx: {
                        mt: 1.5,
                        borderRadius: "15px",
                        minWidth: 200,
                        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                        p: 1,
                      },
                    }}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  >
                    <Box sx={{ px: 2, py: 1.5 }}>
                      <Typography variant="subtitle2" fontWeight="800">
                        {user.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        sx={{ textTransform: "capitalize" }}
                      >
                        {user.role} Member
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />

                    {user.role === "player" && (
                      <MenuItem
                        onClick={() => {
                          handleMenuClose();
                          router.push(`/profile/${user.id}`);
                        }}
                        sx={{ borderRadius: "8px", py: 1 }}
                      >
                        <PersonIcon
                          sx={{
                            mr: 1.5,
                            fontSize: 20,
                            color: "text.secondary",
                          }}
                        />
                        My Profile
                      </MenuItem>
                    )}

                    {user.role === "admin" && (
                      <MenuItem
                        onClick={() => {
                          handleMenuClose();
                          router.push("/admin");
                        }}
                        sx={{ borderRadius: "8px", py: 1 }}
                      >
                        <DashboardIcon
                          sx={{
                            mr: 1.5,
                            fontSize: 20,
                            color: "text.secondary",
                          }}
                        />
                        Admin Dashboard
                      </MenuItem>
                    )}

                    <MenuItem
                      onClick={handleLogout}
                      sx={{ borderRadius: "8px", py: 1, color: "error.main" }}
                    >
                      <LogoutIcon sx={{ mr: 1.5, fontSize: 20 }} />
                      Logout
                    </MenuItem>
                  </Menu>
                </Box>
              ) : (
                <Link href="/login" passHref>
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: "#F5A623",
                      color: "black",
                      fontWeight: "800",
                      borderRadius: "30px",
                      px: 3,
                      fontSize: "0.8rem",
                      textTransform: "uppercase",
                      "&:hover": {
                        bgcolor: "white",
                        color: "black",
                      },
                    }}
                  >
                    Login
                  </Button>
                </Link>
              )}

              <div className="add-listing d-none d-sm-block">
                <div className="side-menu">
                  <a
                    href="#"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasRight"
                    aria-controls="offcanvasRight"
                  >
                    <img src="/images/svg/menu.svg" alt="#" />
                    <img
                      className="menu-dark"
                      src="/images/svg/menu.svg"
                      alt="#"
                    />
                  </a>
                </div>
              </div>
            </Box>
          </div>
        </nav>
      </header>

      <div
        className="offcanvas offcanvas-end offcanvas-sidebar-menu"
        tabIndex={-1}
        id="offcanvasRight"
      >
        <div className="offcanvas-header text-end justify-content-end p-4">
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="offcanvas-body p-4 p-sm-5 d-flex align-content-between flex-wrap justify-content-center">
          <div className="sidebar-menu">
            <div className="sidebar-logo">
              <Link href="/">
                <img
                  className="logo img-fluid"
                  src="/images/logo.svg"
                  alt="logo"
                  style={{
                    objectFit: "contain",
                    height: "300px",
                    width: "100%",
                  }}
                />
              </Link>
            </div>
            <div className="section-title mt-5">
              <h3 className="title text-white">About us</h3>
              <p className="text-white">
                Champion Kids is a premier football academy dedicated to
                nurturing young talents and developing the next generation of
                football stars.
              </p>
            </div>
            <div className="mt-5">
              <h3 className="mb-3 text-white">Contact Info</h3>
              <p className="text-white">Jakarta, Indonesia</p>
              <h2 className="text-white">0812-XXXX-XXXX</h2>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
