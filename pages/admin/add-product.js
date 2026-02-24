import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/AdminLayout";
import {
  Typography,
  Grid,
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
  Checkbox,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import supabase from "@/lib/createClient";

export default function ProductsAdminPage() {
  const [products, setProducts] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    old_price: "",
    sizes: "",
    stock: "",
    image: null,
    imageUrl: "",
    is_featured: false,
    is_best_selling: false,
    is_on_sale: false,
    colors: [],
  });

  const [colorName, setColorName] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    setProducts(data || []);
    setLoading(false);
  };

  const handleOpenForm = (product = null) => {
    if (product) {
      setFormData({
        ...product,
        sizes: product.sizes?.join(","),
        image: null,
        imageUrl: product.image,
        colors: product.colors || [],
      });
      setEditingProduct(product);
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        old_price: "",
        sizes: "",
        stock: "",
        image: null,
        imageUrl: "",
        is_featured: false,
        is_best_selling: false,
        is_on_sale: false,
        colors: [],
      });
      setEditingProduct(null);
    }
    setOpenForm(true);
  };

  const handleCloseForm = () => setOpenForm(false);

  const uploadImage = async (file) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `product-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("products")
      .upload(fileName, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("products").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleColorImages = async (e) => {
    const files = Array.from(e.target.files);
    const uploaded = [];

    for (let file of files) {
      const url = await uploadImage(file);
      uploaded.push(url);
    }

    setFormData((prev) => ({
      ...prev,
      colors: [...prev.colors, { color: colorName, images: uploaded }],
    }));

    setColorName("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = formData.imageUrl;

    if (formData.image) {
      imageUrl = await uploadImage(formData.image);
    }

    const productData = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      old_price: Number(formData.old_price),
      stock: Number(formData.stock),
      sizes: formData.sizes.split(","),
      image: imageUrl,
      is_featured: formData.is_featured,
      is_best_selling: formData.is_best_selling,
      is_on_sale: formData.is_on_sale,
      colors: formData.colors,
    };

    if (editingProduct) {
      await supabase.from("products").update(productData).eq("id", editingProduct.id);
    } else {
      await supabase.from("products").insert([productData]);
    }

    await fetchProducts();
    handleCloseForm();
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      await supabase.from("products").delete().eq("id", id);
      fetchProducts();
    }
  };

  return (
    <AdminLayout>
      <Stack direction="row" justifyContent="space-between" mb={3}>
        <Typography variant="h4">Products</Typography>
        <Button variant="contained" onClick={() => handleOpenForm()}>Add Product</Button>
      </Stack>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}><CircularProgress /></Box>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.price} tk</TableCell>
                <TableCell>{p.stock}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenForm(p)}><EditIcon /></IconButton>
                  <IconButton color="error" onClick={() => handleDelete(p.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <DialogTitle>{editingProduct ? "Edit Product" : "Add Product"}</DialogTitle>
        <DialogContent>
          <Box component="form" mt={2}>
            <TextField fullWidth label="Name" margin="normal" value={formData.name} onChange={(e)=>setFormData({...formData,name:e.target.value})}/>
            <TextField fullWidth label="Description" margin="normal" value={formData.description} onChange={(e)=>setFormData({...formData,description:e.target.value})}/>
            <TextField fullWidth label="Price" type="number" margin="normal" value={formData.price} onChange={(e)=>setFormData({...formData,price:e.target.value})}/>
            <TextField fullWidth label="Old Price" type="number" margin="normal" value={formData.old_price} onChange={(e)=>setFormData({...formData,old_price:e.target.value})}/>
            <TextField fullWidth label="Stock" type="number" margin="normal" value={formData.stock} onChange={(e)=>setFormData({...formData,stock:e.target.value})}/>
            <TextField fullWidth label="Sizes (40,41,42)" margin="normal" value={formData.sizes} onChange={(e)=>setFormData({...formData,sizes:e.target.value})}/>

            <Button component="label" variant="contained" sx={{ mt: 2 }}>
              Upload Main Image
              <input type="file" hidden onChange={(e)=>{
                const file = e.target.files[0];
                setFormData({...formData,image:file,imageUrl:URL.createObjectURL(file)});
              }}/>
            </Button>

            {formData.imageUrl && (
              <Box mt={2}>
                <img src={formData.imageUrl} alt="preview" style={{width:"100%",maxHeight:200,objectFit:"contain"}}/>
              </Box>
            )}

            <Box mt={3}>
              <TextField label="Color code" value={colorName} onChange={(e)=>setColorName(e.target.value)}/>
              <Button component="label" sx={{ ml: 2 }}>
                Upload Color Images
                <input type="file" hidden multiple onChange={handleColorImages}/>
              </Button>
            </Box>

            {/* Color Preview */}
            {formData?.colors?.map((c, idx) => (
              <Box key={idx} mt={2}>
                <Typography variant="subtitle1">{c.color}</Typography>
                <Box display="flex" gap={1} flexWrap="wrap">
                  {c.images.map((img,i)=><img key={i} src={img} style={{width:80,height:80,objectFit:"cover"}}/>)}
                </Box>
              </Box>
            ))}

            <FormControlLabel control={<Checkbox checked={formData.is_featured} onChange={(e)=>setFormData({...formData,is_featured:e.target.checked})}/>} label="Featured"/>
            <FormControlLabel control={<Checkbox checked={formData.is_best_selling} onChange={(e)=>setFormData({...formData,is_best_selling:e.target.checked})}/>} label="Best Selling"/>
            <FormControlLabel control={<Checkbox checked={formData.is_on_sale} onChange={(e)=>setFormData({...formData,is_on_sale:e.target.checked})}/>} label="On Sale"/>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={20}/> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
}