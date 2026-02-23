import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/AdminLayout";
import {
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Box,
  Input,
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
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import supabase from "@/lib/createClient";



export default function ProductsAdminPage() {
  const [products, setProducts] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    oldPrice: "",
    sizes: "",
    collection: "",
    image: null,
  });

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
  

  const handleOpenForm = (product = null) => {
    if (product) {
      // prefill for edit
      setFormData({
        name: product.name,
        description: product.description || "",
        price: product.price,
        oldPrice: product.oldPrice || "",
        sizes: product.sizes.join(","),
        collection: product.collection || "",
        image: null,
      });
      setEditingProduct(product);
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        oldPrice: "",
        sizes: "",
        collection: "",
        image: null,
      });
      setEditingProduct(null);
    }
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingProduct) {
      // UPDATE logic
      console.log("Update product:", editingProduct.id, formData);
    } else {
      // ADD logic
      console.log("Add new product:", formData);
    }
    handleCloseForm();
  };

  const handleDelete = (id) => {
    // DELETE logic
    setProducts(products.filter((p) => p.id !== id));
  };

  return (
    <AdminLayout>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          Products
        </Typography>
        <Button variant="contained" onClick={() => handleOpenForm()}>
          Add New Product
        </Button>
      </Stack>


      {/* ================= TABLE ================= */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Sizes</TableCell>
            {/* <TableCell>Collection</TableCell> */}
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((p) => (
            <TableRow key={p.id}>
              <TableCell>{p.name}</TableCell>
              <TableCell>{p.price}tk</TableCell>
              {/* <TableCell>{p.oldPrice}</TableCell> */}
              <TableCell>{p.sizes.join(",")}</TableCell>
              {/* <TableCell>{p.description}</TableCell> */}
              <TableCell>
                <IconButton onClick={() => handleOpenForm(p)}><EditIcon /></IconButton>
                <IconButton onClick={() => handleDelete(p.id)} color="error"><DeleteIcon /></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* ================= CARD FORM MODAL ================= */}
      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <DialogTitle>{editingProduct ? "Edit Product" : "Add Product"}</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  name="name"
                  label="Product Name"
                  fullWidth
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  name="description"
                  label="Description"
                  multiline
                  rows={4}
                  fullWidth
                  value={formData.description}
                  onChange={handleChange}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  name="price"
                  label="Price"
                  type="number"
                  fullWidth
                  required
                  value={formData.price}
                  onChange={handleChange}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  name="oldPrice"
                  label="Old Price"
                  type="number"
                  fullWidth
                  value={formData.oldPrice}
                  onChange={handleChange}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  name="sizes"
                  label="Sizes (comma-separated)"
                  fullWidth
                  required
                  value={formData.sizes}
                  onChange={handleChange}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  name="collection"
                  label="Collection"
                  fullWidth
                  value={formData.collection}
                  onChange={handleChange}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                  fullWidth
                >
                  Upload Image
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    name="image"
                    onChange={handleChange}
                  />
                </Button>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingProduct ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
}