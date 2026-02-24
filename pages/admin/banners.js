"use client";

import AdminLayout from "@/components/AdminLayout";
import supabase from "@/lib/createClient";
import {
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  CircularProgress,
  Card,
  CardMedia,
  CardContent,
  Switch,
  FormControlLabel,
  Stack,
} from "@mui/material";
import React, { useEffect, useState } from "react";


function Banner() {
  const [banners, setBanners] = useState([]);
  const [open, setOpen] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setBanners(data);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setImageFile(null);
    setPreview(null);
    setTitle("");
  };

  const handleSubmit = async () => {
    if (!imageFile) return;

    try {
      setSaving(true);

      const fileName = `banner-${Date.now()}`;

      const { error: uploadError } = await supabase.storage
        .from("banners")
        .upload(fileName, imageFile);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("banners")
        .getPublicUrl(fileName);

      const imageUrl = data.publicUrl;

      const { error } = await supabase.from("banners").insert([
        {
          title,
          image: imageUrl,
          is_active: true,
        },
      ]);

      if (error) throw error;

      fetchBanners();
      handleClose();
    } catch (err) {
      console.log("Upload Error:", err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (banner) => {
    await supabase.from("banners").delete().eq("id", banner.id);

    if (banner.image) {
      const path = banner.image.split("/storage/v1/object/public/banners/")[1];
      await supabase.storage.from("banners").remove([path]);
    }

    fetchBanners();
  };

  const toggleActive = async (banner) => {
    await supabase
      .from("banners")
      .update({ is_active: !banner.is_active })
      .eq("id", banner.id);

    fetchBanners();
  };

  return (
    <AdminLayout>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
        Banner
      </Typography>

      <Button variant="contained" onClick={handleOpen} sx={{ mb: 3 }}>
        Add Banner
      </Button>
      </Stack>
      

      <Box display="flex" flexWrap="wrap" gap={2}>
        {banners.map((banner) => (
          <Card key={banner.id} sx={{ width: 250 }}>
            <CardMedia
              component="img"
              height="150"
              image={banner.image}
            />
            <CardContent>
              <Typography>{banner.title}</Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={banner.is_active}
                    onChange={() => toggleActive(banner)}
                  />
                }
                label="Active"
              />

              <Button
                color="error"
                size="small"
                onClick={() => handleDelete(banner)}
              >
                Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Banner</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Banner Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mt: 2 }}
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              setImageFile(file);
              setPreview(URL.createObjectURL(file));
            }}
            style={{ marginTop: "20px" }}
          />

          {preview && (
            <Box mt={2}>
              <img
                src={preview}
                alt="preview"
                style={{ width: "100%" }}
              />
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? <CircularProgress size={20} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
}

export default Banner;