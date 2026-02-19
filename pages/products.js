"use client";

import React, { useState, useMemo } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  Divider,
  Chip,
  Stack,
  Button,
} from "@mui/material";

export default function ShopPage() {
  // ================= DUMMY DATA =================
  const dummyProducts = [
    {
      id: 1,
      name: "Model Code 483 – Running Sneaker",
      price: 1950,
      oldPrice: 2890,
      collection: "discount",
      inStock: true,
      sizes: [40, 41, 42, 43, 44],
    },
    {
      id: 2,
      name: "Model Code 482 – Running Sneaker",
      price: 2100,
      oldPrice: 2800,
      collection: "flash",
      inStock: true,
      sizes: [39, 40, 41],
    },
    {
      id: 3,
      name: "Model Code 481 – Running Sneaker",
      price: 1750,
      oldPrice: 2500,
      collection: "deals",
      inStock: false,
      sizes: [42, 43, 44],
    },
    {
      id: 4,
      name: "Model Code 480 – Running Sneaker",
      price: 1999,
      oldPrice: 2999,
      collection: "all",
      inStock: true,
      sizes: [40, 41, 42],
    },
  ];

  // ================= FILTER STATE =================
  const [collection, setCollection] = useState("all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState([]);

  // ================= SIZE HANDLER =================
  const handleSizeChange = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size)
        ? prev.filter((s) => s !== size)
        : [...prev, size]
    );
  };

  // ================= FILTER LOGIC =================
  const filteredProducts = useMemo(() => {
    return dummyProducts.filter((product) => {
      const matchCollection =
        collection === "all" || product.collection === collection;

      const matchStock =
        !inStockOnly || product.inStock === true;

      const matchSize =
        selectedSizes.length === 0 ||
        product.sizes.some((size) =>
          selectedSizes.includes(size)
        );

      return matchCollection && matchStock && matchSize;
    });
  }, [collection, inStockOnly, selectedSizes]);

  return (
    <Box sx={{ bgcolor: "#f5f5f5", py: 5 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" fontWeight="bold" mb={4}>
          All Products
        </Typography>

        <Grid container spacing={4}>
          {/* ================= FILTER SIDEBAR ================= */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Box sx={{ bgcolor: "#fff", p: 3, borderRadius: 3 }}>
              {/* Collection */}
              <Typography fontWeight="bold" mb={2}>
                Collection
              </Typography>

              <RadioGroup
                value={collection}
                onChange={(e) => setCollection(e.target.value)}
              >
                <FormControlLabel
                  value="all"
                  control={<Radio />}
                  label="All Products"
                />
                <FormControlLabel
                  value="discount"
                  control={<Radio />}
                  label="50% Discount"
                />
                <FormControlLabel
                  value="deals"
                  control={<Radio />}
                  label="Deals Of The Day"
                />
                <FormControlLabel
                  value="flash"
                  control={<Radio />}
                  label="Flash Sale"
                />
              </RadioGroup>

              <Divider sx={{ my: 3 }} />

              {/* Availability */}
              <Typography fontWeight="bold" mb={2}>
                Availability
              </Typography>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={inStockOnly}
                    onChange={() =>
                      setInStockOnly(!inStockOnly)
                    }
                  />
                }
                label="In Stock Only"
              />

              <Divider sx={{ my: 3 }} />

              {/* Sizes */}
              <Typography fontWeight="bold" mb={2}>
                Shoe Size
              </Typography>

              <Stack spacing={1}>
                {[39, 40, 41, 42, 43, 44, 45].map((size) => (
                  <FormControlLabel
                    key={size}
                    control={
                      <Checkbox
                        checked={selectedSizes.includes(size)}
                        onChange={() =>
                          handleSizeChange(size)
                        }
                      />
                    }
                    label={size}
                  />
                ))}
              </Stack>
            </Box>
          </Grid>

          {/* ================= PRODUCTS ================= */}
          <Grid size={{ xs: 12, md: 9 }}>
            <Typography mb={2}>
              {filteredProducts.length} products
            </Typography>

            <Grid container spacing={3}>
              {filteredProducts.map((product) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product.id}>
                  <Card
                    sx={{
                      
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 3,
                      position: "relative",
                      transition: "0.3s",
                      "&:hover": {
                        boxShadow: 6,
                        transform: "translateY(-5px)",
                      },
                    }}
                  >
                    {product.oldPrice > product.price && (
                      <Chip
                        label="Sale"
                        color="error"
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 10,
                          right: 10,
                        }}
                      />
                    )}

                    <CardMedia
                      component="img"
                      height="220"
                      image="/assets/sun.webp"
                    />

                    <CardContent
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        flexGrow: 1,
                      }}
                    >
                      <Box>
                        <Typography fontWeight="bold" noWrap>
                          {product.name}
                        </Typography>

                        <Stack direction="row" spacing={1}>
                          <Typography color="error" fontWeight="bold">
                            Tk {product.price}
                          </Typography>
                          <Typography
                            sx={{ textDecoration: "line-through" }}
                            color="text.secondary"
                          >
                            Tk {product.oldPrice}
                          </Typography>
                        </Stack>

                        {!product.inStock && (
                          <Typography color="error" mt={1}>
                            Out of Stock
                          </Typography>
                        )}
                      </Box>

                      <Stack
                        direction="row"
                        spacing={1}
                        mt="auto"
                        pt={2}
                        sx={{
                          overflowX: "auto",
                          scrollbarWidth: "none", // Firefox
                          "&::-webkit-scrollbar": {
                            display: "none", // Chrome
                          },
                        }}
                      >
                        {product.sizes.map((size) => (
                          <Button
                            key={size}
                            size="small"
                            variant="outlined"
                            sx={{
                              minWidth: 40,
                              flexShrink: 0, // Important: prevent shrinking
                            }}
                          >
                            {size}
                          </Button>
                        ))}
                      </Stack>

                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
