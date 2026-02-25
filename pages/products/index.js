import React, { useState, useEffect, useMemo } from "react";
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
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/router";
import supabase from "@/lib/createClient";

export default function ShopPage() {
  const router = useRouter();

  // ================= STATE =================
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [categoryId, setCategoryId] = useState("all"); // category filter
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState([]);

  // ================= FETCH CATEGORIES =================
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.log("Error fetching categories:", error.message);
      } else {
        setCategories(data);
      }
    };

    fetchCategories();
  }, []);

  // ================= FETCH PRODUCTS =================
  useEffect(() => {
    const fetchProducts = async () => {
      let query = supabase.from("products").select("*").order("created_at", {
        ascending: false,
      });

      if (categoryId !== "all") {
        query = query.eq("category_id", categoryId); // category filter
      }

      const { data, error } = await query;

      if (error) {
        console.log("Error fetching products:", error.message);
      } else {
        setProducts(data);
      }

      setLoading(false);
    };

    fetchProducts();
  }, [categoryId]);

  // ================= HANDLERS =================
  const handleInStockChange = () => setInStockOnly(!inStockOnly);

  const handleSizeChange = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  // ================= FILTER LOGIC =================
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchStock = !inStockOnly || product.stock > 0;

      const matchSize =
        !product.sizes ||
        selectedSizes.length === 0 ||
        product.sizes.some((size) => selectedSizes.includes(Number(size)));

      return matchStock && matchSize;
    });
  }, [products, inStockOnly, selectedSizes]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ py: 5 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" fontWeight="bold" mb={4}>
          Shop
        </Typography>

        <Grid container spacing={4}>
          {/* ================= FILTER SIDEBAR ================= */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Box sx={{ bgcolor: "#fff",  borderRadius: 3 }}>
              {/* Categories (Radio Buttons) */}
              <Typography fontWeight="bold" mb={2}>
                Categories
              </Typography>
              <RadioGroup
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <FormControlLabel value="all" control={<Radio />} label="All" />
                {categories.map((cat) => (
                  <FormControlLabel
                    key={cat.id}
                    value={cat.id}
                    control={<Radio />}
                    label={cat.name}
                  />
                ))}
              </RadioGroup>

              <Divider sx={{ my: 3 }} />

              {/* Availability */}
              <Typography fontWeight="bold" mb={2}>
                Availability
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox checked={inStockOnly} onChange={handleInStockChange} />
                }
                label="In Stock Only"
              />

              <Divider sx={{ my: 3 }} />

              {/* Sizes */}
              <Typography fontWeight="bold" mb={2}>
                Size
              </Typography>
              <Stack spacing={1}>
                {[39, 40, 41, 42, 43, 44, 45,46].map((size) => (
                  <FormControlLabel
                    key={size}
                    control={
                      <Checkbox
                        checked={selectedSizes.includes(size)}
                        onChange={() => handleSizeChange(size)}
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
            <Typography mb={2}>{filteredProducts.length} products</Typography>

            <Grid container spacing={3}>
              {filteredProducts.map((product) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product.id}>
                  <Card
                    onClick={() => router.push(`/products/${product.id}`)}
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 3,
                      position: "relative",
                      transition: "0.3s",
                      "&:hover": { boxShadow: 6, transform: "translateY(-5px)" },
                    }}
                  >
                    {product.old_price > product.price && (
                      <Chip
                        label="Sale"
                        color="error"
                        size="small"
                        sx={{ position: "absolute", top: 10, right: 10 }}
                      />
                    )}

                    <CardMedia
                      component="img"
                      height="220"
                      image={product.image}
                      alt={product.name}
                    />

                    <CardContent
                      sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}
                    >
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
                          Tk {product.old_price}
                        </Typography>
                      </Stack>
                      {!product.stock && (
                        <Typography color="error" mt={1}>
                          Out of Stock
                        </Typography>
                      )}
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