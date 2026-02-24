import React, { useEffect, useState } from "react";
import { Typography, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, Box } from "@mui/material";
import AdminLayout from "@/components/AdminLayout";
import supabase from "@/lib/createClient";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);

    // Fetch all users from auth.users with role = 'customer'
    const { data, error } = await supabase
      .from("users")  // You need a "users" view or RLS policy in Supabase
      .select("*")
      .eq("raw_user_meta_data->>role", "customer")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching customers:", error);
    } else {
      setCustomers(data || []);
    }

    setLoading(false);
  };

  return (
    <AdminLayout>
      <Typography variant="h4" mb={3}>Customers</Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Joined At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((c) => (
              <TableRow key={c.id}>
                <TableCell>{c.email}</TableCell>
                <TableCell>{c.raw_user_meta_data?.full_name || "-"}</TableCell>
                <TableCell>{new Date(c.created_at).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </AdminLayout>
  );
}