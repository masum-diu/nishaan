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
  Select,
  Checkbox,
  ListItemText,
  OutlinedInput,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
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
    entries: [{ size_id: '', color_id: '', stock: 0, image_urls: [], image_files: [] }],
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
  const blankEntry = () => ({ size_ids: [], color_id: '', stock: 0, image_urls: [], image_files: [] })

  const handleOpenForm = (variant = null) => {
    if (variant) {
      setFormData({
        product_id: variant.product_id,
        entries: variant.entries?.length
          ? variant.entries.map(e => ({ ...e, size_ids: e.size_ids || [], image_urls: e.image_urls || [], image_files: [] }))
          : [blankEntry()],
      })
      setEditingVariant(variant)
    } else {
      setFormData({ product_id: '', entries: [blankEntry()] })
      setEditingVariant(null)
    }
    setOpenForm(true)
  }

  const handleCloseForm = () => setOpenForm(false)

  const updateEntry = (index, field, value) => {
    const updated = [...formData.entries]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, entries: updated })
  }

  const addEntry = () =>
    setFormData({ ...formData, entries: [...formData.entries, blankEntry()] })

  const removeEntry = (index) =>
    setFormData({ ...formData, entries: formData.entries.filter((_, i) => i !== index) })

  const handleEntryImage = (index, e) => {
    const file = e.target.files[0]
    if (!file) return
    const updated = [...formData.entries]
    updated[index] = {
      ...updated[index],
      image_files: [...updated[index].image_files, file],
    }
    setFormData({ ...formData, entries: updated })
    e.target.value = ''
  }

  const removeEntryImage = (entryIndex, imgIndex, isNew) => {
    const updated = [...formData.entries]
    if (isNew) {
      updated[entryIndex] = {
        ...updated[entryIndex],
        image_files: updated[entryIndex].image_files.filter((_, i) => i !== imgIndex),
      }
    } else {
      updated[entryIndex] = {
        ...updated[entryIndex],
        image_urls: updated[entryIndex].image_urls.filter((_, i) => i !== imgIndex),
      }
    }
    setFormData({ ...formData, entries: updated })
  }

  // -------- Image Upload --------
  const uploadImage = async (file) => {
    const fileName = `${Date.now()}_${file.name}`
    const { error } = await supabase.storage.from('product_variants').upload(fileName, file)
    if (error) { console.log('Upload error:', error); return '' }
    const { data: urlData } = supabase.storage.from('product_variants').getPublicUrl(fileName)
    return urlData.publicUrl
  }

  // -------- Submit Variant --------
  const handleSubmit = async (e) => {
    e.preventDefault()
    setUploading(true)

    const entries = await Promise.all(
      formData.entries.map(async (entry) => {
        const newUrls = await Promise.all(entry.image_files.map(uploadImage))
        const image_urls = [...(entry.image_urls || []), ...newUrls.filter(Boolean)]
        return { size_ids: entry.size_ids, color_id: entry.color_id, stock: Number(entry.stock), image_urls }
      })
    )

    const payload = { product_id: formData.product_id, entries }

    try {
      if (editingVariant) {
        const { error } = await supabase.from('product_variants').update(payload).eq('id', editingVariant.id)
        if (error) console.log('Update error:', error)
      } else {
        const { error } = await supabase.from('product_variants').insert([payload])
        if (error) console.log('Insert error:', error)
      }
      fetchVariants()
      handleCloseForm()
    } catch (err) {
      console.log('Submit error:', err)
    }
    setUploading(false)
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
              <TableCell>Entries (Size / Color / Stock / Image)</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {variants.map((v) => (
              <TableRow key={v.id}>
                <TableCell>{products.find((p) => p.id === v.product_id)?.name || '-'}</TableCell>
                <TableCell>
                  {v.entries?.map((e, i) => (
                    <Stack key={i} direction="row" spacing={1} alignItems="center" mb={0.5}>
                      <Stack direction="row" spacing={0.5}>
                        {e.image_urls?.map((url, j) => (
                          <img key={j} src={url} alt="" style={{ width: 36, height: 36, objectFit: 'cover' }} />
                        ))}
                      </Stack>
                      <Box fontSize={12}>
                        {e.size_ids?.map(id => sizes.find(s => s.id === id)?.name).filter(Boolean).join(', ') || '?'} /
                        {colors.find((c) => c.id === e.color_id)?.name || '?'} /
                        Stock: {e.stock}
                      </Box>
                    </Stack>
                  )) || '-'}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenForm(v)}><EditIcon /></IconButton>
                  <IconButton color="error" onClick={() => handleDelete(v.id)}><DeleteIcon /></IconButton>
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
          {/* Product */}
          <TextField
            select fullWidth margin="normal" label="Product"
            value={formData.product_id}
            onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
          >
            {products.map((p) => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
          </TextField>

          {/* Entries: Size + Color + Stock + Image */}
          {formData.entries.map((entry, i) => (
            <Box key={i} border="1px solid #e0e0e0" borderRadius={1} p={1.5} mt={1.5}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Select
                  multiple
                  size="small"
                  displayEmpty
                  value={entry.size_ids}
                  onChange={(e) => updateEntry(i, 'size_ids', e.target.value)}
                 
                  input={<OutlinedInput />}
                  renderValue={(selected) =>
                    selected.length === 0
                      ? <span style={{ color: '#aaa' }}>Sizes</span>
                      : selected.map(id => sizes.find(s => s.id === id)?.name).join(', ')
                  }
                  sx={{ flex: 1 }}
                  MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
                >
                  {sizes.map((s) => (
                    <MenuItem key={s.id} value={s.id}>
                      <Checkbox checked={(entry.size_ids || []).includes(s.id)} size="small" />
                      <ListItemText primary={s.name} />
                    </MenuItem>
                  ))}
                </Select>
                <TextField
                  select size="small" label="Color" value={entry.color_id} sx={{ flex: 1 }}
                  onChange={(e) => updateEntry(i, 'color_id', e.target.value)} 
                >
                  {colors.map((c) => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
                </TextField>
                <TextField
                  size="small" type="number" label="Stock" value={entry.stock} sx={{ width: 80 }}
                  onChange={(e) => updateEntry(i, 'stock', e.target.value)}
                />
                <IconButton size="small" color="error" onClick={() => removeEntry(i)}
                  disabled={formData.entries.length === 1}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Stack>
              <Stack direction="row" flexWrap="wrap" gap={1} mt={1}>
                {entry.image_urls?.map((url, j) => (
                  <Box key={`saved-${j}`} position="relative">
                    <img src={url} alt="" style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 4 }} />
                    <IconButton size="small" color="error"
                      sx={{ position: 'absolute', top: -6, right: -6, bgcolor: 'white', p: 0.2 }}
                      onClick={() => removeEntryImage(i, j, false)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
                {entry.image_files?.map((file, j) => (
                  <Box key={`new-${j}`} position="relative">
                    <img src={URL.createObjectURL(file)} alt="" style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 4 }} />
                    <IconButton size="small" color="error"
                      sx={{ position: 'absolute', top: -6, right: -6, bgcolor: 'white', p: 0.2 }}
                      onClick={() => removeEntryImage(i, j, true)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
                <Button size="small" component="label" variant="outlined" sx={{ height: 56 }}>
                  + Image
                  <input type="file" accept="image/*" hidden onChange={(e) => handleEntryImage(i, e)} />
                </Button>
              </Stack>
            </Box>
          ))}
          <Button size="small" startIcon={<AddIcon />} onClick={addEntry} sx={{ mt: 1.5 }}>
            Add More
          </Button>
          {uploading && <Typography variant="caption" ml={1}>Uploading...</Typography>}
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