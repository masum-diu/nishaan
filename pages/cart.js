import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useCart } from "../lib/CartContext";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  IconButton,
  Stack,
  Divider,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useRouter } from "next/router";

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const [subtotal, setSubtotal] = useState(0);
  const [area, setArea] = useState("dhaka");
  const router = useRouter();

  useEffect(() => {
    const newSubtotal = cartItems.reduce(
      (acc, item) =>
        acc + item.variant.price * item.quantity,
      0
    );
    setSubtotal(newSubtotal);
  }, [cartItems]);

  const shippingFee =
    subtotal > 0
      ? area === "dhaka"
        ? 60
        : 110
      : 0;

  const total = subtotal + shippingFee;

  if (cartItems.length === 0) {
    return (
      <Container sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Your Cart is Empty
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Looks like you haven't added anything to your cart yet.
        </Typography>
        <Button
          variant="contained"
          onClick={() => router.push("/products")}
        >
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <>
      <Head>
        <title>Shopping Cart</title>
      </Head>

      <Box sx={{ py: 5 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            gutterBottom
          >
            Your Shopping Cart
          </Typography>

          <Grid container spacing={4}>
            {/* Cart Items */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
                <CardContent>
                  <Stack spacing={3} divider={<Divider />}>
                    {cartItems.map((item) => (
                      <Stack
                        direction="row"
                        key={item.variant_id}
                        spacing={2}
                        alignItems="center"
                      >
                        <CardMedia
                          component="img"
                          image={
                            item.variant?.product_images?.[0]?.image_url ||
                            "/no-image.png"
                          }
                          alt={item.name}
                          sx={{
                            width: 100,
                            height: 100,
                            borderRadius: 2,
                          }}
                        />

                        <Box flexGrow={1}>
                          <Typography fontWeight="bold">
                            {item.name}
                          </Typography>

                          {item.size && (
                            <Typography
                              color="text.secondary"
                              variant="body2"
                            >
                              Size: {item.size}
                            </Typography>
                          )}

                          <Typography
                            color="text.secondary"
                            variant="body2"
                          >
                            Price: Tk {item.variant.price}
                          </Typography>
                        </Box>

                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1}
                        >
                          <IconButton
                            size="small"
                            onClick={() =>
                              updateQuantity(
                                item.variant_id,
                                item.quantity - 1
                              )
                            }
                          >
                            <RemoveIcon fontSize="small" />
                          </IconButton>

                          <Typography>
                            {item.quantity}
                          </Typography>

                          <IconButton
                            size="small"
                            onClick={() =>
                              updateQuantity(
                                item.variant_id,
                                item.quantity + 1
                              )
                            }
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Stack>

                        <Typography
                          fontWeight="bold"
                          sx={{
                            width: "100px",
                            textAlign: "right",
                          }}
                        >
                          Tk{" "}
                          {(
                            item.variant.price *
                            item.quantity
                          ).toFixed(2)}
                        </Typography>

                        <IconButton
                          onClick={() =>
                            removeFromCart(item.variant_id)
                          }
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Order Summary */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
                <CardContent>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    mb={2}
                  >
                    Order Summary
                  </Typography>

                  {/* Area Selector */}
                  <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                    <InputLabel>Delivery Area</InputLabel>
                    <Select
                      value={area}
                      label="Delivery Area"
                      onChange={(e) =>
                        setArea(e.target.value)
                      }
                    >
                      <MenuItem value="dhaka">
                        Dhaka - 60 Tk
                      </MenuItem>
                      <MenuItem value="outside">
                        Outside Dhaka - 110 Tk
                      </MenuItem>
                    </Select>
                  </FormControl>

                  <Stack spacing={1.5}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                    >
                      <Typography color="text.secondary">
                        Subtotal
                      </Typography>
                      <Typography>
                        Tk {subtotal.toFixed(2)}
                      </Typography>
                    </Stack>

                    <Stack
                      direction="row"
                      justifyContent="space-between"
                    >
                      <Typography color="text.secondary">
                        Shipping
                      </Typography>
                      <Typography>
                        Tk {shippingFee.toFixed(2)}
                      </Typography>
                    </Stack>

                    <Divider />

                    <Stack
                      direction="row"
                      justifyContent="space-between"
                    >
                      <Typography
                        fontWeight="bold"
                        variant="h6"
                      >
                        Total
                      </Typography>
                      <Typography
                        fontWeight="bold"
                        variant="h6"
                      >
                        Tk {total.toFixed(2)}
                      </Typography>
                    </Stack>
                  </Stack>

                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    sx={{ mt: 3 }}
                    onClick={() =>
                      router.push({
                        pathname: "/checkout",
                        query: { area },
                      })
                    }
                  >
                    Proceed to Checkout
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default CartPage;