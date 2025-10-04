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
  DialogActions,
  Tabs,
  Tab
} from '@mui/material';
import { Warning, Edit, Delete, Visibility as VisibilityIcon, Add, Search } from '@mui/icons-material';
import { useItems, useInventorySummary, useItemLogs } from '@/lib/hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/queryKeys';
import Swal from 'sweetalert2';
import StockForms from '@/app/components/stock/StockForms';
import { ItemLog } from '@/lib/models/types';
import { useUserRoles } from '@/lib/hooks/useAuth';

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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ItemWithCategory | null>(null);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [activeTab, setActiveTab] = useState(0);
  
  const queryClient = useQueryClient();
  const { canEdit, canDelete } = useUserRoles();

  const { data: items = [], isLoading: itemsLoading, error: itemsError, refetch: itemsRefetch } = useItems();
  const { data: summary, isLoading: summaryLoading, error: summaryError, refetch: summaryRefetch } = useInventorySummary();
  const { data: logsData, isLoading: logsLoading } = useItemLogs(selectedItem?.itemid || null);

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

  const getUniqueCategories = (): string[] => {
    const categories = items.map((item: ItemWithCategory) => item.categoryname);
    return [...new Set(categories)].filter(Boolean).sort() as string[];
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewItem = (item: ItemWithCategory) => {
    setSelectedItem(item);
    setViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setViewModalOpen(false);
    setSelectedItem(null);
    setActiveTab(0); 
  };

  const handleAddClick = () => {
    setModalMode('add');
    setSelectedItem(null);
    setFormModalOpen(true);
  };

  const handleEditClick = (item: ItemWithCategory) => {
    setModalMode('edit');
    setSelectedItem(item);
    setFormModalOpen(true);
  };

  const handleDeleteClick = async (item: ItemWithCategory) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch('/api/items/actions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'delete', itemid: item.itemid })
        });

        if (!response.ok) throw new Error('Failed to delete item');

        await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ITEMS] });
        await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INVENTORY_SUMMARY] });
        
        await itemsRefetch();
        await summaryRefetch();

        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'The item has been deleted successfully.',
          timer: 2000,
          showConfirmButton: false
        });
      } catch {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete the item. Please try again.'
        });
      }
    }
  };

  const handleCloseFormModal = () => {
    setFormModalOpen(false);
    setSelectedItem(null);
  };

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
        {canEdit && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddClick}
            sx={{ 
              bgcolor: '#d32f2f', 
              '&:hover': { bgcolor: '#b71c1c' }
            }}
          >
            Add New Item
          </Button>
        )}
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
                    {canEdit && (
                      <IconButton 
                        size="small" 
                        sx={{ color: '#1976d2' }}
                        title="Edit Item"
                        onClick={() => handleEditClick(item)}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    )}
                    {canDelete && (
                      <IconButton 
                        size="small" 
                        sx={{ color: '#d32f2f' }}
                        title="Delete Item"
                        onClick={() => handleDeleteClick(item)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    )}
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

      {/* View Item Modal - Modern Design */}
      <Dialog 
        open={viewModalOpen} 
        onClose={handleCloseViewModal}
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography component="span" variant="h5" sx={{ fontWeight: 600, color: '#d32f2f' }}>
              📦 Item Details
            </Typography>
            {selectedItem && (
              <Chip 
                label={selectedItem.status} 
                color={getStatusColor(selectedItem.status)}
                sx={{ fontWeight: 500 }}
              />
            )}
          </Box>
        </DialogTitle>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
            <Tab label="Details" />
            <Tab label="Audit Trail" />
          </Tabs>
        </Box>
        <DialogContent sx={{ pt: 2 }}>
          {selectedItem && (
            <Box>
              {/* Details Tab */}
              {activeTab === 0 && (
                <Box>
                  {/* Header Section with Key Info */}
                  <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {selectedItem.itemname}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      <Chip 
                        label={selectedItem.categoryname || 'Uncategorized'} 
                        size="small" 
                        sx={{ bgcolor: 'white' }}
                      />
                      {selectedItem.sku && (
                        <Chip 
                          label={`SKU: ${selectedItem.sku}`}
                          size="small" 
                          sx={{ bgcolor: 'white', fontFamily: 'monospace' }}
                        />
                      )}
                    </Box>
                  </Paper>

                  {/* Stock Information */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#d32f2f' }}>
                      📊 Stock Information
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                      <Paper elevation={0} sx={{ p: 2, bgcolor: '#f9f9f9', borderRadius: 2, border: '1px solid #e0e0e0' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                          Current Stock
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600, mt: 0.5 }}>
                          {selectedItem.quantity} {selectedItem.unit}
                        </Typography>
                      </Paper>
                      <Paper elevation={0} sx={{ p: 2, bgcolor: '#f9f9f9', borderRadius: 2, border: '1px solid #e0e0e0' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                          Reorder Threshold
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600, mt: 0.5 }}>
                          {selectedItem.reorderthreshold} {selectedItem.unit}
                        </Typography>
                      </Paper>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="caption" fontWeight={500}>Stock Level</Typography>
                        <Typography variant="caption" fontWeight={600}>
                          {Math.round(getStockLevel(selectedItem.quantity, selectedItem.reorderthreshold))}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={getStockLevel(selectedItem.quantity, selectedItem.reorderthreshold)}
                        sx={{
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: '#e0e0e0',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 5,
                            backgroundColor: 
                              selectedItem.status === 'Out of Stock' ? '#d32f2f' :
                              selectedItem.status === 'Low Stock' ? '#f57c00' : '#2e7d32'
                          }
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Pricing & Details */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#d32f2f' }}>
                      💰 Pricing & Details
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>Unit Cost</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#2e7d32' }}>
                          ${Number(selectedItem.costprice).toFixed(2)} / {selectedItem.unit}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>Total Value</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#2e7d32' }}>
                          ${(Number(selectedItem.costprice) * selectedItem.quantity).toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Supplier & Location */}
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#d32f2f' }}>
                      🏢 Supplier & Location
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>Supplier</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {selectedItem.supplier || 'Not specified'}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>Storage Location</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {selectedItem.storagelocation || 'Not specified'}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )}

              {/* Audit Trail Tab */}
              {activeTab === 1 && (
                <Box sx={{ minHeight: 400 }}>
                  {logsLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
                      <CircularProgress />
                    </Box>
                  ) : logsData?.logs && logsData.logs.length > 0 ? (
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Changed By</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Date & Time</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Changes</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Notes</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {logsData.logs.map((log: ItemLog) => (
                            <TableRow key={log.logid}>
                              <TableCell>
                                <Chip 
                                  label={log.action}
                                  size="small"
                                  color={
                                    log.action === 'INSERT' ? 'success' :
                                    log.action === 'UPDATE' ? 'warning' :
                                    log.action === 'DELETE' ? 'error' : 'default'
                                  }
                                />
                              </TableCell>
                              <TableCell>{log.changedbyname || 'System'}</TableCell>
                              <TableCell>
                                {new Date(log.changedon).toLocaleString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </TableCell>
                              <TableCell>
                                <Box sx={{ fontSize: '0.875rem' }}>
                                  {log.quantitychanged && (
                                    <Typography variant="caption" display="block">
                                      Qty: {log.quantitychanged > 0 ? '+' : ''}{log.quantitychanged}
                                    </Typography>
                                  )}
                                  {log.oldvalues && log.newvalues && (
                                    <>
                                      {Object.keys(log.newvalues).map((key) => {
                                        if (log.oldvalues && log.newvalues && log.oldvalues[key] !== log.newvalues[key]) {
                                          const formatValue = (val: unknown) => {
                                            if (val === null || val === undefined) return 'null';
                                            if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(val)) {
                                              return new Date(val).toLocaleString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                              });
                                            }
                                            return String(val);
                                          };
                                          
                                          return (
                                            <Typography key={key} variant="caption" display="block">
                                              <strong>{key}:</strong> {formatValue(log.oldvalues[key])} → {formatValue(log.newvalues[key])}
                                            </Typography>
                                          );
                                        }
                                        return null;
                                      })}
                                    </>
                                  )}
                                </Box>
                              </TableCell>
                              <TableCell>{log.notes || '-'}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: 2 }}>
                      <Typography variant="h6" color="text.secondary">
                        📋 No Audit Trail Available
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        No changes have been recorded for this item yet.
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleCloseViewModal} variant="contained" sx={{ bgcolor: '#d32f2f', '&:hover': { bgcolor: '#b71c1c' } }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Stock Forms Modal */}
      <StockForms
        open={formModalOpen}
        onClose={handleCloseFormModal}
        mode={modalMode}
        selectedItem={selectedItem}
        onRefetch={{
          items: itemsRefetch,
          summary: summaryRefetch
        }}
      />
    </Box>
  );
};

export default StockPage;
