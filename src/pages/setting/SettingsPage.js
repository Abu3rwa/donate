import React, { useState, Suspense } from "react";
import "./settings.css";
import {
  Box,
  Drawer,
  IconButton,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { SECTIONS } from "./settingsSections";

const drawerWidth = 260;

const SettingsPage = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState(
    SECTIONS[0]?.key || ""
  );
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Assign a color to each icon based on its index for visual distinction
  const iconColors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.info.main,
    theme.palette.error.main,
    "#8e24aa", // purple
    "#00897b", // teal
    "#fbc02d", // yellow
    "#d84315", // deep orange
  ];

  const drawerContent = (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        minHeight: "100vh",
        bgcolor: { xs: "background.paper", sm: "background.default" },
        borderRight: { xs: "none", sm: `1px solid ${theme.palette.divider}` },
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        // boxShadow: { xs: 6, sm: 0, md: 2 },
        borderRadius: { xs: 0, sm: 3, md: 4 },
        transition: "all 0.2s",
        maxWidth: { xs: "100vw", sm: drawerWidth, md: 400 },
        alignItems: { md: "flex-end" },
        position: { md: "fixed" },
        left: { md: 0 },
        top: { md: 0 },
        height: { md: "100vh" },
        zIndex: 1200,
      }}
    >
      <Typography
        variant={isMobile ? "subtitle1" : "h6"}
        sx={{
          mb: { xs: 2, sm: 3 },
          textAlign: "center",
          fontWeight: 800,
          letterSpacing: 1,
          color: "primary.main",
        }}
      >
        إعدادات الموقع
      </Typography>
      <Divider sx={{ mb: { xs: 2, sm: 3 } }} />
      <List
        sx={{
          width: "100%",
          maxWidth: { md: 280 },
          p: 0,
          gap: 1.5,
          display: "flex",
          flexDirection: "column",
          mx: { md: "auto" },
        }}
      >
        {SECTIONS.map((section, idx) => (
          <ListItem
            button
            key={section.key}
            selected={selectedSection === section.key}
            onClick={() => {
              setSelectedSection(section.key);
              if (isMobile) setMobileOpen(false);
            }}
            sx={{
              borderRadius: 3,
              mb: 0.5,
              bgcolor:
                selectedSection === section.key ? "primary.50" : "transparent",
              "&.Mui-selected": {
                bgcolor: "primary.100",
                color: "primary.main",
              },
              transition: "background 0.2s",
              px: { xs: 2, sm: 3, md: 4 },
              py: { xs: 1.2, sm: 1.7, md: 2 },
              boxShadow: selectedSection === section.key ? 2 : 0,
              border:
                selectedSection === section.key
                  ? `1.5px solid ${theme.palette.primary.main}`
                  : "1.5px solid transparent",
              display: "flex",
              alignItems: "center",
              gap: 2,
              fontSize: { md: 18 },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 36,
                color: iconColors[idx % iconColors.length],
                fontSize: 26,
                mr: 1,
              }}
            >
              {section.icon}
            </ListItemIcon>
            <ListItemText
              primary={section.label}
              primaryTypographyProps={{
                fontSize: { xs: 15, sm: 17 },
                fontWeight: selectedSection === section.key ? 800 : 500,
                letterSpacing: 0.5,
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const SectionComponent = SECTIONS.find(
    (s) => s.key === selectedSection
  )?.component;

  return (
    <Box
      className="settings-page"
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: { xs: "background.default", sm: "transparent" },

        p: 0,
      }}
    >
      {/* Floating Drawer Button for mobile */}
      <IconButton
        color="primary"
        aria-label="open drawer"
        onClick={handleDrawerToggle}
        sx={{
          display: { xs: "flex", sm: "none" },
          position: "fixed",
          top: 12,
          left: 12,
          zIndex: 1301,
          bgcolor: "background.paper",
          boxShadow: 3,
          width: 48,
          height: 48,
          borderRadius: "50%",
          alignItems: "center",
          justifyContent: "center",
          border: `1.5px solid ${theme.palette.divider}`,
        }}
      >
        <MenuIcon fontSize="medium" />
      </IconButton>

      {/* Drawer for mobile, fixed box for desktop */}
      {isMobile ? (
        <Drawer
          className="settings-drawer"
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            width: "100%",
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: "80vw",
              maxWidth: 340,
              boxSizing: "border-box",
              borderRadius: 0,
              boxShadow: 6,
              left: 0,
              top: 0,
              bgcolor: "background.paper",
              border: "none",
              p: 0,
            },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        drawerContent
      )}

      <Box
        className="settings-content"
        component="main"
        sx={{
          flexGrow: 1,
          width: "100%",
          minHeight: "100vh",
          maxWidth: { md: "1100px", lg: "1400px" },
          mx: { md: "auto" },
          ml: { md: `${drawerWidth + 32}px` },
          // 32px extra for drawer padding/margin
          bgcolor: {
            xs: "rgba(255,255,255,0.95)",
            sm: "rgba(255,255,255,0.85)",
          },
          backdropFilter: { xs: "blur(0.5px)", sm: "blur(2px)" },
          borderRadius: { xs: 0, sm: 3, md: 4 },
          // boxShadow: { xs: "none", sm: 2, md: 4 },
          overflow: "auto",
          transition: "all 0.2s",
          p: { xs: 0, sm: 0, md: 3 },
          pb: { xs: 8, sm: 6, md: 8 },
        }}
      >
        <Suspense fallback={<div>Loading...</div>}>
          {SectionComponent && <SectionComponent />}
        </Suspense>
      </Box>
    </Box>
  );
};

export default SettingsPage;
