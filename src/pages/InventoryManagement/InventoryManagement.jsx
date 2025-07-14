// src/pages/InventoryManagement/InventoryManagement.js
import React, { useState, useEffect } from 'react';
import { fetchInventory, addInventory, updateInventory, deleteInventory } from './inventoryApi';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  Search,
  Add,
  Edit,
  Delete,
  Warning,
  CheckCircle,
  Error,
  FilterList,
  GetApp,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

const InventoryItem = ({ item, onEdit, onDelete }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'In Stock': return 'success';
      case 'Low Stock': return 'warning';
      case 'Out of Stock': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'In Stock': return <CheckCircle />;
      case 'Low Stock': return <Warning />;
      case 'Out of Stock': return <Error />;
      default: return null;
    }
  };

  return (
    <TableRow hover>
      <TableCell>{item.sku}</TableCell>
      <TableCell>{item.name}</TableCell>
      <TableCell>{item.category}</TableCell>
      <TableCell align="right">{item.quantity}</TableCell>
      <TableCell align="right">${item.unitPrice}</TableCell>
      <TableCell align="right">${(item.quantity * item.unitPrice).toLocaleString()}</TableCell>
      <TableCell>
        <Chip
          icon={getStatusIcon(item.status)}
          label={item.status}
          color={getStatusColor(item.status)}
          size="small"
        />
      </TableCell>
      <TableCell>{item.location}</TableCell>
      <TableCell>
        <IconButton onClick={() => onEdit(item)} size="small">
          <Edit />
        </IconButton>
        <IconButton onClick={() => onDelete(item.id)} size="small" color="error">
          <Delete />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

const AddEditDialog = ({ open, onClose, item, onSave }) => {
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    category: '',
    quantity: 0,
    unitPrice: 0,
    reorderPoint: 0,
    location: '',
    supplier: '',
  });

  useEffect(() => {
    if (item) {
      setFormData(item);
    } else {
      setFormData({
        sku: '',
        name: '',
        category: '',
        quantity: 0,
        unitPrice: 0,
        reorderPoint: 0,
        location: '',
        supplier: '',
      });
    }
  }, [item, open]);

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {item ? 'Edit Inventory Item' : 'Add New Inventory Item'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="SKU"
              value={formData.sku}
              onChange={handleChange('sku')}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Product Name"
              value={formData.name}
              onChange={handleChange('name')}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                onChange={handleChange('category')}
                label="Category"
              >
                <MenuItem value="Electronics">Electronics</MenuItem>
                <MenuItem value="Clothing">Clothing</MenuItem>
                <MenuItem value="Home & Garden">Home & Garden</MenuItem>
                <MenuItem value="Sports">Sports</MenuItem>
                <MenuItem value="Books">Books</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange('quantity')}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Unit Price"
              type="number"
              value={formData.unitPrice}
              onChange={handleChange('unitPrice')}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Reorder Point"
              type="number"
              value={formData.reorderPoint}
              onChange={handleChange('reorderPoint')}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Location"
              value={formData.location}
              onChange={handleChange('location')}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Supplier"
              value={formData.supplier}
              onChange={handleChange('supplier')}
              required
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          {item ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const [inventoryData, setInventoryData] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

const [searchTerm, setSearchTerm] = useState('');
const [categoryFilter, setCategoryFilter] = useState('');
const [statusFilter, setStatusFilter] = useState('');

const filteredData = inventoryData.filter(item => {
  const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase());
  const matchesCategory = !categoryFilter || item.category === categoryFilter;
  const matchesStatus = !statusFilter || item.status === statusFilter;

  return matchesSearch && matchesCategory && matchesStatus;
});

const loadInventory = async () => {
  setLoading(true);
  setError(null);
  try {
    const data = await fetchInventory();
    setInventoryData(data);
  } catch (err) {
    setError('Failed to fetch inventory data');
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  loadInventory();
}, []);

const handleEdit = (item) => {
  setEditingItem(item);
  setDialogOpen(true);
};

// For now, only add is supported (edit/delete can be implemented similarly)

const handleSave = async (formData) => {
  setLoading(true);
  setError(null);
  try {
    if (editingItem) {
      await updateInventory(editingItem._id || editingItem.id, formData);
    } else {
      await addInventory(formData);
    }
    await loadInventory();
  } catch (err) {
    setError('Failed to save inventory item');
  } finally {
    setLoading(false);
  }
  setEditingItem(null);
  setDialogOpen(false);
};


const handleDelete = async (id) => {
  setLoading(true);
  setError(null);
  try {
    await deleteInventory(id);
    await loadInventory();
  } catch (err) {
    setError('Failed to delete inventory item');
  } finally {
    setLoading(false);
  }
};

const totalValue = inventoryData.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
const lowStockItems = inventoryData.filter(item => item.status === 'Low Stock').length;
const outOfStockItems = inventoryData.filter(item => item.status === 'Out of Stock').length;

const chartData = inventoryData.reduce((acc, item) => {
  const existing = acc.find(x => x.category === item.category);
  if (existing) {
    existing.value += item.quantity * item.unitPrice;
    existing.quantity += item.quantity;
  } else {
    acc.push({
      category: item.category,
      value: item.quantity * item.unitPrice,
      quantity: item.quantity,
    });
  }
  return acc;
}, []);

return (
  <Box>
    {error && <Alert severity="error">{error}</Alert>}
    {loading && <LinearProgress sx={{ mb: 2 }} />}
    <Typography variant="h4" gutterBottom>
      Inventory Management
    </Typography>

    {/* Alerts */}
    {lowStockItems > 0 && (
      <Alert severity="warning" sx={{ mb: 2 }}>
        {lowStockItems} items are running low on stock
      </Alert>
    )}
    {outOfStockItems > 0 && (
      <Alert severity="error" sx={{ mb: 2 }}>
        {outOfStockItems} items are out of stock
      </Alert>
    )}

    {/* Summary Cards */}
    <Grid container spacing={3} mb={3}>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Items
            </Typography>
            <Typography variant="h4">
              {inventoryData.length}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Value
            </Typography>
            <Typography variant="h4">
              ${totalValue.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Low Stock Items
            </Typography>
            <Typography variant="h4" color="warning.main">
              {lowStockItems}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Out of Stock
            </Typography>
            <Typography variant="h4" color="error.main">
              {outOfStockItems}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>

    {/* Charts */}
    <Grid container spacing={3} mb={3}>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2, height: 300 }}>
          <Typography variant="h6" gutterBottom>
            Inventory Value by Category
          </Typography>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Value']} />
              <Bar dataKey="value" fill="#0071ce" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2, height: 300 }}>
          <Typography variant="h6" gutterBottom>
            Stock Levels Trend
          </Typography>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="quantity" stroke="#ffc220" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
    </Grid>

    {/* Controls */}
    <Box display="flex" gap={2} mb={3} flexWrap="wrap">
      <TextField
        placeholder="Search by name or SKU..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
        sx={{ minWidth: 300 }}
      />
      <FormControl sx={{ minWidth: 150 }}>
        <InputLabel>Category</InputLabel>
        <Select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          label="Category"
        >
          <MenuItem value="">All Categories</MenuItem>
          <MenuItem value="Electronics">Electronics</MenuItem>
          <MenuItem value="Clothing">Clothing</MenuItem>
          <MenuItem value="Home & Garden">Home & Garden</MenuItem>
          <MenuItem value="Sports">Sports</MenuItem>
          <MenuItem value="Books">Books</MenuItem>
        </Select>
      </FormControl>
      <FormControl sx={{ minWidth: 150 }}>
        <InputLabel>Status</InputLabel>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          label="Status"
        >
          <MenuItem value="">All Status</MenuItem>
          <MenuItem value="In Stock">In Stock</MenuItem>
          <MenuItem value="Low Stock">Low Stock</MenuItem>
          <MenuItem value="Out of Stock">Out of Stock</MenuItem>
        </Select>
      </FormControl>
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => setDialogOpen(true)}
      >
        Add Item
      </Button>
      <Button
        variant="outlined"
        startIcon={<GetApp />}
      >
        Export
      </Button>
    </Box>

    {/* Inventory Table */}
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>SKU</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Category</TableCell>
            <TableCell align="right">Quantity</TableCell>
            <TableCell align="right">Unit Price</TableCell>
            <TableCell align="right">Total Value</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredData.map((item) => (
            <InventoryItem
              key={item._id || item.id}
              item={item}
              onEdit={handleEdit}
              onDelete={() => handleDelete(item._id || item.id)}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    {/* Add/Edit Dialog */}
    <AddEditDialog
      open={dialogOpen}
      onClose={() => {
        setDialogOpen(false);
        setEditingItem(null);
      }}
      item={editingItem}
      onSave={handleSave}
    />
  </Box>
);
export default InventoryManagement;

