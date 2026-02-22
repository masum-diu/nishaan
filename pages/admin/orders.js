import AdminLayout from '@/components/AdminLayout'
import { Typography } from '@mui/material'
import React from 'react'

function orders() {
  return (
    <AdminLayout>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Orders
      </Typography>
      </AdminLayout>
  )
}

export default orders