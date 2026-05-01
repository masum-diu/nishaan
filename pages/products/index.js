import React, { useState, useEffect, useMemo } from "react";
import MetaTags from '../../components/MetaTags';
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
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [categoryId, setCategoryId] = useState("all");
  const [subcategoryId, setSubcategoryId] = useState("all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState([]);

  useEffect(() => {
    if (router.query.category) setCategoryId(router.query.category);
  }, [router.query.category]);

  // ================= FETCH CATEGORIES & SUBCATEGORIES =================
  useEffect(() => {
    const fetchCategoriesAndSubcategories = async () => {
      // Fetch categories
      const { data: categoriesData, error: catError } = await supabase
        .from("categories")
        .select("*")
        .order("created_at", { ascending: false });

      if (catError) {
        console.log("Error fetching categories:", catError.message);
      } else {
        setCategories(categoriesData);
      }

      // Fetch subcategories
      const { data: subcatData, error: subcatError } = await supabase
        .from("subcategories")
        .select("*")
        .order("created_at", { ascending: false });

      if (subcatError) {
        console.log("Error fetching subcategories:", subcatError.message);
      } else {
        setSubcategories(subcatData);
      }
    };

    fetchCategoriesAndSubcategories();
  }, []);

  // ================= FETCH PRODUCTS =================
  useEffect(() => {
    const fetchProducts = async () => {
      let query = supabase.from("products")
      // include variant stock and image for display/filtering
      .select("*, product_variants(entries)")
      .order("created_at", {
        ascending: false,
      });

      if (subcategoryId !== "all") {
        // If a specific subcategory is selected, filter by it
        query = query.eq("subcategory_id", subcategoryId);
      } else if (categoryId !== "all") {
        // If only category is selected, get subcategory IDs for this category and filter
        const relevantSubcats = subcategories.filter(
          (subcat) => subcat.category_id === categoryId
        );
        const subcatIds = relevantSubcats.map((s) => s.id);
        
        if (subcatIds.length > 0) {
          query = query.in("subcategory_id", subcatIds);
        } else {
          // If category has no subcategories, return empty
          setProducts([]);
          setLoading(false);
          return;
        }
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
  }, [categoryId, subcategoryId, subcategories]);

  // ================= RESET SUBCATEGORY WHEN CATEGORY CHANGES =================
  useEffect(() => {
    setSubcategoryId("all");
  }, [categoryId]);

  // ================= FILTER SUBCATEGORIES BY SELECTED CATEGORY =================
  const filteredSubcategories = useMemo(() => {
    if (categoryId === "all") {
      return [];
    }
    return subcategories.filter((subcat) => subcat.category_id === categoryId);
  }, [subcategories, categoryId]);

  // ================= HANDLERS =================
  const handleInStockChange = () => setInStockOnly(!inStockOnly);

  const handleSizeChange = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const getProductImage = (product) => {
    const variants = product.product_variants || [];
    for (const v of variants) {
      const img = v.entries?.[0]?.image_urls?.[0];
      if (img) return img;
    }
    return "/placeholder.jpg";
  };

  const getProductStock = (product) => {
    if (Array.isArray(product.product_variants)) {
      return product.product_variants.reduce(
        (sum, v) => sum + (v.entries?.reduce((s, e) => s + (e.stock || 0), 0) || 0), 0
      );
    }
    return 0;
  };

  // ================= FILTER LOGIC =================
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const stockCount = getProductStock(product);
      const matchStock = !inStockOnly || stockCount > 0;

      const matchSize =
        !product.sizes ||
        selectedSizes.length === 0 ||
        product.sizes.some((size) => selectedSizes.includes(Number(size)));

      return matchStock && matchSize;
    });
  }, [products, inStockOnly, selectedSizes]);


  const calculateFinalPrice = (product) => {
  if (!product.discount_type || !product.discount_value) return product.base_price;

  if (product.discount_type === "percentage") {
    return product.base_price - (product.base_price * product.discount_value / 100);
  }

  if (product.discount_type === "fixed") {
    return product.base_price - product.discount_value;
  }

  return product.base_price;
};
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
    <>
      <MetaTags 
        title="Nishaans - Shop All Products" 
        description="Browse our complete collection of products. Find what you're looking for with our easy filters."
        url="https://yoursite.com/products"
      />
      <Box sx={{ py: 5 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight="bold" mb={4}>
            Shop
          </Typography>

        <Grid container spacing={4}>
          {/* ================= FILTER SIDEBAR ================= */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Box sx={{   borderRadius: 3}}>
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

              {/* Subcategories (Show only when category is selected) */}
              {categoryId !== "all" && (
                <>
                  <Typography fontWeight="bold" mb={2}>
                    Subcategories
                  </Typography>
                  <RadioGroup
                    value={subcategoryId}
                    onChange={(e) => setSubcategoryId(e.target.value)}
                  >
                    <FormControlLabel value="all" control={<Radio />} label="All" />
                    {filteredSubcategories.map((subcat) => (
                      <FormControlLabel
                        key={subcat.id}
                        value={subcat.id}
                        control={<Radio />}
                        label={subcat.name}
                      />
                    ))}
                  </RadioGroup>

                  <Divider sx={{ my: 3 }} />
                </>
              )}

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
                      image={getProductImage(product)}
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
                          Tk {calculateFinalPrice(product)}
                        </Typography>
                        <Typography
                          sx={{ textDecoration: "line-through" }}
                          color="text.secondary"
                        >
                          Tk {product.base_price}
                        </Typography>
                      </Stack>
                      {(() => {
                        const count = getProductStock(product);
                        return (
                          <Typography
                            color={count > 0 ? "success.main" : "error"}
                            mt={1}
                            fontSize="0.85rem"
                          >
                            {count > 0 ? `${count} in stock` : "Out of Stock"}
                          </Typography>
                        );
                      })()}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
      </Box>
    </>
  );
}