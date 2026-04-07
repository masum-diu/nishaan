import React, { useState, useEffect } from "react";
import {
  Box, TextField, Button, Typography, CircularProgress,
  Container, Paper, Divider,
} from "@mui/material";
import { useRouter } from "next/router";
import supabase from "@/lib/createClient";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        const { data: profile } = await supabase
          .from("profiles").select("role").eq("id", session.user.id).single();
        if (profile?.role === "admin") router.push("/admin/dashboard");
      }
    };
    check();
  }, [router]);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({ email, password });
      if (loginError) throw loginError;

      const { data: profile } = await supabase
        .from("profiles").select("role").eq("id", data.user.id).single();

      if (profile?.role !== "admin") {
        await supabase.auth.signOut();
        throw new Error("Access denied. Admin only.");
      }
      router.push("/admin/dashboard");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{ bgcolor: "#1a1a2e" }}
    >
      <Container maxWidth="xs">
        <Paper elevation={6} sx={{ p: 4, borderRadius: 3, bgcolor: "#16213e" }}>
          <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
            <img src="/assets/logo.png" alt="Nishaans" style={{ height: 60, marginBottom: 8 }} />
            <Typography variant="h5" fontWeight="bold" color="white">
              Admin Panel
            </Typography>
            <Typography variant="body2" sx={{ color: "#aaa" }}>
              Restricted access only
            </Typography>
          </Box>

          <Divider sx={{ mb: 2, borderColor: "#333" }} />

          <TextField
            label="Email" type="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth margin="normal" size="small"
            InputLabelProps={{ style: { color: "#aaa" } }}
            InputProps={{ style: { color: "white" } }}
            sx={{ "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "#444" } } }}
          />
          <TextField
            label="Password" type="password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth margin="normal" size="small"
            InputLabelProps={{ style: { color: "#aaa" } }}
            InputProps={{ style: { color: "white" } }}
            sx={{ "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "#444" } } }}
          />

          {error && <Typography color="error" variant="body2" mt={1}>{error}</Typography>}

          <Button
            variant="contained" fullWidth onClick={handleLogin}
            disabled={loading}
            sx={{ mt: 2, py: 1.2, bgcolor: "#c7ab8b", "&:hover": { bgcolor: "#b5956f" }, color: "#1a1a2e", fontWeight: "bold" }}
          >
            {loading ? <CircularProgress size={20} /> : "Login as Admin"}
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}
