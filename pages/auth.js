import React, { useState, useEffect } from "react";
import MetaTags from "../components/MetaTags";
import {
  Box, TextField, Button, Typography, CircularProgress,
  Link, Container, Paper, Divider,
} from "@mui/material";
import { useRouter } from "next/router";
import supabase from "@/lib/createClient";

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState("");
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
        if (profile?.role === "customer") router.push("/");
      }
    };
    check();
  }, [router]);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      if (isLogin) {
        const { data, error: loginError } = await supabase.auth.signInWithPassword({ email, password });
        if (loginError) throw loginError;

        const { data: profile } = await supabase
          .from("profiles").select("role").eq("id", data.user.id).single();

        if (profile?.role !== "customer") {
          await supabase.auth.signOut();
          throw new Error("No customer account found. Please register.");
        }
        router.push("/");
      } else {
        const { error: signUpError } = await supabase.auth.signUp({
          email, password,
          options: { data: { full_name: fullName, role: "customer" } },
        });
        if (signUpError) throw signUpError;
        alert("Registration successful! Please check your email.");
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MetaTags
        title="Nishaans - Login / Sign Up"
        description="Create an account or login to your existing account."
        url="https://yoursite.com/auth"
      />
      <Box
        minHeight="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{ bgcolor: "#f5f5f5" }}
      >
        <Container maxWidth="xs">
          <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
            <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
              <img src="/assets/logo.png" alt="Nishaans" style={{ height: 60, marginBottom: 8 }} />
              <Typography variant="h5" fontWeight="bold">
                {isLogin ? "Customer Login" : "Create Account"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {isLogin ? "Welcome back!" : "Join Nishaans today"}
              </Typography>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {!isLogin && (
              <TextField
                label="Full Name" value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                fullWidth margin="normal" size="small"
              />
            )}
            <TextField
              label="Email" type="email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth margin="normal" size="small"
            />
            <TextField
              label="Password" type="password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth margin="normal" size="small"
            />

            {error && <Typography color="error" variant="body2" mt={1}>{error}</Typography>}

            <Button
              variant="contained" fullWidth onClick={handleSubmit}
              disabled={loading}
              sx={{ mt: 2, py: 1.2, bgcolor: "#c7ab8b", "&:hover": { bgcolor: "#b5956f" } }}
            >
              {loading ? <CircularProgress size={20} /> : isLogin ? "Login" : "Register"}
            </Button>

            <Typography variant="body2" textAlign="center" mt={2}>
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <Link component="button" variant="body2" onClick={() => { setIsLogin(!isLogin); setError(""); }}>
                {isLogin ? "Register" : "Login"}
              </Link>
            </Typography>
          </Paper>
        </Container>
      </Box>
    </>
  );
}
