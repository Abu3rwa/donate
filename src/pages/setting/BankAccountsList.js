import React, { useState, useEffect } from "react";
import { getBanks, updateBanks } from "../../services/orgInfoService";
import {
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const emptyBank = {
  bankName: "",
  accountNumber: "",
  accountHolder: "",
  cardNumber: "",
};

const BankAccountsList = () => {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchBanks = async () => {
      setLoading(true);
      try {
        const data = await getBanks();
        setBanks(Array.isArray(data) ? data : []);
      } catch (e) {
        setError("فشل تحميل الحسابات البنكية.");
      } finally {
        setLoading(false);
      }
    };
    fetchBanks();
  }, []);

  const handleChange = (idx, field, value) => {
    setBanks((prev) =>
      prev.map((b, i) => (i === idx ? { ...b, [field]: value } : b))
    );
  };

  const handleAdd = () => {
    setBanks((prev) => [...prev, { ...emptyBank }]);
  };

  const handleRemove = (idx) => {
    setBanks((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      await updateBanks(banks);
      setSuccess(true);
    } catch (e) {
      setError("فشل حفظ الحسابات البنكية. تأكد من الصلاحيات أو حاول لاحقاً.");
    } finally {
      setSaving(false);
      setTimeout(() => setSuccess(false), 2000);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-8">
        <CircularProgress />
      </div>
    );

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: "none",
        maxWidth: 700,
        mx: "auto",
        width: "100%",
      }}
    >
      <Typography variant="h5" fontWeight={700} mb={3} color="primary.main">
        الحسابات البنكية
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          تم الحفظ بنجاح
        </Alert>
      )}
      {banks.length === 0 && (
        <Typography color="text.secondary" mb={2}>
          لا توجد حسابات بنكية مضافة.
        </Typography>
      )}
      {banks.map((bank, i) => (
        <Box
          key={i}
          sx={{
            display: "flex",
            flexWrap: "wrap",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            alignItems: { xs: "stretch", sm: "center" },
            mb: 2,
            p: 2,
            borderRadius: 2,
            bgcolor: "grey.50",
          }}
        >
          <Box
            sx={{
              flexBasis: { xs: "100%", sm: "48%" },
              flexGrow: 1,
              minWidth: { xs: "100%", sm: 220 },
            }}
          >
            <TextField
              label="اسم البنك"
              value={bank.bankName}
              onChange={(e) => handleChange(i, "bankName", e.target.value)}
              size="small"
              fullWidth
              sx={{ mb: { xs: 1, sm: 0 } }}
            />
          </Box>
          <Box
            sx={{
              flexBasis: { xs: "100%", sm: "48%" },
              flexGrow: 1,
              minWidth: { xs: "100%", sm: 220 },
            }}
          >
            <TextField
              label="رقم الحساب"
              value={bank.accountNumber}
              onChange={(e) => handleChange(i, "accountNumber", e.target.value)}
              size="small"
              fullWidth
              sx={{ mb: { xs: 1, sm: 0 } }}
            />
          </Box>
          <Box
            sx={{
              flexBasis: { xs: "100%", sm: "48%" },
              flexGrow: 1,
              minWidth: { xs: "100%", sm: 220 },
            }}
          >
            <TextField
              label="اسم صاحب الحساب"
              value={bank.accountHolder}
              onChange={(e) => handleChange(i, "accountHolder", e.target.value)}
              size="small"
              fullWidth
              sx={{ mb: { xs: 1, sm: 0 } }}
            />
          </Box>
          <Box
            sx={{
              flexBasis: { xs: "100%", sm: "48%" },
              flexGrow: 1,
              minWidth: { xs: "100%", sm: 220 },
            }}
          >
            <TextField
              label="رقم البطاقة (اختياري)"
              value={bank.cardNumber}
              onChange={(e) => handleChange(i, "cardNumber", e.target.value)}
              size="small"
              fullWidth
              sx={{ mb: { xs: 1, sm: 0 } }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: { xs: "flex-end", sm: "center" },
              minWidth: 40,
              flexBasis: { xs: "100%", sm: "auto" },
            }}
          >
            <IconButton
              color="error"
              onClick={() => handleRemove(i)}
              disabled={saving}
              sx={{ mt: { xs: 1, sm: 0 } }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      ))}
      <Box display="flex" gap={2} mb={2}>
        <button
          className="settings-button"
          type="button"
          onClick={handleAdd}
          disabled={saving}
        >
          <AddIcon style={{ marginInlineEnd: 4, verticalAlign: "middle" }} />
          إضافة حساب
        </button>
      </Box>
      <button
        className="settings-button"
        type="button"
        onClick={handleSave}
        disabled={saving}
        style={{ width: "100%", fontWeight: 700, padding: "1.5rem 0" }}
      >
        {saving ? <CircularProgress size={22} /> : "حفظ الحسابات"}
      </button>
    </Box>
  );
};

export default BankAccountsList;
