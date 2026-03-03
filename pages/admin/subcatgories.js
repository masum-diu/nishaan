import AdminLayout from '@/components/AdminLayout'
import React, { useState, useEffect } from 'react'
import supabase from '@/lib/createClient'
import {
  Box,
  Typography,
  CircularProgress,
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
  MenuItem,
  Stack,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

export default function Subcategories() {
  const [subcategories, setSubcategories] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [open, setOpen] = useState(false)
  const [editingSubcat, setEditingSubcat] = useState(null)
  const [name, setName] = useState('')
  const [categoryId, setCategoryId] = useState('')

  // ---------------- FETCH ----------------
  const fetchSubcategories = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('subcategories')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setSubcategories(data || [])
    } catch (err) {
      console.log('Fetch Subcategories Error:', err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('id,name')
      .order('name')
    if (error) console.log('Fetch Categories Error:', error.message)
    else setCategories(data || [])
  }

  useEffect(() => {
    fetchCategories()
    fetchSubcategories()
  }, [])

  // ---------------- MODAL ----------------
  const handleOpen = (subcat = null) => {
    if (subcat) {
      setEditingSubcat(subcat)
      setName(subcat.name)
      setCategoryId(subcat.category_id)
    } else {
      setEditingSubcat(null)
      setName('')
      setCategoryId('')
    }
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setEditingSubcat(null)
    setName('')
    setCategoryId('')
  }

  // ---------------- ADD / UPDATE ----------------
  const handleSubmit = async () => {
    if (!name.trim() || !categoryId) return
    try {
      setSaving(true)
      if (editingSubcat) {
        const { data, error } = await supabase
          .from('subcategories')
          .update({ name, category_id: categoryId, updated_at: new Date() })
          .eq('id', editingSubcat.id)
          .select()
          .single()
        if (error) throw error
        setSubcategories(prev =>
          prev.map(sc => (sc.id === editingSubcat.id ? data : sc))
        )
      } else {
        const { data, error } = await supabase
          .from('subcategories')
          .insert([{ name, category_id: categoryId }])
          .select()
          .single()
        if (error) throw error
        setSubcategories(prev => [data, ...prev])
      }
      handleClose()
    } catch (err) {
      console.log('Save Subcategory Error:', err.message)
    } finally {
      setSaving(false)
    }
  }

  // ---------------- DELETE ----------------
  const handleDelete = async subcat => {
    if (!confirm('Are you sure?')) return
    try {
      const { error } = await supabase
        .from('subcategories')
        .delete()
        .eq('id', subcat.id)
      if (error) throw error
      setSubcategories(prev => prev.filter(sc => sc.id !== subcat.id))
    } catch (err) {
      console.log('Delete Subcategory Error:', err.message)
    }
  }

  return (
    <AdminLayout>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          Subcategories
        </Typography>
        <Button variant="contained" onClick={() => handleOpen()}>
          Add Subcategory
        </Button>
      </Stack>

      {loading ? (
        <Box display="flex" justifyContent="center" minHeight={200}>
          <CircularProgress />
        </Box>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell width={150}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subcategories.map(sc => (
              <TableRow key={sc.id}>
                <TableCell>{sc.name}</TableCell>
                <TableCell>
                  {categories.find(c => c.id === sc.category_id)?.name || 'N/A'}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(sc)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(sc)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editingSubcat ? 'Edit Subcategory' : 'Add Subcategory'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Subcategory Name"
            fullWidth
            sx={{ mt: 2 }}
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <TextField
            select
            label="Parent Category"
            fullWidth
            sx={{ mt: 2 }}
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
          >
            {categories.map(cat => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={saving}>
            {saving ? 'Saving...' : editingSubcat ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  )
}