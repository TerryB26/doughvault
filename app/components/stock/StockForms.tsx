"use client";

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  InputAdornment
} from '@mui/material';
import Swal from 'sweetalert2';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/queryKeys';

interface ItemWithCategory {
  itemid: number;
  itemname: string;
  categoryname: string;
  sku: string;
  quantity: number;
  unit: string;
  costprice: number;
  reorderthreshold: number;
  supplier: string;
  storagelocation: string;
  status: string;
}

interface StockFormsProps {
  open: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  selectedItem?: ItemWithCategory | null;
  onRefetch?: {
    items: () => void;
    summary: () => void;
  };
}

const StockForms: React.FC<StockFormsProps> = ({
  open,
  onClose,
  mode,
  selectedItem,
  onRefetch
}) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  // Item form state
  const [itemForm, setItemForm] = useState({
    itemname: '',
    categoryname: '',
    sku: '',
    quantity: 0,
    unit: '',
    costprice: 0,
    reorderthreshold: 0,
    supplier: '',
    storagelocation: ''
  });

  // Initialize form data when selectedItem changes
  useEffect(() => {
    if (open && mode === 'edit' && selectedItem) {
      console.log('Initializing edit form with:', selectedItem);
      setItemForm({
        itemname: selectedItem.itemname || '',
        categoryname: selectedItem.categoryname || '',
        sku: selectedItem.sku || '',
        quantity: selectedItem.quantity || 0,
        unit: selectedItem.unit || '',
        costprice: Number(selectedItem.costprice) || 0,
        reorderthreshold: selectedItem.reorderthreshold || 0,
        supplier: selectedItem.supplier || '',
        storagelocation: selectedItem.storagelocation || ''
      });
    } else if (open && mode === 'add') {
      // Reset form for add mode
      console.log('Resetting form for add mode');
      setItemForm({
        itemname: '',
        categoryname: '',
        sku: '',
        quantity: 0,
        unit: '',
        costprice: 0,
        reorderthreshold: 0,
        supplier: '',
        storagelocation: ''
      });
    }
  }, [mode, selectedItem, open]);

  const handleSubmit = async () => {
    // Validation
    if (!itemForm.itemname || !itemForm.unit || itemForm.quantity < 0 || itemForm.costprice < 0) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill in all required fields with valid values'
      });
      return;
    }

    setLoading(true);
    try {
      const action = mode === 'add' ? 'add' : 'edit';
      const payload = mode === 'edit' ? 
        { ...itemForm, itemid: selectedItem?.itemid } : 
        itemForm;

      const response = await fetch('/api/items/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...payload })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save item');
      }

      // Invalidate related queries to refetch data
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ITEMS] });
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INVENTORY_SUMMARY] });

      // Refetch data if callbacks provided
      if (onRefetch) {
        await onRefetch.items();
        await onRefetch.summary();
      }

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: `Item ${mode === 'add' ? 'created' : 'updated'} successfully`,
        timer: 2000,
        showConfirmButton: false
      });

      onClose();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error instanceof Error ? error.message : `Failed to ${mode} item. Please try again.`
      });
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    return mode === 'add' ? 'Add New Item' : 'Edit Item';
  };

  const categories = [
    'Pizza',
    'Vegetables',
    'Fruits',
    'Meat & Proteins',
    'Dairy & Cheese',
    'Sauces & Condiments',
    'Appetizers', 
    'Beverages',
    'Desserts',
    'Ingredients',
    'Flour & Grains',
    'Oils & Sauces',
    'Packaging',
    'Cleaning Supplies',
    'Equipment Parts',
    'Other'
  ];

  const units = [
    'pieces',
    'lbs',
    'oz',
    'kg',
    'g',
    'liters',
    'ml',
    'gallons',
    'quarts',
    'boxes',
    'bags',
    'bottles',
    'cans',
    'packets',
    'rolls',
    'sheets'
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography component="span" variant="h6">{getTitle()}</Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField
              fullWidth
              label="Item Name"
              value={itemForm.itemname}
              onChange={(e) => setItemForm({ ...itemForm, itemname: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="SKU"
              value={itemForm.sku}
              onChange={(e) => setItemForm({ ...itemForm, sku: e.target.value })}
              placeholder="e.g., PIZZA-001"
            />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                value={itemForm.categoryname}
                label="Category"
                onChange={(e) => setItemForm({ ...itemForm, categoryname: e.target.value })}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth required>
              <InputLabel id="unit-label">Unit</InputLabel>
              <Select
                labelId="unit-label"
                value={itemForm.unit}
                label="Unit"
                onChange={(e) => setItemForm({ ...itemForm, unit: e.target.value })}
              >
                {units.map((unit) => (
                  <MenuItem key={unit} value={unit}>
                    {unit}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField
              fullWidth
              label="Current Quantity"
              type="number"
              value={itemForm.quantity}
              onChange={(e) => setItemForm({ ...itemForm, quantity: Number(e.target.value) })}
              required
              InputProps={{
                inputProps: { min: 0 }
              }}
            />
            <TextField
              fullWidth
              label="Reorder Threshold"
              type="number"
              value={itemForm.reorderthreshold}
              onChange={(e) => setItemForm({ ...itemForm, reorderthreshold: Number(e.target.value) })}
              required
              InputProps={{
                inputProps: { min: 0 }
              }}
            />
          </Box>

          <TextField
            fullWidth
            label="Cost Price"
            type="number"
            value={itemForm.costprice}
            onChange={(e) => setItemForm({ ...itemForm, costprice: Number(e.target.value) })}
            required
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
              inputProps: { min: 0, step: 0.01 }
            }}
          />

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField
              fullWidth
              label="Supplier"
              value={itemForm.supplier}
              onChange={(e) => setItemForm({ ...itemForm, supplier: e.target.value })}
              placeholder="e.g., ABC Food Supplies"
            />
            <TextField
              fullWidth
              label="Storage Location"
              value={itemForm.storagelocation}
              onChange={(e) => setItemForm({ ...itemForm, storagelocation: e.target.value })}
              placeholder="e.g., Freezer A, Shelf B2"
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={loading}
        >
          {loading ? 'Saving...' : (mode === 'add' ? 'Create Item' : 'Update Item')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StockForms;
