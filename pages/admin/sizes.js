import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import {
  Typography,
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
  TextField,
  Stack,
  CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import supabase from '@/lib/createClient';

export default function SizesAdmin() {
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [editingSize, setEditingSize] = useState(null);
  const [formData, setFormData] = useState({ name: '' });

  useEffect(() => {
    fetchSizes();
  }, []);

  const fetchSizes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('sizes')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) console.log(error);
    else setSizes(data || []);
    setLoading(false);
  };

  const handleOpenForm = (size = null) => {
    if (size) {
      setFormData({ name: size.name });
      setEditingSize(size);
    } else {
      setFormData({ name: '' });
      setEditingSize(null);
    }
    setOpenForm(true);
  };

  const handleCloseForm = () => setOpenForm(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) return;

    try {
      if (editingSize) {
        await supabase
          .from('sizes')
          .update({ name: formData.name })
          .eq('id', editingSize.id);
      } else {
        await supabase.from('sizes').insert([{ name: formData.name }]);
      }
      fetchSizes();
      handleCloseForm();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this size?')) return;
    await supabase.from('sizes').delete().eq('id', id);
    fetchSizes();
  };

  return (
    <AdminLayout>
      <Stack direction="row" justifyContent="space-between" mb={3}>
        <Typography variant="h4">Sizes</Typography>
        <Button variant="contained" onClick={() => handleOpenForm()}>
          Add Size
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
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sizes.map((s) => (
              <TableRow key={s.id}>
                <TableCell>{s.name}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenForm(s)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(s.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={openForm} onClose={handleCloseForm} fullWidth maxWidth="sm">
        <DialogTitle>{editingSize ? 'Edit Size' : 'Add Size'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Size Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
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