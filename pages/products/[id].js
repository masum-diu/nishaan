import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Box, Container, Grid, Typography, Button, Stack,
  Chip, Divider, IconButton, CircularProgress
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import { useCart } from "../../lib/CartContext";
import supabase from "@/lib/createClient";

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // 🔥 Fetch Product + Variants + Images
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          product_variants (
            id,
            size,
            price,
            old_price,
            stock,
            product_images (
              image_url
            )
          )
        `)
        .eq("id", id)
        .maybeSingle();

      if (!error && data) {
        setProduct(data);
        if (data.product_variants?.length) {
          setSelectedVariant(data.product_variants[0]);
        }
      }

      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    addToCart({ ...product, variant: selectedVariant, quantity });
  };

  if (loading || !product) {
    return (
      <Container sx={{ py: 10, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  const images = selectedVariant?.product_images || [];

  return (
    <Box sx={{ py: 5 }}>
      <Container maxWidth="lg">
        <Grid container spacing={5}>

          {/* 🔥 LEFT: SWIPER THUMBS GALLERY */}
          <Grid size={{ xs: 12, md: 6 }}>

            {/* Main Slider */}
            <Swiper
              modules={[Navigation, Thumbs]}
              navigation
              thumbs={{ swiper: thumbsSwiper }}
              style={{ marginBottom: "10px" }}
            >
              {images.length > 0 ? (
                images.map((img, index) => (
                  <SwiperSlide key={index}>
                    <Box
                      component="img"
                      src={img.image_url}
                      alt={product.name}
                      sx={{
                        width: "100%",
                        borderRadius: 3,
                        border: "1px solid #eee",
                      }}
                    />
                  </SwiperSlide>
                ))
              ) : (
                <SwiperSlide>
                  <Box
                    component="img"
                    src="/no-image.png"
                    alt="No Image"
                    sx={{ width: "100%" }}
                  />
                </SwiperSlide>
              )}
            </Swiper>

            {/* Thumbnail Slider */}
            <Swiper
              modules={[Thumbs]}
              onSwiper={setThumbsSwiper}
              slidesPerView={4}
              spaceBetween={10}
              watchSlidesProgress
            >
              {images.map((img, index) => (
                <SwiperSlide key={index}>
                  <Box
                    component="img"
                    src={img.image_url}
                    alt="thumb"
                    sx={{
                      width: "100%",
                      borderRadius: 2,
                      border: "1px solid #ddd",
                      cursor: "pointer",
                    }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>

          </Grid>

          {/* 🔥 RIGHT SIDE */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={2}>
              <Typography variant="h4" fontWeight="bold">
                {product.name}
              </Typography>
              {product.description && (
                <Typography
                  color="text.secondary"
                  sx={{ lineHeight: 1.8 }}
                >
                  {product.description}
                </Typography>
              )}

              {selectedVariant?.stock > 0 ? (
                <Chip label="In Stock" color="success" />
              ) : (
                <Chip label="Out of Stock" color="error" />
              )}

              <Stack direction="row" spacing={2}>
                <Typography variant="h5" color="error" fontWeight="bold">
                  Tk {selectedVariant?.price}
                </Typography>

                {selectedVariant?.old_price > selectedVariant?.price && (
                  <Typography
                    sx={{ textDecoration: "line-through" }}
                    color="text.secondary"
                  >
                    Tk {selectedVariant.old_price}
                  </Typography>
                )}
              </Stack>

              <Divider />

              {/* Variant Select */}
              <Typography fontWeight="bold">Select Size:</Typography>
              <Stack direction="row" spacing={1}>
                {product.product_variants.map((variant) => (
                  <Button
                    key={variant.id}
                    variant={
                      selectedVariant?.id === variant.id
                        ? "contained"
                        : "outlined"
                    }
                    onClick={() => setSelectedVariant(variant)}
                    disabled={variant.stock <= 0}
                  >
                    {variant.size}
                  </Button>
                ))}
              </Stack>

              {/* Quantity */}
              <Stack direction="row" alignItems="center" spacing={1}>
                <IconButton
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <RemoveIcon />
                </IconButton>
                <Typography>{quantity}</Typography>
                <IconButton onClick={() => setQuantity(quantity + 1)}>
                  <AddIcon />
                </IconButton>
              </Stack>

              <Button
                variant="contained"
                fullWidth
                disabled={!selectedVariant?.stock}
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}