import React, { useEffect, useState } from "react";
import { Box, Typography, TextField, Button, CircularProgress, Container } from "@mui/material";
import AdminLayout from "@/components/AdminLayout"; // যদি admin panel, নাহলে সাধারণ Box use করুন
import supabase from "@/lib/createClient";
import { useRouter } from "next/router";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/auth");
        return;
      }
      setUser(session.user);
      setFullName(session.user?.user_metadata?.full_name || "");
      setLoading(false);
    };
    fetchUser();
  }, [router]);

  const handleUpdate = async () => {
    setUpdating(true);
    setError("");

    const { data, error } = await supabase.auth.updateUser({
      data: { full_name: fullName },
    });

    setUpdating(false);

    if (error) {
      setError(error.message);
    } else {
      alert("Profile updated successfully!");
      setUser(data.user);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={5}><CircularProgress /></Box>;

  return (
    <Container maxWidth="lg">
    <Box  mt={5} p={3} border="1px solid #ddd" borderRadius={2}>
      <Typography variant="h4" mb={3}>My Profile</Typography>

      <TextField
        label="Email"
        value={user.email}
        fullWidth
        margin="normal"
        disabled
      />

      <TextField
        label="Full Name"
        value={fullName}
        fullWidth
        margin="normal"
        onChange={(e) => setFullName(e.target.value)}
      />

      {error && <Typography color="error">{error}</Typography>}

      <Box mt={2} display="flex" gap={2}>
        <Button variant="contained" onClick={handleUpdate} disabled={updating}>
          {updating ? "Updating..." : "Update Profile"}
        </Button>
       
      </Box>
    </Box>
    </Container>
  );
}