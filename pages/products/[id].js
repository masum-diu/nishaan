
import React, { useState, useEffect } from "react";
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
import { useCart } from "../../lib/CartContext";
import supabase from "@/lib/createClient";

// In a real app, you'd fetch this from an API based on the ID
const dummyProducts = [
  {
    id: 1,
    name: "Model Code 483 – Running Sneaker",
    price: 1950,
    oldPrice: 2890,
    inStock: true,
    sizes: [40, 41, 42, 43, 44],
    image: "/assets/sun.webp",
    description:
      "A fantastic pair of running sneakers designed for comfort and performance. Made with breathable materials and a durable sole, these shoes are perfect for your daily run or a casual walk in the park.",
  },
  {
    id: 2,
    name: "Model Code 482 – Running Sneaker",
    price: 2100,
    oldPrice: 2800,
    inStock: true,
    sizes: [39, 40, 41],
    image: "/assets/sun.webp",
    description:
      "Stylish and modern, these sneakers offer a blend of fashion and function. The lightweight construction ensures you can wear them all day without discomfort.",
  },
  {
    id: 3,
    name: "Model Code 481 – Running Sneaker",
    price: 1750,
    oldPrice: 2500,
    inStock: false,
    sizes: [42, 43, 44],
    image: "/assets/sun.webp",
    description:
      "Get the best deal on these high-quality sneakers. Limited stock available. Features a unique design that stands out from the crowd.",
  },
  {
    id: 4,
    name: "Model Code 480 – Running Sneaker",
    price: 1999,
    oldPrice: 2999,
    inStock: true,
    sizes: [40, 41, 42],
    image: "/assets/sun.webp",
    description:
      "The latest model in our collection. Experience superior cushioning and support with our advanced sole technology. Perfect for serious athletes.",
  },
];

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Find the product from the dummy data.
  // In a real app, you would fetch this data using the `id`.
  const product = products.find((p) => p.id === id);
  console.log(products, "products lists")
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
  // Set a default size when the product loads
  useEffect(() => {
    if (product && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0]);
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setError("Please select a size.");
      return;
    }
    setError("");
     addToCart({ ...product, quantity, size: selectedSize });
    // Optionally, show a success message/toast
    // alert(`${product.name} (Size: ${selectedSize}) added to cart!`);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      setError("Please select a size.");
      return;
    }
    addToCart({ ...product, quantity, size: selectedSize });
    router.push("/checkout");
  };

  
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
    <Box sx={{ py: 5 }}>
      <Container maxWidth="lg">
        <Grid container spacing={5}>
          {/* Left Side: Product Image */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              component="img"
              src={product.image}
              alt={product.name}
              sx={{
                width: "100%",
                borderRadius: 4,
                border: "1px solid #eee",
              }}
            />
          </Grid>

          {/* Right Side: Product Details */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={2}>
              <Typography variant="h4" fontWeight="bold">
                {product.name}
              </Typography>

              {product.stock ? (
                <Chip label="In Stock" color="success" sx={{ width: "fit-content" }} />
              ) : (
                <Chip label="Out of Stock" color="error" sx={{ width: "fit-content" }} />
              )}

              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="h5" color="error" fontWeight="bold">
                  Tk {product.price}
                </Typography>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ textDecoration: "line-through" }}
                >
                  Tk {product.oldPrice}
                </Typography>
              </Stack>

              <Typography color="text.secondary">
                {product.description}
              </Typography>

              <Divider />

              {/* Size Selection */}
              <Typography fontWeight="bold">Select Size:</Typography>
              <Stack direction="row" spacing={1}>
                {product.sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "contained" : "outlined"}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </Button>
                ))}
              </Stack>

              {error && (
                <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                  {error}
                </Typography>
              )}

              {/* Quantity Selector */}
              <Typography fontWeight="bold">Quantity:</Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <IconButton
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <RemoveIcon />
                </IconButton>
                <Typography sx={{ border: "1px solid #ccc", px: 2, py: 1, borderRadius: 1 }}>
                  {quantity}
                </Typography>
                <IconButton onClick={() => setQuantity(quantity + 1)}>
                  <AddIcon />
                </IconButton>
              </Stack>

              <Divider />

              {/* Action Buttons */}
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button variant="contained" size="large" fullWidth onClick={handleAddToCart} disabled={!product.stock
}>
                  Add to Cart
                </Button>
                <Button variant="outlined" size="large" fullWidth onClick={handleBuyNow} disabled={!product.stock}>
                  Buy Now
                </Button>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}