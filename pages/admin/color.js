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

export default function ColorsAdmin() {
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [editingColor, setEditingColor] = useState(null);
  const [formData, setFormData] = useState({ name: '', hex_code: '' });

  useEffect(() => {
    fetchColors();
  }, []);

  const fetchColors = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('colors')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) console.log(error);
    else setColors(data || []);
    setLoading(false);
  };

  const handleOpenForm = (color = null) => {
    if (color) {
      setFormData({ name: color.name, hex_code: color.hex_code });
      setEditingColor(color);
    } else {
      setFormData({ name: '', hex_code: '' });
      setEditingColor(null);
    }
    setOpenForm(true);
  };

  const handleCloseForm = () => setOpenForm(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.hex_code) return;

    try {
      if (editingColor) {
        await supabase
          .from('colors')
          .update({ name: formData.name, hex_code: formData.hex_code })
          .eq('id', editingColor.id);
      } else {
        await supabase.from('colors').insert([{ name: formData.name, hex_code: formData.hex_code }]);
      }
      fetchColors();
      handleCloseForm();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this color?')) return;
    await supabase.from('colors').delete().eq('id', id);
    fetchColors();
  };

  return (
    <AdminLayout>
      <Stack direction="row" justifyContent="space-between" mb={3}>
        <Typography variant="h4">Colors</Typography>
        <Button variant="contained" onClick={() => handleOpenForm()}>
          Add Color
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
              <TableCell>Hex Code</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {colors.map((c) => (
              <TableRow key={c.id}>
                <TableCell>{c.name}</TableCell>
                <TableCell>
                  <Box
                    sx={{
                      width: 30,
                      height: 30,
                      backgroundColor: c.hex_code,
                      border: '1px solid #ccc',
                    }}
                  />
                  {c.hex_code}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenForm(c)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(c.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={openForm} onClose={handleCloseForm} fullWidth maxWidth="sm">
        <DialogTitle>{editingColor ? 'Edit Color' : 'Add Color'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Color Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Hex Code"
            type="color"
            value={formData.hex_code}
            onChange={(e) => setFormData({ ...formData, hex_code: e.target.value })}
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