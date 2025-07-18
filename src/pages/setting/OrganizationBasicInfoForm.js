import React, { useState, useEffect } from "react";
import {
  getName,
  getLongName,
  getDescription,
  getLogo,
  updateName,
  updateLongName,
  updateDescription,
  updateLogo,
  uploadFile,
} from "../../services/orgInfoService";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  useTheme,
  useMediaQuery,
  Stack,
} from "@mui/material";

const OrganizationBasicInfoForm = () => {
  const [name, setName] = useState("");
  const [longName, setLongName] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const fetchFields = async () => {
      try {
        setName((await getName()) || "");
        setLongName((await getLongName()) || "");
        setDescription((await getDescription()) || "");
        setLogoPreview((await getLogo()) || null);
      } catch (error) {
        setMessage({
          type: "error",
          text: "Failed to load organization information.",
        });
      }
    };
    fetchFields();
  }, []);

  const handleLogoChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      if (name) await updateName(name);
      if (longName) await updateLongName(longName);
      if (description) await updateDescription(description);
      if (logo) {
        const logoUrl = await uploadFile(logo, "org_logos");
        await updateLogo(logoUrl);
        setLogoPreview(logoUrl);
      }
      setMessage({
        type: "success",
        text: "Information updated successfully!",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to update information. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      className="setting-form-parent"
      sx={{
        width: "100%",
        maxWidth: { xs: "100%", sm: 600, md: 800 },
        mx: "auto",
        minHeight: "100vh",
      }}
    >
      <Typography
        className="settings-section-title"
        variant={isMobile ? "h6" : "h5"}
        fontWeight={700}
        mb={{ xs: 2, sm: 3 }}
        color="primary.main"
        textAlign="center"
      >
        المعلومات الأساسية للجمعية
      </Typography>
      <form onSubmit={handleSubmit} className="settings-form">
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {/* Name Fields - Stack vertically on mobile */}
          <Grid className="settings-form-row" item xs={12} sm={6}>
            <Typography
              className="settings-label"
              variant="body2"
              fontWeight={500}
              sx={{ fontSize: { xs: 14, sm: 16 }, mb: 0.5 }}
            >
              اسم الجمعية
            </Typography>
            <TextField
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              size={isMobile ? "small" : "medium"}
              variant="outlined"
              className="settings-input"
              sx={{
                "& .MuiOutlinedInput-root": {
                  fontSize: { xs: 14, sm: 16 },
                },
              }}
            />
          </Grid>

          <Grid className="settings-form-row" item xs={12} sm={6}>
            <Typography
              className="settings-label"
              variant="body2"
              fontWeight={500}
              color="text.secondary"
              sx={{ fontSize: { xs: 14, sm: 16 }, mb: 0.5 }}
            >
              الاسم الكامل للجمعية
            </Typography>
            <TextField
              value={longName}
              onChange={(e) => setLongName(e.target.value)}
              fullWidth
              size={isMobile ? "small" : "medium"}
              variant="outlined"
              className="settings-input"
              sx={{
                "& .MuiOutlinedInput-root": {
                  fontSize: { xs: 14, sm: 16 },
                },
              }}
            />
          </Grid>

          {/* Description Field */}
          <Grid className="settings-form-row" item xs={12}>
            <Typography
              className="settings-label"
              variant="body2"
              fontWeight={500}
              color="text.secondary"
              sx={{ fontSize: { xs: 14, sm: 16 }, mb: 0.5 }}
            >
              الوصف
            </Typography>
            <TextField
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              minRows={isMobile ? 2 : 3}
              maxRows={isMobile ? 4 : 6}
              size={isMobile ? "small" : "medium"}
              variant="outlined"
              className="settings-textarea"
              sx={{
                "& .MuiOutlinedInput-root": {
                  fontSize: { xs: 14, sm: 16 },
                },
              }}
            />
          </Grid>
          {logoPreview && (
            <Avatar
              src={logoPreview}
              alt="Logo Preview"
              sx={{
                width: { xs: 100, sm: 96, md: 120 },
                height: { xs: 100, sm: 96, md: 120 },
                border: `2px solid ${theme.palette.divider}`,
                borderRadius: 2,
                mb: 1,
                mx: isMobile ? "auto" : 0,
                display: "block",
              }}
              variant="rounded"
            />
          )}
          {/* Logo Section */}
          <Grid className="settings-form-row" item xs={12}>
            <Button
              component="label"
              variant="outlined"
              sx={{
                p: { xs: 1, sm: 1.5 },
                borderStyle: "dashed",
                borderWidth: 2,
                borderColor: theme.palette.divider,
                color: "text.secondary",
                backgroundColor: "transparent",
                fontSize: { xs: 12, sm: 14 },
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                  borderColor: theme.palette.primary.main,
                },
              }}
            >
              {logoPreview ? "تغيير الشعار" : "اختر ملف الشعار"}
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                style={{ display: "none" }}
              />
            </Button>
          </Grid>

          {/* Submit Button */}
          <Grid className="input-parent" item xs={12}>
            <button
              className="settings-button"
              type="submit"
              disabled={loading}
            >
              {loading ? "جاري الحفظ..." : "حفظ"}
            </button>
          </Grid>

          {/* Success/Error Message */}
          {message && (
            <Grid className="input-parent" item xs={12}>
              <Box
                sx={{
                  bgcolor:
                    message.type === "success"
                      ? "success.light"
                      : "error.light",
                  color:
                    message.type === "success" ? "success.dark" : "error.dark",
                  border: `1px solid ${
                    message.type === "success"
                      ? theme.palette.success.main
                      : theme.palette.error.main
                  }`,
                  borderRadius: 2,
                  p: { xs: 2, sm: 3 },
                  textAlign: "center",
                  fontWeight: 600,
                  fontSize: { xs: 14, sm: 16 },
                }}
              >
                {message.type === "success"
                  ? "تم تحديث المعلومات بنجاح!"
                  : "فشل في تحديث المعلومات. الرجاء المحاولة مرة أخرى."}
              </Box>
            </Grid>
          )}
        </Grid>
      </form>
    </Box>
  );
};

export default OrganizationBasicInfoForm;
