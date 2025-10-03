"use client";

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Chip,
  Button,
  IconButton,
  LinearProgress
} from '@mui/material';
import { Edit, Delete, Add, Warning } from '@mui/icons-material';

interface StockItem {
  id: number;
  name: string;
  category: string;
  sku: string;
  quantity: number;
  unit: string;
  reorderThreshold: number;
  costPrice: number;
  supplier: string;
  location: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

const dummyStock: StockItem[] = [
  {
    id: 1,
    name: '00 Flour (Tipo 00)',
    category: 'Flour & Grains',
    sku: 'FLOUR-00-25KG',
    quantity: 150,
    unit: 'kg',
    reorderThreshold: 25,
    costPrice: 2.50,
    supplier: 'Caputo Flour Co.',
    location: 'Dry Storage Room A',
    status: 'In Stock'
  },
  {
    id: 2,
    name: 'Mozzarella Cheese (Low Moisture)',
    category: 'Dairy Products',
    sku: 'CHEESE-MOZ-5LB',
    quantity: 15,
    unit: 'lbs',
    reorderThreshold: 15,
    costPrice: 4.50,
    supplier: 'Grande Cheese Co.',
    location: 'Walk-in Cooler',
    status: 'Low Stock'
  },
  {
    id: 3,
    name: 'Pepperoni (Sliced)',
    category: 'Meats & Proteins',
    sku: 'MEAT-PEP-5LB',
    quantity: 50,
    unit: 'lbs',
    reorderThreshold: 10,
    costPrice: 6.50,
    supplier: 'Hormel Foods',
    location: 'Walk-in Cooler',
    status: 'In Stock'
  },
  {
    id: 4,
    name: 'Fresh Basil',
    category: 'Vegetables',
    sku: 'VEG-BASIL-1LB',
    quantity: 0,
    unit: 'lbs',
    reorderThreshold: 1,
    costPrice: 12.00,
    supplier: 'Local Organic Farm',
    location: 'Walk-in Cooler',
    status: 'Out of Stock'
  },
  {
    id: 5,
    name: 'Pizza Boxes (16 inch)',
    category: 'Packaging',
    sku: 'PKG-BOX-16IN',
    quantity: 500,
    unit: 'pieces',
    reorderThreshold: 100,
    costPrice: 0.85,
    supplier: 'WestRock Packaging',
    location: 'Storage Room C',
    status: 'In Stock'
  },
  {
    id: 6,
    name: 'San Marzano Tomatoes',
    category: 'Vegetables',
    sku: 'VEG-TOM-SM-28OZ',
    quantity: 12,
    unit: 'cans',
    reorderThreshold: 12,
    costPrice: 4.50,
    supplier: 'Cento Fine Foods',
    location: 'Dry Storage Room B',
    status: 'Low Stock'
  }
];

const getStatusColor = (status: string): 'success' | 'warning' | 'error' => {
  switch (status) {
    case 'In Stock': return 'success';
    case 'Low Stock': return 'warning';
    case 'Out of Stock': return 'error';
    default: return 'success';
  }
};

const getStockLevel = (quantity: number, threshold: number): number => {
  if (quantity === 0) return 0;
  const ratio = quantity / (threshold * 3);
  return Math.min(Math.max(ratio * 100, 5), 100);
};

const StockPage = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
          📦 Stock Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{ 
            bgcolor: '#d32f2f', 
            '&:hover': { bgcolor: '#b71c1c' }
          }}
        >
          Add New Item
        </Button>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <Box sx={{ bgcolor: '#e8f5e8', p: 2, borderRadius: 2, flex: 1 }}>
          <Typography variant="h6" color="#2e7d32">Total Items</Typography>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{dummyStock.length}</Typography>
        </Box>
        <Box sx={{ bgcolor: '#fff3e0', p: 2, borderRadius: 2, flex: 1 }}>
          <Typography variant="h6" color="#f57c00">Low Stock</Typography>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            {dummyStock.filter(item => item.status === 'Low Stock').length}
          </Typography>
        </Box>
        <Box sx={{ bgcolor: '#ffebee', p: 2, borderRadius: 2, flex: 1 }}>
          <Typography variant="h6" color="#d32f2f">Out of Stock</Typography>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            {dummyStock.filter(item => item.status === 'Out of Stock').length}
          </Typography>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="stock management table">
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Item</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>SKU</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Stock Level</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Supplier</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dummyStock.map((item) => (
              <TableRow
                key={item.id}
                sx={{ 
                  '&:last-child td, &:last-child th': { border: 0 },
                  '&:hover': { bgcolor: '#f9f9f9' }
                }}
              >
                <TableCell>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ${item.costPrice.toFixed(2)} per {item.unit}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {item.category}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {item.sku}
                  </Typography>
                </TableCell>
                <TableCell sx={{ minWidth: 150 }}>
                  <Box>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      {item.quantity} {item.unit}
                      {item.status === 'Low Stock' && (
                        <Warning sx={{ ml: 1, fontSize: 16, color: '#f57c00' }} />
                      )}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={getStockLevel(item.quantity, item.reorderThreshold)}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: '#e0e0e0',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: 
                            item.status === 'Out of Stock' ? '#d32f2f' :
                            item.status === 'Low Stock' ? '#f57c00' : '#2e7d32'
                        }
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Reorder at {item.reorderThreshold} {item.unit}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={item.status} 
                    color={getStatusColor(item.status)}
                    size="small"
                    sx={{ fontWeight: 500 }}
                  />
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2">
                      {item.supplier}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.location}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <IconButton 
                      size="small" 
                      sx={{ color: '#1976d2' }}
                      title="Edit Item"
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      sx={{ color: '#d32f2f' }}
                      title="Delete Item"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default StockPage;
