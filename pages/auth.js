// pages/auth.js
import React, { useState, useEffect } from "react";
import MetaTags from '../components/MetaTags';
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Link,
  Container,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useRouter } from "next/router";
import supabase from "@/lib/createClient";

export default function AuthPage() {
  const router = useRouter();
  const [roleType, setRoleType] = useState("customer"); // "customer" or "admin"
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Auto redirect if already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (!profile?.role) return;

        if (profile.role === "admin") router.push("/admin");
        else if (profile.role === "customer") router.push("/");
      }
    };
    checkUser();
  }, [router]);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        // LOGIN
        const { data, error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (loginError) throw loginError;
        if (!data.user) throw new Error("Login failed");

        // Fetch profile
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();

        if (profileError || !profile?.role) {
          await supabase.auth.signOut();
          throw new Error("Profile not found. Please register first.");
        }

        // Role validation
        if (profile.role !== roleType) {
          await supabase.auth.signOut();
          throw new Error(`You are not authorized as ${roleType}`);
        }

        // Redirect based on role
        if (profile.role === "admin") router.push("/admin");
        else if (profile.role === "customer") router.push("/");
      } else {
        // REGISTER (Customer only)
        if (roleType !== "customer") throw new Error("Only customers can register here");

        const { data: user, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName, role: "customer" } },
        });

        if (signUpError) throw signUpError;
        if (!user) throw new Error("Signup failed");

        alert("Registration successful! Please check your email for confirmation.");
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
      <Container maxWidth="sm">
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" my={5} px={2}>
          <Typography variant="h4" mb={3}>
            {isLogin
              ? `${roleType.charAt(0).toUpperCase() + roleType.slice(1)} Login`
              : `${roleType.charAt(0).toUpperCase() + roleType.slice(1)} Register`}
          </Typography>

        {/* Role Toggle */}
        <ToggleButtonGroup
          value={roleType}
          exclusive
          onChange={(e, val) => val && setRoleType(val)}
          sx={{ mb: 2 }}
        >
          <ToggleButton value="customer">Customer</ToggleButton>
          <ToggleButton value="admin">Admin</ToggleButton>
        </ToggleButtonGroup>

        {/* Full Name only for register */}
        {!isLogin && roleType === "customer" && (
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

        {error && (
          <Typography color="error" mt={1}>
            {error}
          </Typography>
        )}

        <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }} disabled={loading} fullWidth>
          {loading ? <CircularProgress size={20} /> : isLogin ? "Login" : "Register"}
        </Button>

        <Typography mt={2}>
          {roleType === "customer" && (
            <>
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <Link
                component="button"
                variant="body2"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                }}
              >
                {isLogin ? "Register" : "Login"}
              </Link>
            </>
          )}
        </Typography>
      </Box>
    </Container>
    </>
  );
}