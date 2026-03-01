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

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [categoryId, setCategoryId] = useState("all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState([]);

  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);

      const [productsRes, categoriesRes] = await Promise.all([
        supabase
          .from("products")
          .select(`
            *,
            product_variants (
              id,
              size,
              price,
              old_price,
              stock,
              product_images ( image_url )
            )
          `)
          .order("created_at", { ascending: false }),

        supabase
          .from("categories")
          .select("*")
          .order("created_at", { ascending: false }),
      ]);

      if (!productsRes.error) setProducts(productsRes.data);
      if (!categoriesRes.error) setCategories(categoriesRes.data);

      setLoading(false);
    };

    fetchAll();
  }, []);

  // ================= HELPERS =================

  const getLowestPrice = (product) => {
    if (!product.product_variants?.length) return 0;
    return Math.min(
      ...product.product_variants.map((v) => Number(v.price))
    );
  };

  const getHighestOldPrice = (product) => {
    if (!product.product_variants?.length) return 0;
    return Math.max(
      ...product.product_variants.map((v) => Number(v.old_price || 0))
    );
  };

  const getMainImage = (product) => {
    const variantWithImage = product.product_variants?.find(
      (v) => v.product_images?.length
    );

    if (!variantWithImage) return "/no-image.png";

    return variantWithImage.product_images[0].image_url;
  };

  const hasStock = (product) => {
    return product.product_variants?.some((v) => v.stock > 0);
  };

  // ================= FILTER LOGIC =================

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {

      // Category filter
      const matchCategory =
        categoryId === "all" || product.category_id === categoryId;

      // Stock filter
      const matchStock =
        !inStockOnly || product.product_variants?.some((v) => v.stock > 0);

      // Size filter
      const matchSize =
        selectedSizes.length === 0 ||
        product.product_variants?.some((v) =>
          selectedSizes.includes(Number(v.size))
        );

      return matchCategory && matchStock && matchSize;
    });
  }, [products, categoryId, inStockOnly, selectedSizes]);

  // ================= LOADING =================

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

          {/* ================= SIDEBAR ================= */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Box sx={{ bgcolor: "#fff", borderRadius: 3 }}>

              {/* Categories */}
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
                  <Checkbox
                    checked={inStockOnly}
                    onChange={() => setInStockOnly(!inStockOnly)}
                  />
                }
                label="In Stock Only"
              />

              <Divider sx={{ my: 3 }} />

              {/* Size */}
              <Typography fontWeight="bold" mb={2}>
                Size
              </Typography>

              <Stack spacing={1}>
                {[39, 40, 41, 42, 43, 44, 45, 46].map((size) => (
                  <FormControlLabel
                    key={size}
                    control={
                      <Checkbox
                        checked={selectedSizes.includes(size)}
                        onChange={() =>
                          setSelectedSizes((prev) =>
                            prev.includes(size)
                              ? prev.filter((s) => s !== size)
                              : [...prev, size]
                          )
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
              {filteredProducts.map((product) => {
                const lowestPrice = getLowestPrice(product);
                const oldPrice = getHighestOldPrice(product);
                const image = getMainImage(product);
                const inStock = hasStock(product);

                return (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}key={product.id}>
                    <Card
                      onClick={() =>
                        router.push(`/products/${product.id}`)
                      }
                      sx={{
                        borderRadius: 3,
                        cursor: "pointer",
                        position: "relative",
                        transition: "0.3s",
                        "&:hover": {
                          boxShadow: 6,
                          transform: "translateY(-5px)",
                        },
                      }}
                    >
                      {oldPrice > lowestPrice && (
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
                        image={image}
                        alt={product.name}
                        sx={{ objectFit: "cover" }}
                      />

                      <CardContent>
                        <Typography fontWeight="bold" noWrap>
                          {product.name}
                        </Typography>

                        <Stack direction="row" spacing={1}>
                          <Typography color="error" fontWeight="bold">
                            Tk {lowestPrice}
                          </Typography>

                          {oldPrice > lowestPrice && (
                            <Typography
                              sx={{ textDecoration: "line-through" }}
                              color="text.secondary"
                            >
                              Tk {oldPrice}
                            </Typography>
                          )}
                        </Stack>

                        {!inStock && (
                          <Typography color="error" mt={1}>
                            Out of Stock
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
}