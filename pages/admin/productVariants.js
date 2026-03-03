import React, { useState, useEffect } from 'react'
import AdminLayout from '@/components/AdminLayout'
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
  MenuItem,
  Stack,
  CircularProgress,
  OutlinedInput,
  Select,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import supabase from '@/lib/createClient'

export default function ProductVariantsAdmin() {
  const [variants, setVariants] = useState([])
  const [products, setProducts] = useState([])
  const [sizes, setSizes] = useState([])
  const [colors, setColors] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  const [openForm, setOpenForm] = useState(false)
  const [editingVariant, setEditingVariant] = useState(null)
  const [formData, setFormData] = useState({
    product_id: '',
    size_ids: [],
    color_id: '',
    stock: 0,
    image_file: null, // selected file
    image_url: '', // final url from storage
  })

  // -------- Fetch Data --------
  useEffect(() => {
    fetchVariants()
    fetchProducts()
    fetchSizes()
    fetchColors()
  }, [])

  const fetchVariants = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('product_variants')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) console.log('Fetch variants error:', error)
    else setVariants(data || [])
    setLoading(false)
  }

  const fetchProducts = async () => {
    const { data, error } = await supabase.from('products').select('id,name')
    if (error) console.log('Fetch products error:', error)
    else setProducts(data || [])
  }

  const fetchSizes = async () => {
    const { data, error } = await supabase.from('sizes').select('id,name')
    if (error) console.log('Fetch sizes error:', error)
    else setSizes(data || [])
  }

  const fetchColors = async () => {
    const { data, error } = await supabase.from('colors').select('id,name')
    if (error) console.log('Fetch colors error:', error)
    else setColors(data || [])
  }

  // -------- Form Handlers --------
  const handleOpenForm = (variant = null) => {
    if (variant) {
      setFormData({
        product_id: variant.product_id,
        size_ids: variant.size_ids || [],
        color_id: variant.color_id,
        stock: variant.stock,
        image_file: null,
        image_url: variant.image_url,
      })
      setEditingVariant(variant)
    } else {
      setFormData({
        product_id: '',
        size_ids: [],
        color_id: '',
        stock: 0,
        image_file: null,
        image_url: '',
      })
      setEditingVariant(null)
    }
    setOpenForm(true)
  }

  const handleCloseForm = () => setOpenForm(false)

  // -------- Upload Image to Supabase Storage --------
  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setFormData({ ...formData, image_file: file })
  }

  const uploadImage = async (file) => {
    if (!file) return ''
    setUploading(true)

    // Check user logged in
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) {
      console.log('No user logged in')
      setUploading(false)
      return ''
    }

    const fileName = `${Date.now()}_${file.name}`

    const { data, error } = await supabase.storage
      .from('product_variants') // bucket name
      .upload(fileName, file)

    if (error) {
      console.log('Upload error:', error)
      setUploading(false)
      return ''
    }

    const { data: urlData, error: urlError } = supabase.storage
      .from('product_variants')
      .getPublicUrl(fileName)

    if (urlError) console.log('URL error:', urlError)

    setUploading(false)
    return urlData.publicUrl
  }

  // -------- Submit Variant --------
  const handleSubmit = async (e) => {
    e.preventDefault()

    let imageUrl = formData.image_url
    if (formData.image_file) {
      imageUrl = await uploadImage(formData.image_file)
      if (!imageUrl) {
        alert('Image upload failed. Make sure you are logged in.')
        return
      }
    }

    const payload = {
      product_id: formData.product_id,
      size_ids: formData.size_ids,
      color_id: formData.color_id,
      stock: Number(formData.stock),
      image_url: imageUrl,
    }

    try {
      if (editingVariant) {
        const { error } = await supabase
          .from('product_variants')
          .update(payload)
          .eq('id', editingVariant.id)
        if (error) console.log('Update error:', error)
      } else {
        const { error } = await supabase
          .from('product_variants')
          .insert([payload])
        if (error) console.log('Insert error:', error)
      }
      fetchVariants()
      handleCloseForm()
    } catch (err) {
      console.log('Submit error:', err)
    }
  }

  // -------- Delete Variant --------
  const handleDelete = async (id) => {
    if (!confirm('Delete this variant?')) return
    const { error } = await supabase.from('product_variants').delete().eq('id', id)
    if (error) console.log('Delete error:', error)
    fetchVariants()
  }

  return (
    <AdminLayout>
      <Stack direction="row" justifyContent="space-between" mb={3}>
        <Typography variant="h4">Product Variants</Typography>
        <Button variant="contained" onClick={() => handleOpenForm()}>
          Add Variant
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
              <TableCell>Product</TableCell>
              <TableCell>Sizes</TableCell>
              <TableCell>Color</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {variants.map((v) => (
              <TableRow key={v.id}>
                <TableCell>
                  {products.find((p) => p.id === v.product_id)?.name || '-'}
                </TableCell>
                <TableCell>
                  {v.size_ids?.map((id) => sizes.find((s) => s.id === id)?.name).join(', ') || '-'}
                </TableCell>
                <TableCell>{colors.find((c) => c.id === v.color_id)?.name || '-'}</TableCell>
                <TableCell>
                  {v.image_url ? (
                    <img
                      src={v.image_url}
                      alt="variant"
                      style={{ width: 50, height: 50, objectFit: 'cover' }}
                    />
                  ) : '-'}
                </TableCell>
                <TableCell>{v.stock}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenForm(v)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(v.id)}>
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
        <DialogTitle>{editingVariant ? 'Edit Variant' : 'Add Variant'}</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            margin="normal"
            label="Product"
            value={formData.product_id}
            onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
          >
            {products.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name}
              </MenuItem>
            ))}
          </TextField>

          {/* Sizes Multi-Select */}
          <Select
            multiple
            fullWidth
            value={formData.size_ids}
            onChange={(e) => setFormData({ ...formData, size_ids: e.target.value })}
            input={<OutlinedInput label="Sizes" />}
            renderValue={(selected) =>
              selected.map((id) => sizes.find((s) => s.id === id)?.name).join(', ')
            }
            margin="normal"
          >
            {sizes.map((s) => (
              <MenuItem key={s.id} value={s.id}>
                {s.name}
              </MenuItem>
            ))}
          </Select>

          {/* Color */}
          <TextField
            select
            fullWidth
            margin="normal"
            label="Color"
            value={formData.color_id}
            onChange={(e) => setFormData({ ...formData, color_id: e.target.value })}
          >
            {colors.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>

          {/* Image Upload */}
          <Box mt={2} mb={2}>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {uploading && <Typography>Uploading...</Typography>}
            {formData.image_url && (
              <Box mt={1}>
                <img
                  src={formData.image_url}
                  alt="variant"
                  style={{ width: 80, height: 80, objectFit: 'cover' }}
                />
              </Box>
            )}
          </Box>

          {/* Stock */}
          <TextField
            fullWidth
            type="number"
            margin="normal"
            label="Stock"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
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
  )
}