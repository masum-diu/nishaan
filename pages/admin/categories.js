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

// ================= OPEN FORM =================
const handleOpen = (category = null) => {
  if (category) {
    setEditingCategory(category);
    setName(category.name);
  } else {
    setEditingCategory(null);
    setName("");
  }
  setOpen(true);
};

const handleClose = () => {
  setOpen(false);
  setEditingCategory(null);
  setName("");
};

// ================= ADD / UPDATE =================
const handleSubmit = async () => {
  if (!name.trim()) return;

  try {
    setSaving(true);

    if (editingCategory) {
      // UPDATE
      const { data, error } = await supabase
        .from("categories")
        .update({ name })
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
        .insert([{ name }])
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
const handleDelete = async (id) => {
  if (!confirm("Are you sure?")) return;

  try {
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) throw error;

    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  } catch (err) {
    console.log("Delete Error:", err.message);
  }
};

  return (
    <AdminLayout>

      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Categories
        </Typography>

        <Button
          variant="contained"
          sx={{ mb: 3 }}
          onClick={() => handleOpen()}
        >
          Add Category
        </Button>
      </Stack>
      {/* ================= TABLE ================= */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
          <CircularProgress />
        </Box>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell width={150}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((cat) => (
              <TableRow key={cat.id}>
                <TableCell>{cat.name}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(cat)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(cat.id)}
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editingCategory ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
}

export default CategoriesPage;