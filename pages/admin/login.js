import React, { useState } from "react";
import { Box, Button, TextField, Typography, CircularProgress, Container } from "@mui/material";
import { useRouter } from "next/router";
import supabase from "@/lib/createClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else if (data.session) {
      router.push("/admin"); // redirect to admin dashboard
    }
  };

  return (
    <Container maxWidth="sm">
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      px={2}
    >
      <Typography variant="h3" mb={3}>Nishaan Admin Login</Typography>

      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        margin="normal"
      />

      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        margin="normal"
      />

      {error && (
        <Typography color="error" mt={1}>
          {error}
        </Typography>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleLogin}
        sx={{ mt: 2 }}
        disabled={loading}
        fullWidth
      >
        {loading ? <CircularProgress size={20} /> : "Login"}
      </Button>
    </Box>
    </Container>
  );
}