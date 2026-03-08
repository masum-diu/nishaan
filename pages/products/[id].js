import React, { useState, useEffect, useMemo } from "react";
import MetaTags from "../../components/MetaTags";
import { useRouter } from "next/router";
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Stack,
  Chip,
  Divider,
  IconButton,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/thumbs";

import { useCart } from "../../lib/CartContext";
import supabase from "@/lib/createClient";

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const [error, setError] = useState("");
  const [product, setProduct] = useState(null);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH DATA =================
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);

      // fetch product with variants
      const { data: productData, error: productError } = await supabase
        .from("products")
        .select(
          "*, product_variants(id,stock,image_url,size_ids,color_id)"
        )
        .eq("id", id)
        .single();

      if (productError) {
        console.log(productError.message);
      } else {
        setProduct(productData);
      }

      // fetch sizes
      const { data: sizeData } = await supabase
        .from("sizes")
        .select("id,name");

      // fetch colors
      const { data: colorData } = await supabase
        .from("colors")
        .select("id,name,hex_code");

      setSizes(sizeData || []);
      setColors(colorData || []);
      setLoading(false);
    };

    fetchData();
  }, [id]);

  // ================= VARIANT SIZES =================
  const variantSizes = useMemo(() => {
    if (!product?.product_variants) return [];
    const allSizeIds = product.product_variants.flatMap(
      (v) => v.size_ids || []
    );
    const uniqueSizeIds = [...new Set(allSizeIds)];
    return uniqueSizeIds.map((sid) => ({
      id: sid,
      name: sizes.find((s) => s.id === sid)?.name || sid,
    }));
  }, [product, sizes]);

  useEffect(() => {
    if (variantSizes.length > 0) {
      setSelectedSize(variantSizes[0].id);
    }
  }, [variantSizes]);

  // ================= VARIANT COLORS =================
  const variantColors = useMemo(() => {
    if (!product?.product_variants) return [];
    const filteredVariants = product.product_variants.filter(
      (v) => selectedSize ? v.size_ids?.includes(selectedSize) : true
    );
    const uniqueColorIds = [
      ...new Set(filteredVariants.map((v) => v.color_id).filter(Boolean))
    ];
    return uniqueColorIds.map((cid) => ({
      id: cid,
      name: colors.find((c) => c.id === cid)?.name || "Unknown",
      hex: colors.find((c) => c.id === cid)?.hex_code || "#000000",
    }));
  }, [product, selectedSize, colors]);

  useEffect(() => {
    if (variantColors.length > 0 && !selectedColor) {
      setSelectedColor(variantColors[0].id);
    }
  }, [variantColors]);

  // ================= SELECT VARIANT =================
  useEffect(() => {
    if (product?.product_variants && selectedSize && selectedColor) {
      const variant = product.product_variants.find(
        (v) =>
          v.size_ids?.includes(selectedSize) &&
          v.color_id === selectedColor
      );
      setSelectedVariant(variant || null);
    }
  }, [selectedSize, selectedColor, product]);

  // ================= PRODUCT IMAGES =================
  const productImages = useMemo(() => {
    if (!product?.product_variants) return [product?.image || "/placeholder.jpg"];
    const allImages = [...new Set(product.product_variants.map(v => v.image_url).filter(Boolean))];
    if (selectedVariant?.image_url) {
      return [
        selectedVariant.image_url,
        ...allImages.filter(img => img !== selectedVariant.image_url)
      ];
    }
    return allImages;
  }, [product, selectedVariant]);

  // ================= STOCK =================
  const totalStock = selectedVariant ? selectedVariant.stock : product?.product_variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0;

  // ================= ACTIONS =================
  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      setError("Please select a size and color.");
      return;
    }
    addToCart({
      ...product,
      quantity,
      size: selectedSize,
      color: selectedColor,
      variant: selectedVariant,
    });
    setError("");
  };

  const handleBuyNow = () => {
    if (!selectedSize || !selectedColor) {
      setError("Please select a size and color.");
      return;
    }
    addToCart({
      ...product,
      quantity,
      size: selectedSize,
      color: selectedColor,
      variant: selectedVariant,
    });
    router.push("/checkout");
  };

  const calculateFinalPrice = (product) => {
    if (!product.discount_type || !product.discount_value) return product.base_price;
    if (product.discount_type === "percentage") return product.base_price - (product.base_price * product.discount_value / 100);
    if (product.discount_type === "fixed") return product.base_price - product.discount_value;
    return product.base_price;
  };

  if (loading || !product) {
    return (
      <>
        <MetaTags 
          title="Loading Product - Your Store" 
          description="Loading product details..."
          url={`https://yoursite.com/products/${id}`}
        />
        <Container sx={{ py: 10, textAlign: "center" }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Loading product...</Typography>
        </Container>
      </>
    );
  }

  return (
    <>
      <MetaTags 
        title={product?.name || "Product Details - Your Store"} 
        description={product?.description || "View detailed product information."}
        image={product?.image || "/assets/product-default.jpg"}
        url={`https://yoursite.com/products/${id}`}
      />
      <Box sx={{ py: 5 }}>
      <Container maxWidth="lg">
        <Grid container spacing={5}>
          {/* IMAGE */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box>
              <Swiper
                modules={[Thumbs]}
                thumbs={{ swiper: thumbsSwiper }}
                spaceBetween={10}
                style={{ borderRadius: 16 }}
              >
                {productImages.map((img, idx) => (
                  <SwiperSlide key={idx}>
                    <Box
                      component="img"
                      src={img}
                      alt="Product Image"
                      sx={{ width: "100%", borderRadius: 4, border: "1px solid #eee" }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
              <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={4}
                watchSlidesProgress
                style={{ marginTop: 16 }}
              >
                {productImages.map((img, idx) => (
                  <SwiperSlide key={idx}>
                    <Box
                      component="img"
                      src={img}
                      alt="Thumb"
                      sx={{ width: "100%", height: 80, objectFit: "cover", borderRadius: 2, border: "1px solid #ddd", cursor: "pointer" }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </Box>
          </Grid>

          {/* DETAILS */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={2}>
              <Typography variant="h4" fontWeight="bold">{product.name}</Typography>

              {selectedVariant?.stock > 0 ? (
                <Chip label="In Stock" color="success" />
              ) : (
                <Chip label="Out of Stock" color="error" />
              )}

              <Stack direction="row" spacing={2}>
                <Typography variant="h5" color="error" fontWeight="bold">
                  Tk {calculateFinalPrice(product)}
                </Typography>
                {product.base_price && (
                  <Typography variant="h6" color="text.secondary" sx={{ textDecoration: "line-through" }}>
                    Tk {product.base_price}
                  </Typography>
                )}
              </Stack>

              <Typography color="text.secondary">{product.description}</Typography>
              <Divider />

              <Typography fontWeight="bold">Select Size:</Typography>
              <Stack direction="row" spacing={1}>
                {variantSizes.map(sz => (
                  <Button
                    key={sz.id}
                    variant={selectedSize === sz.id ? "contained" : "outlined"}
                    onClick={() => setSelectedSize(sz.id)}
                  >
                    {sz.name}
                  </Button>
                ))}
              </Stack>

              <Typography fontWeight="bold">Select Color:</Typography>
              <Stack direction="row" spacing={1}>
                {variantColors.map(c => (
                  <Button
                    key={c.id}
                    variant={selectedColor === c.id ? "contained" : "outlined"}
                    sx={{ backgroundColor: c.hex, color: "#fff", minWidth: 40 }}
                    onClick={() => setSelectedColor(c.id)}
                  >
                    {selectedColor === c.id ? "✓" : ""}
                  </Button>
                ))}
              </Stack>

              {error && <Typography color="error">{error}</Typography>}

              <Typography fontWeight="bold">Quantity:</Typography>
              <Stack direction="row" alignItems="center">
                <IconButton onClick={() => setQuantity(Math.max(1, quantity - 1))}><RemoveIcon /></IconButton>
                <Typography sx={{ px: 2 }}>{quantity}</Typography>
                <IconButton onClick={() => setQuantity(quantity + 1)}><AddIcon /></IconButton>
              </Stack>

              <Divider />

              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  fullWidth
                  disabled={selectedVariant?.stock === 0}
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  disabled={selectedVariant?.stock === 0}
                  onClick={handleBuyNow}
                >
                  Buy Now
                </Button>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
    </>
  );
}