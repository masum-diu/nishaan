
import React, { useState, useMemo, useEffect } from "react";
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
    Button,
    CircularProgress,
} from "@mui/material";
import { useRouter } from "next/router";
import supabase from "@/lib/createClient";

export default function ShopPage() {
    // ================= DUMMY DATA =================


    // ================= FILTER STATE =================
    const [collection, setCollection] = useState("all");
    const [inStockOnly, setInStockOnly] = useState(false);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
    fetchProducts();

    }, []);

    // ================= SIZE HANDLER =================
  const handleSizeChange = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  // ================= FILTER LOGIC =================
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchCollection =
        collection === "all" || product.collection === collection;

      const matchStock = !inStockOnly || product.stock > 0;

      const matchSize =
        !product.sizes ||
        selectedSizes.length === 0 ||
        product.sizes.some((size) => selectedSizes.includes(Number(size)));

      return matchCollection && matchStock && matchSize;
    });
  }, [products, collection, inStockOnly, selectedSizes]);

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
                    All Products
                </Typography>

                <Grid container spacing={4}>
                    {/* ================= FILTER SIDEBAR ================= */}
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Box sx={{ bgcolor: "#fff", p: 3, borderRadius: 3 }}>
                            {/* Collection */}
                            <Typography fontWeight="bold" mb={2}>
                                Collection
                            </Typography>

                            <RadioGroup
                                value={collection}
                                onChange={(e) => setCollection(e.target.value)}
                            >
                                <FormControlLabel
                                    value="all"
                                    control={<Radio />}
                                    label="All Products"
                                />
                                <FormControlLabel
                                    value="discount"
                                    control={<Radio />}
                                    label="50% Discount"
                                />
                                <FormControlLabel
                                    value="deals"
                                    control={<Radio />}
                                    label="Deals Of The Day"
                                />
                                <FormControlLabel
                                    value="flash"
                                    control={<Radio />}
                                    label="Flash Sale"
                                />
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
                                        onChange={() =>
                                            setInStockOnly(!inStockOnly)
                                        }
                                    />
                                }
                                label="In Stock Only"
                            />

                            <Divider sx={{ my: 3 }} />

                            {/* Sizes */}
                            <Typography fontWeight="bold" mb={2}>
                                Shoe Size
                            </Typography>

                            <Stack spacing={1}>
                                {[39, 40, 41, 42, 43, 44, 45].map((size) => (
                                    <FormControlLabel
                                        key={size}
                                        control={
                                            <Checkbox
                                                checked={selectedSizes.includes(size)}
                                                onChange={() =>
                                                    handleSizeChange(size)
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
                            {filteredProducts.map((product) => (
                                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product.id}>
                                    <Card
                                        onClick={() =>
                                            router.push(`/products/${product.id}`)
                                        }
                                        sx={{
                                            height: "100%",
                                            display: "flex",
                                            flexDirection: "column",
                                            borderRadius: 3,
                                            position: "relative",
                                            transition: "0.3s",
                                            "&:hover": {
                                                boxShadow: 6,
                                                transform: "translateY(-5px)",
                                            },
                                        }}
                                    >
                                        {product.oldPrice > product.price && (
                                            <Chip
                                                label="Sale"
                                                color="error"
                                                size="small"
                                                sx={{
                                                    position: "absolute",
                                                    top: 10,
                                                    right: 10,
                                                }}
                                            />
                                        )}

                                        <CardMedia
                                            component="img"
                                            sx={{ width: '100%' }}
                                            height="220"
                                            image={product.image}
                                            alt={product.name}
                                        />

                                        <CardContent
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                flexGrow: 1,
                                            }}
                                        >
                                            <Box>
                                                <Typography fontWeight="bold" noWrap>
                                                    {product.name}
                                                </Typography>

                                                <Stack direction="row" spacing={1}>
                                                    <Typography color="error" fontWeight="bold">
                                                        Tk {product.price}
                                                    </Typography>
                                                    <Typography
                                                        sx={{ textDecoration: "line-through" }}
                                                        color="text.secondary"
                                                    >
                                                        Tk {product.oldPrice}
                                                    </Typography>
                                                </Stack>

                                                {!product.stock && (
                                                    <Typography color="error" mt={1}>
                                                        Out of Stock
                                                    </Typography>
                                                )}
                                            </Box>

                                            <Stack
                                                direction="row"
                                                spacing={1}
                                                mt="auto"
                                                pt={2}
                                                sx={{
                                                    overflowX: "auto",
                                                    scrollbarWidth: "none", // Firefox
                                                    "&::-webkit-scrollbar": {
                                                        display: "none", // Chrome
                                                    },
                                                }}
                                            >
                                                {product.sizes.map((size) => (
                                                    <Button
                                                        key={size}
                                                        size="small"
                                                        variant="outlined"
                                                        sx={{
                                                            minWidth: 40,
                                                            flexShrink: 0, // Important: prevent shrinking
                                                        }}
                                                    >
                                                        {size}
                                                    </Button>
                                                ))}
                                            </Stack>

                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
