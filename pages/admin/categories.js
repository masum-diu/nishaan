
import AdminLayout from "@/components/AdminLayout";
import supabase from "@/lib/createClient";
import {
  Box,
  CircularProgress,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useEffect, useState } from "react";

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [open, setOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [name, setName] = useState("");

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // ================= FETCH =================
  const fetchCategories = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setCategories(data || []);
    } catch (err) {
      console.log("Fetch Error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ================= OPEN =================
  const handleOpen = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setName(category.name);
      setPreview(category.image);
    } else {
      setEditingCategory(null);
      setName("");
      setPreview(null);
    }
    setImageFile(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingCategory(null);
    setName("");
    setImageFile(null);
    setPreview(null);
  };

  // ================= ADD / UPDATE =================
  const handleSubmit = async () => {
    if (!name.trim()) return;

    try {
      setSaving(true);

      let imageUrl = editingCategory?.image || null;

      // ===== IMAGE UPLOAD =====
      if (imageFile) {
        const fileName = `categories/${Date.now()}-${imageFile.name}`;

        const { error: uploadError } = await supabase.storage
          .from("categories")
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("categories")
          .getPublicUrl(fileName);

        imageUrl = data.publicUrl;
      }

      if (editingCategory) {
        // UPDATE
        const { data, error } = await supabase
          .from("categories")
          .update({ name, image: imageUrl })
          .eq("id", editingCategory.id)
          .select()
          .single();

        if (error) throw error;

        setCategories((prev) =>
          prev.map((cat) =>
            cat.id === editingCategory.id ? data : cat
          )
        );
      } else {
        // INSERT
        const { data, error } = await supabase
          .from("categories")
          .insert([{ name, image: imageUrl }])
          .select()
          .single();

        if (error) throw error;

        setCategories((prev) => [data, ...prev]);
      }

      handleClose();
    } catch (err) {
      console.log("Save Error:", err.message);
    } finally {
      setSaving(false);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (cat) => {
    if (!confirm("Are you sure?")) return;

    try {
      // Delete from storage
      if (cat.image) {
        const path = cat.image.split(
          "/storage/v1/object/public/categories/"
        )[1];

        await supabase.storage
          .from("categories")
          .remove([path]);
      }

      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", cat.id);

      if (error) throw error;

      setCategories((prev) =>
        prev.filter((item) => item.id !== cat.id)
      );
    } catch (err) {
      console.log("Delete Error:", err.message);
    }
  };

  return (
    <AdminLayout>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" fontWeight="bold">
          Categories
        </Typography>

        <Button variant="contained" onClick={() => handleOpen()}>
          Add Category
        </Button>
      </Stack>

      {/* ================= TABLE ================= */}
      {loading ? (
        <Box display="flex" justifyContent="center" minHeight={200}>
          <CircularProgress />
        </Box>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Image</TableCell>
              <TableCell width={150}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((cat) => (
              <TableRow key={cat.id}>
                <TableCell>{cat.name}</TableCell>
                <TableCell>
                  <img
                    src={cat.image || "default-image.jpg"}
                    alt="Category"
                    style={{
                      width: "100px",
                      height: "80px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(cat)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(cat)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* ================= MODAL ================= */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {editingCategory ? "Edit Category" : "Add Category"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Category Name"
            fullWidth
            sx={{ mt: 2 }}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="file"
            accept="image/*"
            style={{ marginTop: "20px" }}
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setImageFile(file);
                setPreview(URL.createObjectURL(file));
              }
            }}
          />

          {preview && (
            <Box mt={2}>
              <img
                src={preview}
                alt="Preview"
                style={{
                  width: "150px",
                  height: "120px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : editingCategory
              ? "Update"
              : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
}

export default CategoriesPage;