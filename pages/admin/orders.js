import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import {
  Typography,
  Box,
  Stack,
  Divider,
  Button,
  CircularProgress,
  Paper,
} from "@mui/material";
import supabase from "@/lib/createClient";

export default function OrdersAdminPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  console.log(orders, "dodr");

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.log("Error fetching orders:", error.message);
    else setOrders(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);

    if (error) console.log("Error updating status:", error.message);
    else fetchOrders();
  };

  const deleteOrder = async (id) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) console.log("Error deleting order:", error.message);
    else fetchOrders();
  };
  // fetch sizes and colors
  useEffect(() => {
    const fetchData = async () => {
      const { data: sizeData } = await supabase.from("sizes").select("id,name");

      const { data: colorData } = await supabase
        .from("colors")
        .select("id,name,hex_code");

      if (sizeData) setSizes(sizeData);
      if (colorData) setColors(colorData);
    };

    fetchData();
  }, []);

  const calculateFinalPrice = (item) => {
    if (!item.discount_type || !item.discount_value) return item.base_price;
    if (item.discount_type === "percentage")
      return item.base_price - (item.base_price * item.discount_value) / 100;
    if (item.discount_type === "fixed")
      return item.base_price - item.discount_value;
    return item.base_price;
  };
  if (loading)
    return (
      <AdminLayout>
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      </AdminLayout>
    );

  if (orders.length === 0)
    return (
      <AdminLayout>
        <Typography variant="h5" mt={5} textAlign="center">
          No orders found.
        </Typography>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Orders
      </Typography>

      <Stack spacing={3}>
        {orders.map((order) => (
          <Paper
            key={order.id}
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: "#fdfdfd",
              position: "relative",
            }}
          >
            {/* Header */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              spacing={1}
            >
              <Typography fontWeight="bold">Order ID: {order.id}</Typography>
              <Typography>Status: {order.status.toUpperCase()}</Typography>
              <Typography fontWeight="bold">Total: Tk {order.total}</Typography>
            </Stack>

            <Divider sx={{ my: 2 }} />

            {/* User Info */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              spacing={2}
            >
              <Box>
                <Typography>User: {order.user_name}</Typography>
                <Typography>
                  Address: {order.address}, {order.city}, {order.postal_code}
                </Typography>
                <Typography>Phone: {order.phone_number}</Typography>
                <Typography>
                  Date: {new Date(order.created_at).toLocaleString()}
                </Typography>
              </Box>
              <Box>
                <Typography>Payment Method: {order.payment_method}</Typography>
                {order.payment_method === "bkash" && (
                  <Typography>
                    Bkash Transaction ID: {order.bkash_transaction_id}
                  </Typography>
                )}
              </Box>
            </Stack>

            <Divider sx={{ my: 2 }} />

            {/* Items */}
            <Typography variant="subtitle1" fontWeight="bold" mb={1}>
              Items:
            </Typography>
            <Stack
              spacing={1}
              sx={{ maxHeight: 200, overflowY: "auto", pr: 1 }}
            >
              {order.items.map((item) => {
                const colorData = colors.find((c) => c.id === item.color);
                return (
                <Stack
                  key={item.id}
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{
                    border: "1px solid #eee",
                    p: 1,
                    borderRadius: 1,
                  }}
                >
                  <img
                    src={item.variant?.image_url || item.image}
                    alt={item.name}
                    style={{
                      width: 60,
                      height: 60,
                      objectFit: "cover",
                      borderRadius: 4,
                    }}
                  />
                  <Box flexGrow={1}>
                    <Typography fontWeight="bold">{item.name}</Typography>
                    <Typography>
                      Size:{" "}
                      {sizes.find((s) => s.id === item.size)?.name || item.size}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography>Color:</Typography>

                      {colorData ? (
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            backgroundColor: colorData.hex_code,
                            border: "1px solid #ccc",
                          }}
                        />
                      ) : (
                        <Typography>N/A</Typography>
                      )}
                    </Stack>

                    <Typography>
                      Price: Tk {calculateFinalPrice(item)} x {item.quantity}
                    </Typography>
                  </Box>
                  <Typography fontWeight="bold">
                    Tk {calculateFinalPrice(item) * item.quantity}
                  </Typography>
                </Stack>
              )})}
            </Stack>

            <Divider sx={{ my: 2 }} />

            {/* Actions */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              flexWrap="wrap"
            >
              {order.status === "pending" && (
                <>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => updateStatus(order.id, "confirmed")}
                  >
                    Confirm
                  </Button>
                  <Button
                    variant="contained"
                    color="warning"
                    onClick={() => updateStatus(order.id, "cancelled")}
                  >
                    Cancel
                  </Button>
                </>
              )}
              <Button
                variant="outlined"
                color="error"
                onClick={() => deleteOrder(order.id)}
              >
                Delete
              </Button>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </AdminLayout>
  );
}
