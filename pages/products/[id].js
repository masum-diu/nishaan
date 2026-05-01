import React, { useState, useEffect, useMemo } from "react";
import MetaTags from "../../components/MetaTags";
import { useRouter } from "next/router";
import {
  Box, Container, Grid, Typography, Button, Stack, Chip,
  Divider, CircularProgress, Card, CardMedia, CardContent, Collapse,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/thumbs";
import "swiper/css/navigation";
import { useCart } from "../../lib/CartContext";
import supabase from "@/lib/createClient";

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { addToCart } = useCart();

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [mainSwiper, setMainSwiper] = useState(null);
  const [error, setError] = useState("");
  const [descExpanded, setDescExpanded] = useState(false);
  const [product, setProduct] = useState(null);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      setLoading(true);
      const { data: productData } = await supabase
        .from("products")
        .select("*, product_variants(id,stock,entries,size_ids,color_id)")
        .eq("id", id).single();

      if (productData) {
        setProduct(productData);
        if (productData.subcategory_id) {
          const { data: related } = await supabase
            .from("products")
            .select("*, product_variants(entries)")
            .eq("subcategory_id", productData.subcategory_id)
            .neq("id", id).limit(4);
          setRelatedProducts(related || []);
        }
      }
      const [{ data: sizeData }, { data: colorData }] = await Promise.all([
        supabase.from("sizes").select("id,name"),
        supabase.from("colors").select("id,name,hex_code"),
      ]);
      setSizes(sizeData || []);
      setColors(colorData || []);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const variantSizes = useMemo(() => {
    if (!product?.product_variants) return [];
    const allSizeIds = product.product_variants.flatMap(
      (v) => v.entries?.flatMap(e => e.size_ids || []) || []
    );
    return [...new Set(allSizeIds)].map((sid) => ({
      id: sid, name: sizes.find((s) => s.id === sid)?.name || sid,
    }));
  }, [product, sizes]);

  useEffect(() => {
    if (variantSizes.length > 0) setSelectedSize(variantSizes[0].id);
  }, [variantSizes]);

  const variantColors = useMemo(() => {
    if (!product?.product_variants) return [];
    const allEntries = product.product_variants.flatMap(v => v.entries || []);
    const filtered = selectedSize
      ? allEntries.filter(e => e.size_ids?.includes(selectedSize))
      : allEntries;
    return [...new Set(filtered.map(e => e.color_id).filter(Boolean))].map((cid) => ({
      id: cid,
      name: colors.find((c) => c.id === cid)?.name || "Unknown",
      hex: colors.find((c) => c.id === cid)?.hex_code || "#000",
    }));
  }, [product, selectedSize, colors]);

  useEffect(() => {
    if (variantColors.length > 0 && !selectedColor)
      setSelectedColor(variantColors[0].id);
  }, [variantColors]);

  useEffect(() => {
    if (product?.product_variants && selectedSize && selectedColor) {
      const allEntries = product.product_variants.flatMap(v =>
        (v.entries || []).map(e => ({ ...e, _variantId: v.id }))
      );
      setSelectedVariant(allEntries.find(
        e => e.size_ids?.includes(selectedSize) && e.color_id === selectedColor
      ) || null);
      // Reset swiper to first image when color changes
      if (mainSwiper && !mainSwiper.destroyed) mainSwiper.slideTo(0);
    }
  }, [selectedSize, selectedColor, product]);

  const productImages = useMemo(() => {
    if (!product?.product_variants) return ["/placeholder.jpg"];
    // Show images for selected color directly
    if (selectedColor) {
      const colorImages = product.product_variants
        .flatMap(v => v.entries || [])
        .filter(e => e.color_id === selectedColor)
        .flatMap(e => e.image_urls || [])
        .filter(Boolean);
      if (colorImages.length) return colorImages;
    }
    // fallback: all images
    const allImages = product.product_variants
      .flatMap(v => v.entries?.flatMap(e => e.image_urls || []) || [])
      .filter(Boolean);
    return allImages.length ? allImages : ["/placeholder.jpg"];
  }, [product, selectedColor]);

  const calculateFinalPrice = (p) => {
    if (!p.discount_type || !p.discount_value) return p.base_price;
    if (p.discount_type === "percentage") return p.base_price - (p.base_price * p.discount_value / 100);
    if (p.discount_type === "fixed") return p.base_price - p.discount_value;
    return p.base_price;
  };

  const getRelatedImage = (p) => {
    for (const v of p.product_variants || []) {
      const img = v.entries?.[0]?.image_urls?.[0];
      if (img) return img;
    }
    return "/placeholder.jpg";
  };

  useEffect(() => {
    if (!product) return;
    if (typeof window !== "undefined" && window.fbq) {
      fbq("track", "ViewContent", {
        content_name: product.name, content_ids: [product.id],
        content_type: "product", value: calculateFinalPrice(product), currency: "BDT",
      });
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) { setError("Please select a size and color."); return; }
    addToCart({ ...product, quantity: 1, size: selectedSize, color: selectedColor, variant: selectedVariant });
    if (typeof window !== "undefined" && window.fbq) {
      fbq("track", "AddToCart", {
        content_name: product.name, content_ids: [product.id],
        content_type: "product", value: calculateFinalPrice(product), currency: "BDT",
      });
    }
    setError("");
  };

  const handleBuyNow = () => {
    if (!selectedSize || !selectedColor) { setError("Please select a size and color."); return; }
    addToCart({ ...product, quantity: 1, size: selectedSize, color: selectedColor, variant: selectedVariant });
    router.push("/checkout");
  };

  const discountPercent = product?.discount_type === "percentage"
    ? product.discount_value
    : product?.discount_type === "fixed" && product?.base_price
    ? Math.round((product.discount_value / product.base_price) * 100)
    : null;

  if (loading || !product) {
    return <Container sx={{ py: 10, textAlign: "center" }}><CircularProgress /></Container>;
  }

  const finalPrice = calculateFinalPrice(product);
  const inStock = selectedVariant ? selectedVariant.stock > 0 : true;

  return (
    <>
      <MetaTags
        title={product.name}
        description={product.description || "View detailed product information."}
        image={productImages[0]}
        url={`https://nishaans.com/products/${id}`}
      />

      <Box sx={{ bgcolor: "#fafafa", py: 3 }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>

            {/* ===== LEFT: IMAGES ===== */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ position: { md: "sticky" }, top: 16 }}>
                <Swiper
                  modules={[Thumbs, Navigation]}
                  thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                  onSwiper={setMainSwiper}
                  navigation spaceBetween={10}
                  style={{ borderRadius: 16, overflow: "hidden", background: "#fff", boxShadow: "0 8px 32px rgba(0,0,0,0.10)" }}
                >
                  {productImages.map((img, idx) => (
                    <SwiperSlide key={idx}>
                      <Box component="img" src={img} alt="Product"
                        sx={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", display: "block" }}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Thumbnails as vertical strip on right — shown as row below on mobile */}
                <Stack direction="row" spacing={1} mt={1.5} sx={{ overflowX: "auto", pb: 0.5 }}>
                  {productImages.map((img, idx) => (
                    <Box key={idx}
                      component="img" src={img} alt="Thumb"
                      onClick={() => mainSwiper?.slideTo(idx)}
                      sx={{
                        width: 64, height: 64, flexShrink: 0,
                        objectFit: "cover", borderRadius: 2,
                        border: "2px solid #e0e0e0", cursor: "pointer",
                        transition: "all 0.2s",
                        "&:hover": { border: "2px solid #c7ab8b", transform: "scale(1.05)" },
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            </Grid>

            {/* ===== RIGHT: DETAILS ===== */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={2}>

                {/* Badges */}
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Chip label={inStock ? "In Stock" : "Out of Stock"} size="small"
                    sx={{
                      bgcolor: inStock ? "#e8f5e9" : "#ffebee",
                      color: inStock ? "#2e7d32" : "#c62828",
                      fontWeight: "bold", fontSize: "0.72rem",
                    }}
                  />
                  {discountPercent && (
                    <Chip label={`${discountPercent}% OFF`} size="small"
                      sx={{ bgcolor: "#fff3e0", color: "#e65100", fontWeight: "bold", fontSize: "0.72rem" }}
                    />
                  )}
                </Stack>

                {/* Title */}
                <Typography variant="h6" fontWeight="bold" lineHeight={1.3}>
                  {product.name}
                </Typography>

                {/* Price */}
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Typography variant="h5" fontWeight="bold" sx={{ color: "#c7ab8b" }}>
                    Tk {finalPrice}
                  </Typography>
                  {product.discount_value && (
                    <Typography variant="body1" color="text.secondary"
                      sx={{ textDecoration: "line-through" }}>
                      Tk {product.base_price}
                    </Typography>
                  )}
                </Stack>

                <Divider />

                {/* Description - collapsible */}
                {product.description && (
                  <Box>
                    <Collapse in={descExpanded} collapsedSize={44}>
                      <Typography color="text.secondary" fontSize="0.88rem" lineHeight={1.7}>
                        {product.description}
                      </Typography>
                    </Collapse>
                    <Button size="small" onClick={() => setDescExpanded(!descExpanded)}
                      endIcon={descExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                      sx={{ color: "#c7ab8b", p: 0, mt: 0.5, textTransform: "none", fontSize: "0.8rem" }}
                    >
                      {descExpanded ? "Show less" : "Read more"}
                    </Button>
                  </Box>
                )}

                {/* Size */}
                <Box>
                  <Typography fontWeight="bold" fontSize="0.88rem" mb={0.8}>
                    Size:
                  </Typography>
                  <Stack direction="row" spacing={0.8} flexWrap="wrap">
                    {variantSizes.map(sz => (
                      <Box key={sz.id}
                        onClick={() => { setSelectedSize(sz.id); setSelectedColor(null); }}
                        sx={{
                          minWidth: 42, height: 42, borderRadius: 1.5,
                          border: selectedSize === sz.id ? "2px solid #c7ab8b" : "2px solid #e0e0e0",
                          bgcolor: selectedSize === sz.id ? "#c7ab8b" : "#fff",
                          color: selectedSize === sz.id ? "#fff" : "#333",
                          fontWeight: "bold", fontSize: "0.8rem",
                          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                          transition: "all 0.2s",
                          "&:hover": { border: "2px solid #c7ab8b", bgcolor: selectedSize === sz.id ? "#c7ab8b" : "#f5ede3" },
                        }}
                      >
                        {sz.name}
                      </Box>
                    ))}
                  </Stack>
                </Box>

                {/* Color */}
                <Box>
                  <Typography fontWeight="bold" fontSize="0.88rem" mb={1}>
                    Color: <span style={{ color: "#c7ab8b", fontWeight: "bold" }}>
                      {variantColors.find(c => c.id === selectedColor)?.name || ""}
                    </span>
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.2 }}>
                    {variantColors.map(c => (
                      <Box key={c.id} onClick={() => setSelectedColor(c.id)}
                        sx={{
                          width: 34, height: 34, borderRadius: "50%",
                          bgcolor: c.hex, cursor: "pointer", flexShrink: 0,
                          border: selectedColor === c.id ? "3px solid #fff" : "3px solid transparent",
                          outline: selectedColor === c.id ? "2.5px solid #c7ab8b" : "2px solid #ddd",
                          boxShadow: selectedColor === c.id ? "0 2px 8px rgba(0,0,0,0.25)" : "0 1px 3px rgba(0,0,0,0.1)",
                          transition: "all 0.2s",
                          "&:hover": { outline: "2.5px solid #c7ab8b", transform: "scale(1.12)", boxShadow: "0 3px 10px rgba(0,0,0,0.2)" },
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                {error && <Typography color="error" variant="body2">{error}</Typography>}

                {/* CTA Buttons */}
                <Stack direction="row" spacing={1.5}>
                  <Button variant="outlined" fullWidth
                    startIcon={<ShoppingCartIcon />}
                    disabled={!inStock} onClick={handleAddToCart}
                    sx={{
                      borderColor: "#c7ab8b", color: "#c7ab8b", borderWidth: 2,
                      borderRadius: 2.5, py: 1.2, fontWeight: "bold", fontSize: "0.85rem",
                      "&:hover": { borderColor: "#b5956f", bgcolor: "#fdf6ee", borderWidth: 2 },
                    }}
                  >
                    Add to Cart
                  </Button>
                  <Button variant="contained" fullWidth
                    startIcon={<FlashOnIcon />}
                    disabled={!inStock} onClick={handleBuyNow}
                    sx={{
                      bgcolor: "#c7ab8b", borderRadius: 2.5, py: 1.2,
                      fontWeight: "bold", fontSize: "0.85rem",
                      "&:hover": { bgcolor: "#b5956f" },
                    }}
                  >
                    Buy Now
                  </Button>
                </Stack>

                {!inStock && (
                  <Typography color="error" variant="body2" textAlign="center">
                    This variant is currently out of stock.
                  </Typography>
                )}
              </Stack>
            </Grid>
          </Grid>

          {/* ===== RELATED PRODUCTS ===== */}
          {relatedProducts.length > 0 && (
            <Box mt={6}>
              <Divider sx={{ mb: 3 }} />
              <Typography variant="h6" fontWeight="bold" mb={2}>Related Products</Typography>
              <Grid container spacing={2}>
                {relatedProducts.map((rp) => (
                  <Grid size={{ xs: 6, sm: 4, md: 3 }} key={rp.id}>
                    <Card onClick={() => router.push(`/products/${rp.id}`)}
                      sx={{
                        borderRadius: 2.5, cursor: "pointer", transition: "0.3s",
                        "&:hover": { boxShadow: 6, transform: "translateY(-4px)" },
                      }}
                    >
                      <CardMedia component="img" image={getRelatedImage(rp)} alt={rp.name}
                        sx={{ aspectRatio: "1/1", objectFit: "cover" }}
                      />
                      <CardContent sx={{ p: 1.5 }}>
                        <Typography fontWeight="bold" noWrap fontSize="0.85rem">{rp.name}</Typography>
                        <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
                          <Typography color="#c7ab8b" fontWeight="bold" fontSize="0.85rem">
                            Tk {calculateFinalPrice(rp)}
                          </Typography>
                          {rp.discount_value && (
                            <Typography fontSize="0.75rem" color="text.secondary"
                              sx={{ textDecoration: "line-through" }}>
                              Tk {rp.base_price}
                            </Typography>
                          )}
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
}
