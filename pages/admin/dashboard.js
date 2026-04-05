import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import supabase from "@/lib/createClient";

const StatCard = ({ title, value, icon, gradient }) => (
  <Card
    sx={{
      borderRadius: 4,
      background: gradient,
      color: "#fff",
      boxShadow: 4,
    }}
  >
    <CardContent sx={{ display: "flex", alignItems: "center" }}>
      <Box
        sx={{
          bgcolor: "rgba(255,255,255,0.2)",
          borderRadius: "50%",
          p: 2,
          mr: 2,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography sx={{ opacity: 0.9 }}>{title}</Typography>
        <Typography variant="h5" fontWeight="bold">
          {value}
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);

    const { data, error } = await supabase.from("orders").select("*");

    if (error) {
      console.log("Dashboard fetch error:", error.message);
      setLoading(false);
      return;
    }

    const orders = data || [];

    // Total Orders
    setTotalOrders(orders.length);

    // Total Revenue (only confirmed)
    const revenue = orders
      .filter((o) => o.status === "confirmed")
      .reduce((sum, o) => sum + o.total, 0);
    setTotalRevenue(revenue);

    // Unique Customers (by phone number)
    const uniqueCustomers = [
      ...new Set(orders.map((o) => o.phone_number)),
    ];
    setTotalCustomers(uniqueCustomers.length);

    setLoading(false);
  };

  if (loading)
    return (
      <AdminLayout>
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard
            title="Total Revenue"
            value={`Tk ${totalRevenue.toLocaleString()}`}
            icon={<AttachMoneyIcon />}
            gradient="linear-gradient(135deg, #00c853, #69f0ae)"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard
            title="Total Orders"
            value={totalOrders}
            icon={<ShoppingCartIcon />}
            gradient="linear-gradient(135deg, #2979ff, #82b1ff)"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard
            title="Total Customers"
            value={totalCustomers}
            icon={<PeopleIcon />}
            gradient="linear-gradient(135deg, #d500f9, #ea80fc)"
          />
        </Grid>
      </Grid>
    </AdminLayout>
  );
}

export default AdminDashboard;