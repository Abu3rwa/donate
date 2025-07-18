import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { getOrgInfo } from "../../services/orgInfoService";
import { useAuth } from "../../contexts/AuthContext"; // Import useAuth

const baseNavLinks = [
  { label: "الرئيسية", to: "/" },
  { label: "عن الجمعية", to: "/about" },
  { label: "تبرع الآن", to: "/donate" },
  { label: "تواصل معنا", to: "/contact" },
  { label: "تسجيل الدخول", to: "/login" },
];

const HomeNavigation = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const [orgInfo, setOrgInfo] = useState({});
  const { user } = useAuth(); // Get user from AuthContext

  const [navLinks, setNavLinks] = useState(baseNavLinks);

  useEffect(() => {
    const fetchOrg = async () => {
      try {
        const info = await getOrgInfo();
        setOrgInfo(info || {});
      } catch (e) {
        setOrgInfo({});
      }
    };
    fetchOrg();
  }, []);

  useEffect(() => {
    if (user && user.adminType) {
      setNavLinks([...baseNavLinks, { label: "لوحة التحكم", to: "/dashboard" }]);
    } else {
      setNavLinks(baseNavLinks);
    }
  }, [user]);

  const handleDrawerToggle = () => setDrawerOpen((open) => !open);

  return (
    <AppBar
      position="sticky"
      elevation={6}
      sx={{
        zIndex: 1201,
        background:
          "linear-gradient(90deg, #0ea5e9 0%, #22d3ee 60%, #10b981 100%)",
        boxShadow: "0 4px 24px 0 rgba(16,185,129,0.10)",
      }}
    >
      <Toolbar className="flex justify-between">
        {/* Logo/Brand */}
        <Box
          component={RouterLink}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            flexGrow: 1,
            gap: 2,
            textDecoration: "none",
            minHeight: 70,
            py: { xs: 0.5, sm: 1 },
            px: { xs: 0, sm: 1.5 },
            "&:hover": { textDecoration: "none" },
          }}
        >
          {orgInfo.logo && (
            <img
              src={orgInfo.logo}
              alt={orgInfo.name || orgInfo.longName || "Logo"}
              style={{
                height: 60,
                width: 60,
                objectFit: "contain",
                borderRadius: 8,
                background: "#fff",
                boxShadow: "0 2px 8px rgba(16,185,129,0.10)",
              }}
            />
          )}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                color: "white",
                fontWeight: 900,
                fontFamily: "inherit",
                letterSpacing: "-1px",
                fontSize: { xs: "1.3rem", sm: "1.7rem", md: "2rem" },
                textShadow: "0 2px 8px rgba(16,185,129,0.18), 0 1px 0 #0ea5e9",
                lineHeight: 1.1,
              }}
            >
              {orgInfo.name || "سخاء"}
            </Typography>
            {orgInfo.longName && orgInfo.longName !== orgInfo.name && (
              <Typography
                variant="subtitle2"
                sx={{
                  color: "rgba(255,255,255,0.85)",
                  fontWeight: 500,
                  fontSize: { xs: "0.85rem", sm: "1rem" },
                  lineHeight: 1.2,
                  textShadow: "0 1px 4px rgba(16,185,129,0.10)",
                  mt: 0.2,
                }}
              >
                {orgInfo.longName}
              </Typography>
            )}
          </Box>
        </Box>
        {/* Desktop Nav */}
        <Box className="hidden md:flex gap-2">
          {navLinks.map((link) => (
            <Button
              key={link.to}
              component={RouterLink}
              to={link.to}
              color="inherit"
              sx={{
                fontWeight: 700,
                color:
                  location.pathname === link.to
                    ? "#fff"
                    : "rgba(255,255,255,0.85)",
                background:
                  location.pathname === link.to
                    ? "rgba(16,185,129,0.18)"
                    : "transparent",
                borderRadius: 999,
                px: 3,
                boxShadow:
                  location.pathname === link.to
                    ? "0 2px 8px 0 rgba(16,185,129,0.10)"
                    : "none",
                textShadow:
                  location.pathname === link.to
                    ? "0 1px 4px rgba(16,185,129,0.18)"
                    : "none",
                transition: "all 0.18s",
                "&:hover": {
                  background: "rgba(16,185,129,0.22)",
                  color: "#fff",
                },
              }}
            >
              {link.label}
            </Button>
          ))}
        </Box>
        {/* Mobile Menu Button */}
        <Box className="md:hidden">
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleDrawerToggle}
            aria-label="open drawer"
          >
            <MenuIcon />
          </IconButton>
        </Box>
      </Toolbar>
      {/* Mobile Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerToggle}>
        <Box
          sx={{ width: 240 }}
          role="presentation"
          onClick={handleDrawerToggle}
        >
          <List>
            {navLinks.map((link) => (
              <ListItem
                button
                key={link.to}
                component={RouterLink}
                to={link.to}
                selected={location.pathname === link.to}
                sx={{
                  background:
                    location.pathname === link.to
                      ? "rgba(16,185,129,0.12)"
                      : "transparent",
                  color: location.pathname === link.to ? "#0ea5e9" : "inherit",
                  fontWeight: location.pathname === link.to ? 800 : 600,
                  borderRadius: 999,
                  mb: 0.5,
                  "&:hover": {
                    background: "rgba(16,185,129,0.18)",
                  },
                }}
              >
                <ListItemText primary={link.label} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default HomeNavigation;
