import React, { useEffect, useState } from "react";
import MetaTags from "../components/MetaTags";
import { useCart } from "../lib/CartContext";
import supabase from "../lib/createClient";
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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useRouter } from "next/router";

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const [subtotal, setSubtotal] = useState(0);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const router = useRouter();

  // fetch sizes and colors
  useEffect(() => {
    const fetchData = async () => {
      const { data: sizeData } = await supabase
        .from("sizes")
        .select("id,name");

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
    if (item.discount_type === "percentage") return item.base_price - (item.base_price * item.discount_value / 100);
    if (item.discount_type === "fixed") return item.base_price - item.discount_value;
    return item.base_price;
  };
  // Calculate subtotal
  useEffect(() => {
    const newSubtotal = cartItems.reduce(
      (acc, item) =>
        acc + calculateFinalPrice(item) * item.quantity,
      0
    );
    setSubtotal(newSubtotal);
  }, [cartItems]);

  // InitiateCheckout pixel event
  const handleCheckout = () => {
    if (typeof window !== 'undefined' && window.fbq) {
      fbq('track', 'InitiateCheckout', {
        content_ids: cartItems.map(i => i.id),
        num_items: cartItems.reduce((a, i) => a + i.quantity, 0),
        value: subtotal,
        currency: 'BDT',
      });
    }
    router.push("/checkout");
  };

  if (cartItems.length === 0) {
    return (
      <>
        <MetaTags
          title="Shopping Cart"
          description="Review your shopping cart and proceed to checkout."
          url="https://yoursite.com/cart"
        />
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
      </>
    );
  }

  return (
    <>
      <MetaTags
        title="Shopping Cart"
        description="Review your shopping cart and proceed to checkout."
        url="https://yoursite.com/cart"
      />

      <Box sx={{ py: 5 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Your Shopping Cart
          </Typography>

          <Grid container spacing={4}>
            {/* Cart Items */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
                <CardContent>
                  <Stack spacing={3} divider={<Divider />}>
                    {cartItems.map((item) => {
                      const sizeName =
                        sizes.find((s) => s.id === item.size)?.name ||
                        item.size;

                      const colorData =
                        colors.find((c) => c.id === item.color) || {};

                      return (
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          key={`${item.id}-${item.size}-${item.color || ""}`}
                          spacing={2}
                          alignItems="center"
                        >
                          <CardMedia
                            component="img"
                            image={
                              item.variant?.image_urls?.[0] ||
                              "/placeholder.jpg"
                            }
                            alt={item.name}
                            sx={{
                              width: { md: 100, xs: "100%" },
                              height: { md: 100, xs: 200 },
                              borderRadius: 2,
                              objectFit: "cover",
                            }}
                          />

                          <Box flexGrow={1} >
                            <Typography fontWeight="bold">
                              {item.name}
                            </Typography>

                            {item.size && (
                              <Typography
                                color="text.secondary"
                                variant="body2"
                              >
                                Size: {sizeName}
                              </Typography>
                            )}

                            {item.color && (
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1}
                              >
                                <Typography
                                  color="text.secondary"
                                  variant="body2"
                                >
                                  Color: {colorData.name}
                                </Typography>

                                {colorData.hex_code && (
                                  <Box
                                    sx={{
                                      width: 14,
                                      height: 14,
                                      borderRadius: "50%",
                                      background:
                                        colorData.hex_code,
                                      border: "1px solid #ccc",
                                    }}
                                  />
                                )}
                              </Stack>
                            )}

                            {/* <Typography
                              color="text.secondary"
                              variant="body2"
                            >
                              Tk{" "}
                              {calculateFinalPrice(item).toFixed(2)} 
                               each
                            </Typography> */}
                          </Box>

                          {/* Quantity */}
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                          >
                            <IconButton
                              size="small"
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.size,
                                  Math.max(1, item.quantity - 1)
                                )
                              }
                            >
                              <RemoveIcon fontSize="small" />
                            </IconButton>

                            <Typography>{item.quantity}</Typography>

                            <IconButton
                              size="small"
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.size,
                                  item.quantity + 1
                                )
                              }
                            >
                              <AddIcon fontSize="small" />
                            </IconButton>
                          </Stack>

                          {/* Price */}
                          <Typography
                            fontWeight="bold"
                            sx={{
                              width: "100px",
                              textAlign: "right",
                            }}
                          >
                            Tk{" "}
                            {(calculateFinalPrice(item) * item.quantity).toFixed(2)}
                          </Typography>

                          <IconButton
                            onClick={() =>
                              removeFromCart(item.id, item.size)
                            }
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      );
                    })}
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

                    <Divider />

                    <Stack
                      direction="row"
                      justifyContent="space-between"
                    >
                      <Typography fontWeight="bold" variant="h6">
                        Total
                      </Typography>
                      <Typography fontWeight="bold" variant="h6">
                        Tk {subtotal.toFixed(2)}
                      </Typography>
                    </Stack>
                  </Stack>

                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    sx={{ mt: 3 }}
                    onClick={() => handleCheckout()}
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