import React, { useEffect, useState } from "react";
import MetaTags from '../components/MetaTags';
import {
  Box, Container, Typography, Grid, Card, CardMedia,
  CardContent, Button, Stack, CircularProgress, Chip,
} from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useRouter } from "next/router";
import supabase from "@/lib/createClient";

const INITIAL_SHOW = 8;

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categorie, setCategorie] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMore, setShowMore] = useState({});
  const router = useRouter();

  useEffect(() => {
    const fetchAll = async () => {
      const [{ data: bannerData }, { data: productData }, { data: catData }, { data: subcatData }] = await Promise.all([
        supabase.from("banners").select("*").eq("is_active", true).order("created_at", { ascending: false }),
        supabase.from("products").select("*, product_variants(entries)").order("created_at", { ascending: false }),
        supabase.from("categories").select("*").order("created_at", { ascending: false }),
        supabase.from("subcategories").select("id,category_id"),
      ]);
      setBanners(bannerData || []);
      setProducts(productData || []);
      setCategorie(catData || []);
      setSubcategories(subcatData || []);
      setLoading(false);
    };
    fetchAll();
  }, []);

  const getProductImage = (product) => {
    for (const v of product.product_variants || []) {
      const img = v.entries?.[0]?.image_urls?.[0];
      if (img) return img;
    }
    return "/placeholder.jpg";
  };

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

  const getProductsByCategory = (categoryId) => {
    const subcatIds = subcategories.filter(s => s.category_id === categoryId).map(s => s.id);
    return products.filter(p => subcatIds.includes(p.subcategory_id));
  };

  const ProductCard = ({ product }) => {
    const discount = getDiscount(product);
    const finalPrice = calculateFinalPrice(product);
    return (
      <Card onClick={() => router.push(`/products/${product.id}`)}
        sx={{ borderRadius: 3, cursor: "pointer", transition: "0.3s", position: "relative",
          "&:hover": { transform: "translateY(-6px)", boxShadow: 8 } }}
      >
        {discount && (
          <Chip label={discount} size="small"
            sx={{ position: "absolute", top: 10, left: 10, zIndex: 1,
              bgcolor: "#c7ab8b", color: "#fff", fontWeight: "bold", fontSize: "0.7rem" }}
          />
        )}
        <CardMedia component="img" image={getProductImage(product)} alt={product.name}
          sx={{ height: 200, objectFit: "cover" }} />
        <CardContent sx={{ p: 1.5 }}>
          <Typography fontWeight="bold" noWrap fontSize="0.9rem">{product.name}</Typography>
          <Stack direction="row" alignItems="center" spacing={1} mt={0.5}>
            <Typography fontWeight="bold" fontSize="0.95rem" sx={{ color: "#c7ab8b" }}>
              ৳ {finalPrice}
            </Typography>
            {product.discount_value && (
              <Typography fontSize="0.78rem" color="text.secondary" sx={{ textDecoration: "line-through" }}>
                ৳ {product.base_price}
              </Typography>
            )}
          </Stack>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <Container sx={{ py: 10, textAlign: "center" }}>
        <CircularProgress sx={{ color: "#c7ab8b" }} />
      </Container>
    );
  }

  return (
    <>
      <MetaTags
        title="Nishaans - Home"
        description="Welcome to Nishaans. Browse our collection of quality products."
        url="https://nishaans.com"
      />
      <Box sx={{ pt: 2, pb: 6 }}>
        <Container maxWidth="lg">

          {/* ===== HERO SLIDER ===== */}
          <Swiper modules={[Autoplay, Pagination]} autoplay={{ delay: 3000 }}
            pagination={{ clickable: true }} loop
            style={{ borderRadius: 16, overflow: "hidden" }}
          >
            {banners.map((banner) => (
              <SwiperSlide key={banner.id}>
                <Box component="img" src={banner.image_url} alt={banner.title}
                  onClick={() => router.push("/products")}
                  sx={{ width: "100%", height: { xs: 200, md: 420 }, objectFit: "cover", cursor: "pointer", display: "block" }}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* ===== CATEGORY-WISE PRODUCTS ===== */}
          {categorie.map((category) => {
            const catProducts = getProductsByCategory(category.id);
            if (catProducts.length === 0) return null;
            const visibleCount = showMore[category.id] || INITIAL_SHOW;
            const visibleProducts = catProducts.slice(0, visibleCount);
            const hasMore = catProducts.length > visibleCount;

            return (
              <Box key={category.id} mt={5}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Box sx={{ width: 4, height: 24, bgcolor: "#c7ab8b", borderRadius: 1 }} />
                    <Typography variant="h5" fontWeight="bold">{category.name}</Typography>
                  </Stack>
                  <Button size="small" onClick={() => router.push(`/products?category=${category.id}`)}
                    sx={{ color: "#c7ab8b", textTransform: "none", fontWeight: "bold" }}>
                    View All →
                  </Button>
                </Stack>

                <Grid container spacing={2}>
                  {visibleProducts.map((product) => (
                    <Grid size={{ xs: 6, sm: 4, md: 3 }} key={product.id}>
                      <ProductCard product={product} />
                    </Grid>
                  ))}
                </Grid>

                {hasMore && (
                  <Box textAlign="center" mt={3}>
                    <Button variant="outlined"
                      onClick={() => setShowMore(prev => ({ ...prev, [category.id]: visibleCount + INITIAL_SHOW }))}
                      sx={{ borderColor: "#c7ab8b", color: "#c7ab8b", borderRadius: 2, px: 4,
                        "&:hover": { bgcolor: "#f5ede3", borderColor: "#b5956f" } }}
                    >
                      View More ({catProducts.length - visibleCount} more)
                    </Button>
                  </Box>
                )}
              </Box>
            );
          })}

          {/* ===== PROMO BANNER ===== */}
          <Box sx={{
            mt: 5, p: { xs: 3, md: 5 }, borderRadius: 4,
            background: "linear-gradient(135deg, #c7ab8b 0%, #8b6f47 100%)",
            color: "#fff", display: "flex", justifyContent: "space-between",
            alignItems: "center", flexWrap: "wrap", gap: 2,
          }}>
            <Box>
              <Typography variant="h4" fontWeight="bold">Special Offer</Typography>
              <Typography sx={{ mt: 1, opacity: 0.9 }}>Exclusive deals on top products. Limited time only!</Typography>
            </Box>
            <Button onClick={() => router.push("/products")} variant="contained"
              sx={{ bgcolor: "#fff", color: "#8b6f47", fontWeight: "bold", borderRadius: 2, px: 3,
                "&:hover": { bgcolor: "#f5ede3" } }}>
              Shop Now
            </Button>
          </Box>

          {/* ===== SHOP BY CATEGORY ===== */}
          <Stack direction="row" alignItems="center" spacing={1.5} mt={5} mb={3}>
            <Box sx={{ width: 4, height: 24, bgcolor: "#c7ab8b", borderRadius: 1 }} />
            <Typography variant="h5" fontWeight="bold">Shop by Category</Typography>
          </Stack>

          {/* First category big, rest small */}
          {categorie.length > 0 && (
            <Grid container spacing={2}>
              {/* Big featured card */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Box
                  onClick={() => router.push(`/products?category=${categorie[0].id}`)}
                  sx={{
                    position: "relative", borderRadius: 4, overflow: "hidden",
                    cursor: "pointer", height: { xs: 220, md: 380 },
                    boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                    transition: "all 0.3s",
                    "&:hover": { transform: "translateY(-4px)", boxShadow: "0 16px 40px rgba(0,0,0,0.2)" },
                    "&:hover .cat-img-0": { transform: "scale(1.06)" },
                  }}
                >
                  <Box className="cat-img-0" component="img"
                    src={categorie[0].image} alt={categorie[0].name}
                    sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.5s ease" }}
                  />
                  <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(199,171,139,0.5) 0%, rgba(0,0,0,0.5) 100%)" }} />
                  <Box sx={{ position: "absolute", inset: 0, p: 3, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                    <Typography fontSize="0.75rem" color="rgba(255,255,255,0.7)" fontWeight="bold" letterSpacing={2} textTransform="uppercase" mb={0.5}>
                      Featured
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="#fff" sx={{ textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}>
                      {categorie[0].name}
                    </Typography>
                    <Button size="small" variant="outlined"
                      sx={{ mt: 2, borderColor: "#fff", color: "#fff", borderRadius: 2, width: "fit-content",
                        "&:hover": { bgcolor: "#c7ab8b", borderColor: "#c7ab8b" } }}>
                      Explore →
                    </Button>
                  </Box>
                </Box>
              </Grid>

              {/* Right side grid */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Grid container spacing={2} sx={{ height: "100%" }}>
                  {categorie.slice(1, 5).map((category, idx) => (
                    <Grid size={{ xs: 6 }} key={category.id}>
                      <Box
                        onClick={() => router.push(`/products?category=${category.id}`)}
                        sx={{
                          position: "relative", borderRadius: 3, overflow: "hidden",
                          cursor: "pointer", height: { xs: 120, md: 178 },
                          boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
                          transition: "all 0.3s",
                          "&:hover": { transform: "translateY(-4px)", boxShadow: "0 10px 28px rgba(0,0,0,0.18)" },
                          [`&:hover .cat-img-${idx + 1}`]: { transform: "scale(1.08)" },
                        }}
                      >
                        <Box className={`cat-img-${idx + 1}`} component="img"
                          src={category.image} alt={category.name}
                          sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.4s ease" }}
                        />
                        <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)" }} />
                        <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, p: 1.2,
                          display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Typography fontWeight="bold" color="#fff" fontSize="0.85rem"
                            sx={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
                            {category.name}
                          </Typography>
                          <Box sx={{ width: 22, height: 22, borderRadius: "50%", bgcolor: "#c7ab8b",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "0.75rem", color: "#fff", flexShrink: 0 }}>
                            →
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              {/* Remaining categories in a row */}
              {categorie.slice(5).map((category) => (
                <Grid size={{ xs: 6, sm: 4, md: 3 }} key={category.id}>
                  <Box
                    onClick={() => router.push(`/products?category=${category.id}`)}
                    sx={{
                      position: "relative", borderRadius: 3, overflow: "hidden",
                      cursor: "pointer", height: 150,
                      boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                      transition: "all 0.3s",
                      "&:hover": { transform: "translateY(-4px)", boxShadow: "0 10px 28px rgba(0,0,0,0.15)" },
                      "&:hover .cat-img-rest": { transform: "scale(1.08)" },
                    }}
                  >
                    <Box className="cat-img-rest" component="img"
                      src={category.image} alt={category.name}
                      sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.4s ease" }}
                    />
                    <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)" }} />
                    <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, p: 1.2,
                      display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography fontWeight="bold" color="#fff" fontSize="0.85rem">
                        {category.name}
                      </Typography>
                      <Box sx={{ width: 22, height: 22, borderRadius: "50%", bgcolor: "#c7ab8b",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "0.75rem", color: "#fff", flexShrink: 0 }}>
                        →
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}

        </Container>
      </Box>
    </>
  );
}
