import React, { useState, useEffect, useMemo } from "react";
import MetaTags from '../../components/MetaTags';
import {
  Box, Container, Grid, Typography, Card, CardMedia, CardContent,
  Checkbox, FormControlLabel, Radio, RadioGroup, Divider, Chip,
  Stack, CircularProgress, Drawer, Button, IconButton,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import { useRouter } from "next/router";
import supabase from "@/lib/createClient";

export default function ShopPage() {
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [categoryId, setCategoryId] = useState("all");
  const [subcategoryId, setSubcategoryId] = useState("all");
  const [inStockOnly, setInStockOnly] = useState(false);

  useEffect(() => {
    if (router.query.category) setCategoryId(router.query.category);
  }, [router.query.category]);

  useEffect(() => {
    const fetch = async () => {
      const [{ data: catData }, { data: subcatData }] = await Promise.all([
        supabase.from("categories").select("*").order("created_at", { ascending: false }),
        supabase.from("subcategories").select("*").order("created_at", { ascending: false }),
      ]);
      setCategories(catData || []);
      setSubcategories(subcatData || []);
    };
    fetch();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      let query = supabase.from("products").select("*, product_variants(entries)").order("created_at", { ascending: false });

      if (subcategoryId !== "all") {
        query = query.eq("subcategory_id", subcategoryId);
      } else if (categoryId !== "all") {
        const subcatIds = subcategories.filter(s => s.category_id === categoryId).map(s => s.id);
        if (subcatIds.length > 0) query = query.in("subcategory_id", subcatIds);
        else { setProducts([]); setLoading(false); return; }
      }

      const { data } = await query;
      setProducts(data || []);
      setLoading(false);
    };
    fetchProducts();
  }, [categoryId, subcategoryId, subcategories]);

  useEffect(() => { setSubcategoryId("all"); }, [categoryId]);

  const filteredSubcategories = useMemo(() =>
    categoryId === "all" ? [] : subcategories.filter(s => s.category_id === categoryId),
    [subcategories, categoryId]
  );

  const getProductImage = (product) => {
    for (const v of product.product_variants || []) {
      const img = v.entries?.[0]?.image_urls?.[0];
      if (img) return img;
    }
    return "/placeholder.jpg";
  };

  const getProductStock = (product) =>
    (product.product_variants || []).reduce(
      (sum, v) => sum + (v.entries?.reduce((s, e) => s + (e.stock || 0), 0) || 0), 0
    );

  const calculateFinalPrice = (product) => {
    if (!product.discount_type || !product.discount_value) return product.base_price;
    if (product.discount_type === "percentage") return product.base_price - (product.base_price * product.discount_value / 100);
    if (product.discount_type === "fixed") return product.base_price - product.discount_value;
    return product.base_price;
  };

  const getDiscount = (product) => {
    if (!product.discount_type || !product.discount_value) return null;
    if (product.discount_type === "percentage") return `${product.discount_value}% OFF`;
    if (product.discount_type === "fixed") return `৳${product.discount_value} OFF`;
    return null;
  };

  const filteredProducts = useMemo(() =>
    products.filter(p => !inStockOnly || getProductStock(p) > 0),
    [products, inStockOnly]
  );

  const FilterContent = () => (
    <Box sx={{ p: { xs: 2, md: 0 }, minWidth: { xs: 260, md: "auto" } }}>
      <Typography fontWeight="bold" mb={1.5} fontSize="0.95rem">Categories</Typography>
      <RadioGroup value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
        <FormControlLabel value="all" control={<Radio size="small" sx={{ color: "#c7ab8b", "&.Mui-checked": { color: "#c7ab8b" } }} />} label="All" />
        {categories.map(cat => (
          <FormControlLabel key={cat.id} value={cat.id}
            control={<Radio size="small" sx={{ color: "#c7ab8b", "&.Mui-checked": { color: "#c7ab8b" } }} />}
            label={cat.name}
          />
        ))}
      </RadioGroup>

      {categoryId !== "all" && filteredSubcategories.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography fontWeight="bold" mb={1.5} fontSize="0.95rem">Subcategories</Typography>
          <RadioGroup value={subcategoryId} onChange={(e) => setSubcategoryId(e.target.value)}>
            <FormControlLabel value="all" control={<Radio size="small" sx={{ color: "#c7ab8b", "&.Mui-checked": { color: "#c7ab8b" } }} />} label="All" />
            {filteredSubcategories.map(sub => (
              <FormControlLabel key={sub.id} value={sub.id}
                control={<Radio size="small" sx={{ color: "#c7ab8b", "&.Mui-checked": { color: "#c7ab8b" } }} />}
                label={sub.name}
              />
            ))}
          </RadioGroup>
        </>
      )}

      <Divider sx={{ my: 2 }} />
      <Typography fontWeight="bold" mb={1} fontSize="0.95rem">Availability</Typography>
      <FormControlLabel
        control={<Checkbox checked={inStockOnly} onChange={() => setInStockOnly(!inStockOnly)}
          size="small" sx={{ color: "#c7ab8b", "&.Mui-checked": { color: "#c7ab8b" } }} />}
        label="In Stock Only"
      />

      {/* Apply button only on mobile */}
      <Box sx={{ display: { xs: "block", md: "none" }, mt: 2 }}>
        <Button fullWidth variant="contained"
          onClick={() => setDrawerOpen(false)}
          sx={{ bgcolor: "#c7ab8b", "&:hover": { bgcolor: "#b5956f" }, borderRadius: 2 }}>
          Apply Filters
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      <MetaTags
        title="Nishaans - Shop All Products"
        description="Browse our complete collection of products."
        url="https://nishaans.com/products"
      />
      <Box sx={{ py: 3, bgcolor: "#fafafa", minHeight: "100vh" }}>
        <Container maxWidth="lg">

          {/* Header */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
            <Box>
              <Typography variant="h5" fontWeight="bold">Shop</Typography>
              <Typography variant="body2" color="text.secondary">
                {filteredProducts.length} products
              </Typography>
            </Box>
            {/* Mobile filter button */}
            <Button
              startIcon={<FilterListIcon />}
              variant="outlined"
              onClick={() => setDrawerOpen(true)}
              sx={{
                display: { xs: "flex", md: "none" },
                borderColor: "#c7ab8b", color: "#c7ab8b", borderRadius: 2,
              }}
            >
              Filter
            </Button>
          </Stack>

          <Grid container spacing={3}>
            {/* Desktop Sidebar */}
            <Grid size={{ md: 3 }} sx={{ display: { xs: "none", md: "block" } }}>
              <Box sx={{ bgcolor: "#fff", borderRadius: 3, p: 2.5, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", position: "sticky", top: 16 }}>
                <FilterContent />
              </Box>
            </Grid>

            {/* Products */}
            <Grid size={{ xs: 12, md: 9 }}>
              {loading ? (
                <Box display="flex" justifyContent="center" py={8}>
                  <CircularProgress sx={{ color: "#c7ab8b" }} />
                </Box>
              ) : filteredProducts.length === 0 ? (
                <Box textAlign="center" py={8}>
                  <Typography color="text.secondary">No products found.</Typography>
                </Box>
              ) : (
                <Grid container spacing={2}>
                  {filteredProducts.map((product) => {
                    const discount = getDiscount(product);
                    const finalPrice = calculateFinalPrice(product);
                    const stock = getProductStock(product);
                    return (
                      <Grid size={{ xs: 6, sm: 4, md: 4 }} key={product.id}>
                        <Card
                          onClick={() => router.push(`/products/${product.id}`)}
                          sx={{
                            borderRadius: 3, cursor: "pointer", transition: "0.3s",
                            position: "relative", height: "100%",
                            "&:hover": { transform: "translateY(-6px)", boxShadow: 8 },
                          }}
                        >
                          {discount && (
                            <Chip label={discount} size="small"
                              sx={{ position: "absolute", top: 10, left: 10, zIndex: 1,
                                bgcolor: "#c7ab8b", color: "#fff", fontWeight: "bold", fontSize: "0.68rem" }}
                            />
                          )}
                          {stock === 0 && (
                            <Box sx={{
                              position: "absolute", inset: 0, bgcolor: "rgba(255,255,255,0.5)",
                              zIndex: 1, borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                              <Chip label="Out of Stock" size="small" sx={{ bgcolor: "#eee", fontWeight: "bold" }} />
                            </Box>
                          )}
                          <CardMedia component="img" image={getProductImage(product)} alt={product.name}
                            sx={{ height: { xs: 160, sm: 200 }, objectFit: "cover" }}
                          />
                          <CardContent sx={{ p: { xs: 1, sm: 1.5 } }}>
                            <Typography fontWeight="bold" noWrap fontSize={{ xs: "0.8rem", sm: "0.9rem" }}>
                              {product.name}
                            </Typography>
                            <Stack direction="row" alignItems="center" spacing={0.8} mt={0.5} flexWrap="wrap">
                              <Typography fontWeight="bold" fontSize={{ xs: "0.85rem", sm: "0.95rem" }} sx={{ color: "#c7ab8b" }}>
                                ৳ {finalPrice}
                              </Typography>
                              {product.discount_value && (
                                <Typography fontSize="0.75rem" color="text.secondary" sx={{ textDecoration: "line-through" }}>
                                  ৳ {product.base_price}
                                </Typography>
                              )}
                            </Stack>
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Mobile Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 280 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" p={2} pb={1}>
            <Typography fontWeight="bold" fontSize="1rem">Filters</Typography>
            <IconButton onClick={() => setDrawerOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Stack>
          <Divider />
          <FilterContent />
        </Box>
      </Drawer>
    </>
  );
}
