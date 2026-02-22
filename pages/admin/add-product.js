import React from 'react';
import AdminLayout from '../../components/AdminLayout';
import {
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Box,
  Input,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

function AddProductPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    alert('Product submitted!');
  };

  return (
    <AdminLayout>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Add New Product
      </Typography>
      <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12,  }}>
                <TextField label="Product Name" fullWidth required />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField label="Product Description" multiline rows={4} fullWidth required />
              </Grid>
              <Grid size={{ xs: 12,  }}>
                <TextField label="Price" type="number" fullWidth required />
              </Grid>
              <Grid size={{ xs: 12, }}>
                <TextField label="Old Price (Optional)" type="number" fullWidth />
              </Grid>
              <Grid size={{ xs: 12,  }}>
                <TextField label="Sizes (comma-separated)" helperText="e.g., 40,41,42" fullWidth required />
              </Grid>
              <Grid size={{ xs: 12, }}>
                <TextField label="Collection" helperText="e.g., flash, deals" fullWidth />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                  fullWidth
                >
                  Upload Image
                  <input type="file" hidden accept="image/*" />
                </Button>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Button type="submit" variant="contained" size="large">Add Product</Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}

export default AddProductPage;