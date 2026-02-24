import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, CircularProgress, Link, Container } from "@mui/material";
import { useRouter } from "next/router";
import supabase from "@/lib/createClient";


export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true); // toggle login/register
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // check if already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) router.push("/"); // redirect to homepage/dashboard
    };
    checkUser();
  }, [router]);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    if (isLogin) {
      // Login
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) setError(error.message);
      else router.push("/auth");
    } else {
      // Register
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName, role: "customer" } },
      });
      setLoading(false);
      if (error) setError(error.message);
      else {
        alert("Registration successful! Please check your email.");
        setIsLogin(true);
      }
    }
  };

  return (
    <Container maxWidth="sm">
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      mt={5}
    //   height="100vh"
      px={2}
    >
      <Typography variant="h3" mb={3}>
        {isLogin ? "Customer Login" : "Customer Register"}
      </Typography>

      {!isLogin && (
        <TextField
          label="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          fullWidth
          margin="normal"
        />
      )}

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

      {error && <Typography color="error" mt={1}>{error}</Typography>}

      <Button
        variant="contained"
        onClick={handleSubmit}
        sx={{ mt: 2 }}
        disabled={loading}
        fullWidth
      >
        {loading ? <CircularProgress size={20} /> : isLogin ? "Login" : "Register"}
      </Button>

      <Typography mt={2}>
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <Link
          component="button"
          variant="body2"
          onClick={() => { setIsLogin(!isLogin); setError(""); }}
        >
          {isLogin ? "Register" : "Login"}
        </Link>
      </Typography>
    </Box>
    </Container>
  );
}