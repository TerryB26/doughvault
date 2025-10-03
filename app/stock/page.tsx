"use client";

import React, { useState } from 'react';
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
  LinearProgress,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Warning, Edit, Delete, Visibility as VisibilityIcon, Add, Search } from '@mui/icons-material';
import { useItems, useInventorySummary } from '@/lib/hooks/useQueries';

// Interface for items with category information returned by getItemsWithCategories
interface ItemWithCategory {
  itemid: number;
  itemname: string;
  categoryname: string;
  sku: string;
  quantity: number;
  unit: string;
  reorderthreshold: number;
  costprice: number;
  supplier: string;
  storagelocation: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

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
  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Search and filter states
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ItemWithCategory | null>(null);

  const { data: items = [], isLoading: itemsLoading, error: itemsError } = useItems();
  const { data: summary, isLoading: summaryLoading, error: summaryError } = useInventorySummary();

  // Filter functions
  const getFilteredItems = () => {
    return items.filter((item: ItemWithCategory) => {
      const matchesSearch = item.itemname.toLowerCase().includes(search.toLowerCase()) ||
                           item.categoryname.toLowerCase().includes(search.toLowerCase()) ||
                           item.sku.toLowerCase().includes(search.toLowerCase()) ||
                           item.supplier.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || item.categoryname === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  };

  // Get unique categories for filter
  const getUniqueCategories = (): string[] => {
    const categories = items.map((item: ItemWithCategory) => item.categoryname);
    return [...new Set(categories)].filter(Boolean).sort() as string[];
  };

  // Pagination handlers
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // View modal handler
  const handleViewItem = (item: ItemWithCategory) => {
    setSelectedItem(item);
    setViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setViewModalOpen(false);
    setSelectedItem(null);
  };

  // Get paginated items
  const filteredItems = getFilteredItems();
  const paginatedItems = filteredItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);



  if (itemsLoading || summaryLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (itemsError || summaryError) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Error loading stock data: {itemsError?.message || summaryError?.message}
      </Alert>
    );
  }

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
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{summary?.totalitems || 0}</Typography>
        </Box>
        <Box sx={{ bgcolor: '#fff3e0', p: 2, borderRadius: 2, flex: 1 }}>
          <Typography variant="h6" color="#f57c00">Low Stock</Typography>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            {summary?.lowstockcount || 0}
          </Typography>
        </Box>
        <Box sx={{ bgcolor: '#ffebee', p: 2, borderRadius: 2, flex: 1 }}>
          <Typography variant="h6" color="#d32f2f">Out of Stock</Typography>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            {summary?.outstockcount || 0}
          </Typography>
        </Box>
      </Box>

      {/* Search and Filters */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 250 }}
        />
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="In Stock">In Stock</MenuItem>
            <MenuItem value="Low Stock">Low Stock</MenuItem>
            <MenuItem value="Out of Stock">Out of Stock</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={categoryFilter}
            label="Category"
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            {getUniqueCategories().map((category: string) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
            {paginatedItems.map((item: ItemWithCategory) => (
              <TableRow
                key={item.itemid}
                sx={{ 
                  '&:last-child td, &:last-child th': { border: 0 },
                  '&:hover': { bgcolor: '#f9f9f9' }
                }}
              >
                <TableCell>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {item.itemname}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ${Number(item.costprice).toFixed(2)} per {item.unit}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {item.categoryname || 'Uncategorized'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {item.sku || 'N/A'}
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
                      value={getStockLevel(item.quantity, item.reorderthreshold)}
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
                      Reorder at {item.reorderthreshold} {item.unit}
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
                      {item.supplier || 'Unknown'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.storagelocation || 'Unknown'}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <IconButton 
                      size="small" 
                      sx={{ color: '#2e7d32' }}
                      title="View Details"
                      onClick={() => handleViewItem(item)}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
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
        
        {/* Pagination */}
        <TablePagination
          component="div"
          count={filteredItems.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </TableContainer>

      {/* View Item Modal */}
      <Dialog 
        open={viewModalOpen} 
        onClose={handleCloseViewModal}
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h5" component="div">
            Item Details
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedItem && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mb: 3 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Item Name</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedItem.itemname}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Category</Typography>
                  <Typography variant="body1">{selectedItem.categoryname || 'Uncategorized'}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">SKU</Typography>
                  <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>{selectedItem.sku || 'N/A'}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Current Stock</Typography>
                  <Typography variant="body1">{selectedItem.quantity} {selectedItem.unit}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Reorder Threshold</Typography>
                  <Typography variant="body1">{selectedItem.reorderthreshold} {selectedItem.unit}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                  <Chip 
                    label={selectedItem.status} 
                    color={getStatusColor(selectedItem.status)}
                    size="small"
                  />
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Supplier</Typography>
                  <Typography variant="body1">{selectedItem.supplier || 'Unknown'}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Storage Location</Typography>
                  <Typography variant="body1">{selectedItem.storagelocation || 'Unknown'}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Unit Cost</Typography>
                  <Typography variant="body1">${Number(selectedItem.costprice).toFixed(2)} per {selectedItem.unit}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Unit</Typography>
                  <Typography variant="body1">{selectedItem.unit}</Typography>
                </Box>
              </Box>
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>Stock Level Progress</Typography>
                <LinearProgress
                  variant="determinate"
                  value={getStockLevel(selectedItem.quantity, selectedItem.reorderthreshold)}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: '#e0e0e0',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: 
                        selectedItem.status === 'Out of Stock' ? '#d32f2f' :
                        selectedItem.status === 'Low Stock' ? '#f57c00' : '#2e7d32'
                    }
                  }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  {Math.round(getStockLevel(selectedItem.quantity, selectedItem.reorderthreshold))}% of reorder threshold
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StockPage;
