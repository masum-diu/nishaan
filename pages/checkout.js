import React from "react";
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
  IconButton,
  CardMedia,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useCart } from "./products/CartContext";
import { useRouter } from "next/router";

function CheckoutPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const router = useRouter();

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shippingFee = 50; // Example shipping fee
  const total = subtotal + shippingFee;

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    // In a real app, you would process the payment here.
    alert("Order placed successfully!");
    clearCart();
    router.push("/");
  };

  if (cartItems.length === 0) {
    return (
      <Container sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>Your cart is empty.</Typography>
        <Button variant="contained" onClick={() => router.push('/products')}>
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ py: 5, bgcolor: "#f9f9f9" }}>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Checkout
        </Typography>
        <Grid container spacing={4}>
          {/* Left Side: Order Summary */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  Order Summary
                </Typography>
                <Stack spacing={2} divider={<Divider />}>
                  {cartItems.map((item) => (
                    <Stack direction="row" key={`${item.id}-${item.size}`} spacing={2} alignItems="center">
                      <CardMedia
                        component="img"
                        image={item.image}
                        alt={item.name}
                        sx={{ width: 80, height: 80, borderRadius: 2 }}
                      />
                      <Box flexGrow={1}>
                        <Typography fontWeight="bold">{item.name}</Typography>
                        <Typography color="text.secondary">Size: {item.size}</Typography>
                        <Typography color="text.secondary">
                          Tk {item.price} x {item.quantity}
                        </Typography>
                      </Box>
                      <TextField
                        type="number"
                        size="small"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, item.size, parseInt(e.target.value))}
                        inputProps={{ min: 1, style: { width: '40px' } }}
                      />
                      <Typography fontWeight="bold">
                        Tk {item.price * item.quantity}
                      </Typography>
                      <IconButton onClick={() => removeFromCart(item.id, item.size)}>
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Side: Shipping & Payment */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Stack spacing={3}>
              {/* Shipping Form */}
              <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    Shipping Information
                  </Typography>
                  <form id="checkout-form" onSubmit={handlePlaceOrder}>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12 }}>
                        <TextField label="Full Name" fullWidth required />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextField label="Address" fullWidth required />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField label="City" fullWidth required />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField label="Postal Code" fullWidth required />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextField label="Phone Number" fullWidth required />
                      </Grid>
                    </Grid>
                  </form>
                </CardContent>
              </Card>

              {/* Payment Summary */}
              <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    Payment Details
                  </Typography>
                  <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography color="text.secondary">Subtotal</Typography>
                      <Typography>Tk {subtotal.toFixed(2)}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography color="text.secondary">Shipping</Typography>
                      <Typography>Tk {shippingFee.toFixed(2)}</Typography>
                    </Stack>
                    <Divider />
                    <Stack direction="row" justifyContent="space-between">
                      <Typography fontWeight="bold" variant="h6">Total</Typography>
                      <Typography fontWeight="bold" variant="h6">
                        Tk {total.toFixed(2)}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Button
                    type="submit"
                    form="checkout-form"
                    variant="contained"
                    size="large"
                    fullWidth
                    sx={{ mt: 3 }}
                  >
                    Place Order
                  </Button>
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