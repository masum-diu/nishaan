"use client";

import React from "react";
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
} from "@mui/material";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

export default function Home() {
  const heroBanners = [
    { id: 1, src: "/assets/banner3.jpg", alt: "Sale Banner 1" },
    { id: 2, src: "/assets/banner3.jpg", alt: "Sale Banner 2" },
    { id: 3, src: "/assets/banner3.jpg", alt: "Sale Banner 3" },
  ];

  const featuredProducts = [
    { id: 1, name: "Classic Wrist Watch", price: "1,500", image: "/assets/sun.webp" },
    { id: 2, name: "Modern Sneakers", price: "2,200", image: "/assets/sun.webp" },
    { id: 3, name: "Leather Handbag", price: "3,100", image: "/assets/sun.webp" },
    { id: 4, name: "Wireless Earbuds", price: "4,500", image: "/assets/sun.webp" },
    { id: 5, name: "Stylish Sunglasses", price: "800", image: "/assets/sun.webp" },
  ];

  const bestSelling = [
    { id: 1, name: "Gaming Laptop", price: "85,000", oldPrice: "95,000", discount: 10, image: "/assets/denim.jpg" },
    { id: 2, name: "Smart TV 4K", price: "48,000", oldPrice: "55,000", discount: 12, image: "/assets/denim.jpg" },
    { id: 3, name: "Running Shoes", price: "3,200", oldPrice: "4,000", discount: 20, image: "/assets/sun.webp" },
    { id: 4, name: "Denim Jacket", price: "1,800", oldPrice: "2,500", discount: 28, image: "/assets/sun.webp" },
  ];

  const categories = [
    { id: 1, name: "Electronics",img:"/assets/eclectg.jpg" },
    { id: 2, name: "Fashion",img:"/assets/eclectg.jpg" },
    { id: 3, name: "Shoes",img:"/assets/eclectg.jpg" },
    { id: 4, name: "Watch",img:"/assets/eclectg.jpg" },
    { id: 5, name: "Laptop",img:"/assets/eclectg.jpg" },
    { id: 6, name: "Cosmetics",img:"/assets/eclectg.jpg" },
  ];

  return (
    <Box  sx={{ pt: 2 }}>
      <Container maxWidth="lg">

        {/* ================= HERO SLIDER ================= */}
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 3000 }}
          pagination={{ clickable: true }}
          loop
        >
          {heroBanners.map((banner) => (
            <SwiperSlide key={banner.id}>
              <Box
                component="img"
                src={banner.src}
                alt={banner.alt}
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
                sx={{
                  my: 2,
                  borderRadius: 3,
                  transition: "0.3s",
                  "&:hover": { transform: "translateY(-8px)", boxShadow: 6}
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
            <Grid size={{ xs: 12, sm: 6, md: 4 }}key={category.id}>
              <Card
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
                  src={category.img}
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
          {bestSelling.map((product) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={product.id}>
              <Card
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

                <Box
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
                </Box>

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
