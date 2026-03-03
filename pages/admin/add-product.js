import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/AdminLayout";
import {
  Typography,
  TextField,
  Button,
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import supabase from "@/lib/createClient";

export default function ProductsAdminPage() {
  const [products, setProducts] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    base_price: "",
    discount_type: "",
    discount_value: "",
    subcategory_id: "",
  });

  // -------- SLUG GENERATOR --------
  const generateSlug = (text) =>
    text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");

  useEffect(() => {
    fetchProducts();
    fetchSubcategories();
  }, []);

  // -------- FETCH PRODUCTS --------
  const fetchProducts = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select(`*, subcategories ( name )`)
      .order("created_at", { ascending: false });

    if (!error) {
      setProducts(data || []);
    }

    setLoading(false);
  };

  // -------- FETCH SUBCATEGORIES --------
  const fetchSubcategories = async () => {
    const { data } = await supabase
      .from("subcategories")
      .select("id,name")
      .order("name");

    setSubcategories(data || []);
  };

  // -------- OPEN FORM --------
  const handleOpenForm = (product = null) => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        base_price: product.base_price || "",
        discount_type: product.discount_type || "",
        discount_value: product.discount_value || "",
        subcategory_id: product.subcategory_id || "",
      });
      setEditingProduct(product);
    } else {
      setFormData({
        name: "",
        description: "",
        base_price: "",
        discount_type: "",
        discount_value: "",
        subcategory_id: "",
      });
      setEditingProduct(null);
    }
    setOpenForm(true);
  };

  const handleCloseForm = () => setOpenForm(false);

  // -------- INSERT / UPDATE --------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const slug = generateSlug(formData.name);

    const basePrice = Number(formData.base_price) || 0;
    const discountValue = Number(formData.discount_value) || 0;

    const productData = {
      name: formData.name,
      slug,
      description: formData.description,
      base_price: basePrice,
      discount_type: formData.discount_type || null,
      discount_value: discountValue,
      subcategory_id: formData.subcategory_id || null,
    };

    if (editingProduct) {
      await supabase
        .from("products")
        .update(productData)
        .eq("id", editingProduct.id);
    } else {
      await supabase.from("products").insert([productData]);
    }

    await fetchProducts();
    handleCloseForm();
    setLoading(false);
  };

  // -------- DELETE --------
  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;

    setLoading(true);
    await supabase.from("products").delete().eq("id", id);
    await fetchProducts();
    setLoading(false);
  };

  // -------- FINAL PRICE CALC --------
  const calculateFinalPrice = (product) => {
    const base = Number(product.base_price) || 0;
    const discount = Number(product.discount_value) || 0;

    if (!product.discount_type || discount <= 0) {
      return base;
    }

    if (product.discount_type.toLowerCase() === "percentage") {
      const final = base - (base * discount) / 100;
      return final > 0 ? final : 0;
    }

    if (product.discount_type.toLowerCase() === "fixed") {
      const final = base - discount;
      return final > 0 ? final : 0;
    }

    return base;
  };

  return (
    <AdminLayout>
      <Stack direction="row" justifyContent="space-between" mb={3}>
        <Typography variant="h4">Products</Typography>
        <Button variant="contained" onClick={() => handleOpenForm()}>
          Add Product
        </Button>
      </Stack>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Subcategory</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Final Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.subcategories?.name}</TableCell>
                <TableCell>{p.base_price} tk</TableCell>
                <TableCell>
                  {calculateFinalPrice(p).toFixed(2)} tk
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenForm(p)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(p.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* -------- FORM -------- */}
      <Dialog open={openForm} onClose={handleCloseForm} fullWidth maxWidth="sm">
        <DialogTitle>
          {editingProduct ? "Edit Product" : "Add Product"}
        </DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            margin="normal"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />

          <TextField
            fullWidth
            label="Description"
            margin="normal"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

          <TextField
            fullWidth
            type="number"
            label="Base Price"
            margin="normal"
            value={formData.base_price}
            onChange={(e) =>
              setFormData({ ...formData, base_price: e.target.value })
            }
          />

          <TextField
            select
            fullWidth
            label="Discount Type"
            margin="normal"
            value={formData.discount_type}
            onChange={(e) =>
              setFormData({ ...formData, discount_type: e.target.value })
            }
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="percentage">Percentage</MenuItem>
            <MenuItem value="fixed">Fixed</MenuItem>
          </TextField>

          <TextField
            fullWidth
            type="number"
            label="Discount Value"
            margin="normal"
            value={formData.discount_value}
            onChange={(e) =>
              setFormData({ ...formData, discount_value: e.target.value })
            }
          />

          <TextField
            select
            fullWidth
            label="Subcategory"
            margin="normal"
            value={formData.subcategory_id}
            onChange={(e) =>
              setFormData({ ...formData, subcategory_id: e.target.value })
            }
          >
            {subcategories.map((sc) => (
              <MenuItem key={sc.id} value={sc.id}>
                {sc.name}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseForm}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
}