
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
  const [categorie, setCategorie] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
console.log(products,"all products")
const bestSellingProducts = products.filter(product => product.is_best_selling);
  useEffect(() => {
    const fetchBanners = async () => {
      const { data, error } = await supabase
        .from("banners")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.log(error);
      } else {
        setBanners(data);
      }
    };
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.log("Error:", error.message);
      } else {
        setProducts(data);
      }

      setLoading(false);
    };
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.log("Error:", error.message);
      } else {
        setCategorie(data);
      }

      setLoading(false);
    };

    fetchProducts();
    fetchBanners();
    fetchCategories();
  }, []);
  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     const { data, error } = await supabase
  //       .from('banners')
  //       .select("*")
  //       .order("created_at", { ascending: false });

  //     if (error) {
  //       console.log("Error:", error.message);
  //     } else {
  //       setProducts(data);
  //     }

  //     setLoading(false);
  //   };

  //   fetchProducts();
  // }, []);




  const router = useRouter();
 if (loading) {
  return (
    <Container sx={{ py: 10, textAlign: "center" }}>
      <CircularProgress />
      <Typography variant="h6" sx={{ mt: 2 }}>
        Loading product...
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
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <Card
                onClick={() => router.push(`/products/${product.id}`)}
                sx={{
                  my: 2,
                  borderRadius: 3,
                  transition: "0.3s",
                  "&:hover": { transform: "translateY(-8px)", boxShadow: 6 }
                }}
              >
                <CardMedia
                  component="img"
                  height="180"
                  image={product.image}
                  alt={product.name}
                />
                <CardContent>
                  <Typography fontWeight="bold">
                    {product.name}
                  </Typography>
                  <Typography color="error">৳ {product.price}</Typography>
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
          {categorie.map((category) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={category.id}>
              <Card
                onClick={() => router.push("/products")}
                sx={{
                  position: "relative",
                  borderRadius: 3,
                  overflow: "hidden",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: 6,
                  },
                  "&:hover .category-image": {
                    transform: "scale(1.1)",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  className="category-image"
                  src={category.image}
                  alt={category.name}
                  sx={{
                    height: 150,
                    transition: "transform 0.4s ease-in-out",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    bgcolor: "rgba(0, 0, 0, 0.6)",
                    color: "#ffff",
                    p: 1,
                    textAlign: "center",
                  }}
                >
                  <Typography fontWeight="bold" variant="subtitle1">{category.name}</Typography>
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
                  borderRadius: 4,
                  overflow: "hidden",
                  position: "relative",
                  transition: "0.3s",
                  "&:hover img": { transform: "scale(1.1)" },
                }}
              >
                <Box sx={{ overflow: "hidden" }}>
                  <CardMedia
                    component="img"
                    height="220"
                    image={product.image}
                    alt={product.name}
                    sx={{ transition: "0.4s" }}
                  />
                </Box>

                {/* <Box
                  sx={{
                    position: "absolute",
                    top: 10,
                    left: 10,
                    bgcolor: "error.main",
                    color: "#fff",
                    px: 1,
                    borderRadius: 1,
                    fontSize: 12,
                  }}
                >
                  -{product.discount}%
                </Box> */}

                <CardContent>
                  <Typography fontWeight="bold">
                    {product.name}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Typography color="error" fontWeight="bold">
                      ৳ {product.price}
                    </Typography>
                    <Typography
                      sx={{ textDecoration: "line-through" }}
                      color="text.secondary"
                    >
                      ৳ {product.oldPrice}
                    </Typography>
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
