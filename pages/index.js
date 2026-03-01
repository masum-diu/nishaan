
import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";


import "swiper/css";
import "swiper/css/pagination";
import { useRouter } from "next/router";
import supabase from "@/lib/createClient";

export default function Home() {
 const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= HELPER FUNCTIONS =================

  const getLowestPrice = (product) => {
    if (!product.product_variants?.length) return 0;
    return Math.min(
      ...product.product_variants.map((v) => Number(v.price))
    );
  };

  const getOldPrice = (product) => {
    if (!product.product_variants?.length) return 0;
    return Math.max(
      ...product.product_variants.map((v) => Number(v.old_price || 0))
    );
  };

  const getMainImage = (product) => {
    if (!product.product_variants?.length) return "/no-image.png";

    const variantWithImage = product.product_variants.find(
      (v) => v.product_images?.length
    );

    if (!variantWithImage) return "/no-image.png";

    return variantWithImage.product_images[0].image_url;
  };

  const featuredProducts = products.filter((p) => p.is_featured);
  const bestSellingProducts = products.filter((p) => p.is_best_selling);
const router = useRouter();
  // ================= FETCH DATA =================

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);

      const [productsRes, bannersRes, categoriesRes] =
        await Promise.all([
          supabase
            .from("products")
            .select(`
              *,
              product_variants (
                id,
                price,
                old_price,
                stock,
                product_images ( image_url )
              )
            `)
            .order("created_at", { ascending: false }),

          supabase
            .from("banners")
            .select("*")
            .eq("is_active", true)
            .order("created_at", { ascending: false }),

          supabase
            .from("categories")
            .select("*")
            .order("created_at", { ascending: false }),
        ]);

      if (!productsRes.error) setProducts(productsRes.data);
      if (!bannersRes.error) setBanners(bannersRes.data);
      if (!categoriesRes.error) setCategories(categoriesRes.data);

      setLoading(false);
    };

    fetchAll();
  }, []);

  // ================= LOADING =================

  if (loading) {
    return (
      <Container sx={{ py: 10, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading...
        </Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ pt: 2 }}>
      <Container maxWidth="lg">

        {/* ================= HERO SLIDER ================= */}
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 3000 }}
          pagination={{ clickable: true }}
          loop
        >
          {banners.map((banner) => (
            <SwiperSlide key={banner.id}>
              <Box
                component="img"
                src={banner.image}
                alt={banner.title}
                onClick={() => router.push("/products")}
                sx={{
                  width: "100%",
                  height: { xs: 220, md: 420 },
                  objectFit: "cover",
                  borderRadius: 3,
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* ================= FEATURED PRODUCTS (Horizontal Style) ================= */}
        <Typography variant="h5" fontWeight="bold" sx={{ mt: 6, mb: 3 }}>
          Featured Products
        </Typography>

        <Swiper
          slidesPerView={2}
          spaceBetween={15}
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 1 },
            900: { slidesPerView: 4 },
            1200: { slidesPerView: 4 },
          }}
        >
          {featuredProducts.map((product) => (
            <SwiperSlide key={product.id}>
              <Card
                onClick={() => router.push(`/products/${product.id}`)}
                sx={{
                  borderRadius: 3,
                  cursor: "pointer",
                  transition: "0.3s",
                  "&:hover": { transform: "translateY(-6px)", boxShadow: 6 },
                  mb: 1,
                }}
              >
                <CardMedia
                  component="img"
                  height="220"
                  image={getMainImage(product)}
                  alt={product.name}
                  sx={{ objectFit: "cover" }}
                />

                <CardContent>
                  <Typography fontWeight="bold" noWrap>
                    {product.name}
                  </Typography>

                  <Stack direction="row" spacing={1}>
                    <Typography color="error" fontWeight="bold">
                      ৳ {getLowestPrice(product)}
                    </Typography>

                    {getOldPrice(product) > 0 && (
                      <Typography
                        sx={{ textDecoration: "line-through" }}
                        color="text.secondary"
                      >
                        ৳ {getOldPrice(product)}
                      </Typography>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* ================= PROMO BANNER ================= */}
        <Box
          sx={{
            mt: 6,
            p: 4,
            borderRadius: 4,
            background:
              "linear-gradient(135deg, #ff6a00 0%, #ee0979 100%)",
            color: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Mega Sale 50% OFF
            </Typography>
            <Typography sx={{ mt: 1 }}>
              Limited time offer. Grab now!
            </Typography>
          </Box>
          <Button
            onClick={() => router.push("/products")}
            variant="contained"
            sx={{
              bgcolor: "#fff",
              color: "#ee0979",
              mt: { xs: 2, md: 0 },
              fontWeight: "bold",
            }}
          >
            Shop Now
          </Button>
        </Box>

        {/* ================= FEATURED CATEGORIES ================= */}
        <Typography variant="h5" fontWeight="bold" sx={{ mt: 6, mb: 3 }}>
          Featured Categories
        </Typography>

        <Grid container spacing={3}>
          {categories.map((category) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={category.id}>
              <Card
                onClick={() => router.push(`/products`)}
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "0.3s",
                  "&:hover": { transform: "scale(1.05)", boxShadow: 6 },
                }}
              >
                <CardMedia
                  component="img"
                  height="150"
                  image={category.image}
                  alt={category.name}
                />
                <Box
                  sx={{
                    // position: "absolute",
                    // bottom: 0,
                    width: "100%",
                    bgcolor: "rgb(7, 7, 7)",
                    color: "#fff",
                    p: 1,
                    textAlign: "center",
                  }}
                >
                  <Typography fontWeight="bold">
                    {category.name}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* ================= BEST SELLING PRODUCTS ================= */}
        <Typography variant="h5" fontWeight="bold" sx={{ mt: 6, mb: 3 }}>
          Best Selling Products
        </Typography>

        <Grid container spacing={3}>
          {bestSellingProducts.map((product) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={product.id}>
              <Card
                onClick={() => router.push(`/products/${product.id}`)}
                sx={{
                  borderRadius: 3,
                  cursor: "pointer",
                  transition: "0.3s",
                  "&:hover": { transform: "translateY(-6px)", boxShadow: 6 },
                }}
              >
                <CardMedia
                  component="img"
                  height="220"
                  image={getMainImage(product)}
                  alt={product.name}
                  sx={{ objectFit: "cover" }}
                />

                <CardContent>
                  <Typography fontWeight="bold" noWrap>
                    {product.name}
                  </Typography>

                  <Stack direction="row" spacing={1}>
                    <Typography color="error" fontWeight="bold">
                      ৳ {getLowestPrice(product)}
                    </Typography>

                    {getOldPrice(product) > 0 && (
                      <Typography
                        sx={{ textDecoration: "line-through" }}
                        color="text.secondary"
                      >
                        ৳ {getOldPrice(product)}
                      </Typography>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

      </Container>
    </Box>
  );
}
