import React from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';

const StatCard = ({ title, value, icon, color }) => (
  <Card sx={{ display: 'flex', alignItems: 'center', p: 2, borderRadius: 3, boxShadow: 2 }}>
    <Box sx={{ bgcolor: color, borderRadius: '50%', p: 2, color: '#fff', mr: 2 }}>
      {icon}
    </Box>
    <Box>
      <Typography color="text.secondary">{title}</Typography>
      <Typography variant="h5" fontWeight="bold">{value}</Typography>
    </Box>
  </Card>
);

function AdminDashboard() {
  return (
    <AdminLayout>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard title="Total Revenue" value="Tk 1,25,000" icon={<AttachMoneyIcon />} color="success.main" />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard title="Total Orders" value="350" icon={<ShoppingCartIcon />} color="primary.main" />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard title="Total Customers" value="150" icon={<PeopleIcon />} color="secondary.main" />
        </Grid>
      </Grid>
    </AdminLayout>
  );
}

export default AdminDashboard;