import AdminLayout from '@/components/AdminLayout'
import { Typography } from '@mui/material'
import React from 'react'

function customers() {
  return (
    <AdminLayout>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Customers
      </Typography>
      </AdminLayout>
  )
}

export default customers