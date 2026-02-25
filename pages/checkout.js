import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Divider,
  Stack,
  Radio,
  RadioGroup,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import { useCart } from "../lib/CartContext";
import { useRouter } from "next/router";
import supabase from "@/lib/createClient";

function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    user_name: "",
    address: "",
    city: "",
    postal_code: "",
    phone_number: "",
    payment_method: "cash_on_delivery", // default
    bkash_transaction_id: "",
  });

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const shipping = formData.city.toLowerCase() === "dhaka" ? 60 : 110;
  const total = subtotal + shipping;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (formData.payment_method === "bkash" && !formData.bkash_transaction_id) {
      alert("Please provide your bKash transaction ID!");
      return;
    }

    setLoading(true);

    // Prepare order data
    const orderData = {
      user_name: formData.user_name,
      address: formData.address,
      city: formData.city,
      postal_code: formData.postal_code,
      phone_number: formData.phone_number,
      payment_method: formData.payment_method,
      bkash_transaction_id:
        formData.payment_method === "bkash"
          ? formData.bkash_transaction_id
          : null,
      items: cartItems,
      subtotal,
      shipping,
      total,
    };

    // Save order to Supabase
    const { data, error } = await supabase.from("orders").insert([orderData]);
    if (error) {
      alert("Error placing order: " + error.message);
      setLoading(false);
      return;
    }

    alert("Order placed successfully!");
    clearCart();
    setLoading(false);
    router.push("/");
  };

  return (
    <Box sx={{ py: 5, bgcolor: "#f9f9f9" }}>
      <Container maxWidth="lg">
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Checkout
        </Typography>
        <Grid container spacing={4}>
          {/* Left: Order Summary */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  Order Summary
                </Typography>
                <Stack spacing={2} divider={<Divider />}>
                  {cartItems.map((item) => (
                    <Stack
                      direction="row"
                      key={`${item.id}-${item.size}`}
                      spacing={2}
                      alignItems="center"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: 80, height: 80, borderRadius: 8 }}
                      />
                      <Box flexGrow={1}>
                        <Typography fontWeight="bold">{item.name}</Typography>
                        <Typography color="text.secondary">
                          Size: {item.size}
                        </Typography>
                        <Typography color="text.secondary">
                          Tk {item.price} x {item.quantity}
                        </Typography>
                      </Box>
                      <Typography fontWeight="bold">
                        Tk {item.price * item.quantity}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
                <Divider sx={{ my: 2 }} />
                <Stack direction="row" justifyContent="space-between">
                  <Typography>Subtotal</Typography>
                  <Typography>Tk {subtotal.toFixed(2)}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography>Shipping</Typography>
                  <Typography>Tk {shipping.toFixed(2)}</Typography>
                </Stack>
                <Divider sx={{ my: 1 }} />
                <Stack direction="row" justifyContent="space-between">
                  <Typography fontWeight="bold">Total</Typography>
                  <Typography fontWeight="bold">
                    Tk {total.toFixed(2)}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Right: Shipping & Payment */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Stack spacing={3}>
              <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    Shipping Information
                  </Typography>
                  <form onSubmit={handlePlaceOrder}>
                    <Stack spacing={2}>
                      <TextField
                        label="Full Name"
                        fullWidth
                        required
                        value={formData.user_name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            user_name: e.target.value,
                          })
                        }
                      />
                      <TextField
                        label="Address"
                        fullWidth
                        required
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                      />
                      <TextField
                        label="City"
                        fullWidth
                        required
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                      />
                      <TextField
                        label="Postal Code"
                        fullWidth
                        required
                        value={formData.postal_code}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            postal_code: e.target.value,
                          })
                        }
                      />
                      <TextField
                        label="Phone Number"
                        fullWidth
                        required
                        value={formData.phone_number}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            phone_number: e.target.value,
                          })
                        }
                      />

                      {/* Payment Method */}
                      <Typography fontWeight="bold">Payment Method</Typography>
                      <RadioGroup
                        value={formData.payment_method}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            payment_method: e.target.value,
                          })
                        }
                      >
                        <FormControlLabel
                          value="cash_on_delivery"
                          control={<Radio />}
                          label="Cash on Delivery"
                        />
                        <FormControlLabel
                          value="bkash"
                          control={<Radio />}
                          label="bKash Payment"
                        />
                      </RadioGroup>

                      {/* bKash Transaction ID */}
                      {formData.payment_method === "bkash" && (
                        <>
                          <Typography color="primary" fontWeight="bold" mt={2}>
                            Send money to: 01623325407
                          </Typography>
                          <TextField
                            label="bKash Transaction ID"
                            fullWidth
                            required
                            value={formData.bkash_transaction_id}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                bkash_transaction_id: e.target.value,
                              })
                            }
                            helperText="After sending money, enter the transaction ID here."
                          />
                        </>
                      )}

                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        fullWidth
                        disabled={loading}
                      >
                        {loading ? (
                          <CircularProgress size={24} />
                        ) : (
                          "Place Order"
                        )}
                      </Button>
                    </Stack>
                  </form>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default CheckoutPage;
